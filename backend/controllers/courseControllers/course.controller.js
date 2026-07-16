import Course from "../../models/Course.model.js";
import Instructor from "../../models/instructor/Instructor.model.js";
import Lecture from "../../models/Lecture.model.js";

// Attaches the real, live lecture count to a single course object (plain object, not a mongoose doc)
const withLectureCount = async (course) => {
    const lectureCount = await Lecture.countDocuments({ courseId: course._id });
    return { ...course, lectureCount };
};

// Attaches the real, live lecture count to a list of course objects in one query (avoids N+1 lookups)
const withLectureCounts = async (courses) => {
    if (courses.length === 0) return courses;
    const counts = await Lecture.aggregate([
        { $match: { courseId: { $in: courses.map((c) => c._id) } } },
        { $group: { _id: "$courseId", count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach((c) => { countMap[String(c._id)] = c.count; });
    return courses.map((c) => ({ ...c, lectureCount: countMap[String(c._id)] || 0 }));
};

export const createCourse = async (req, res) => {
    const { title, description, price, category, thumbnail } = req.body;
    if (!title || !description || !price || !category) return res.json({ success: false, message: "Fill all required details!" });

    const course = await Course.create({
        title, description,
        price: Number(price),
        category,
        thumbnail: thumbnail || "",
        isPublished: true,
        addedBy: req.instructor._id,
    });
    if (!course) return res.json({ success: false, message: "Failed to create course!" });

    await Instructor.findByIdAndUpdate(req.instructor._id, { $push: { courses: course._id } });
    // Freshly created course has no lectures uploaded yet
    return res.json({ success: true, message: "Course published successfully!", course: { ...course.toObject(), lectureCount: 0 } });
};

export const getInstructorCourses = async (req, res) => {
    const courses = await Course.find({ addedBy: req.instructor._id }).lean();
    const coursesWithCounts = await withLectureCounts(courses);
    return res.json({ success: true, courses: coursesWithCounts });
};

export const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId, addedBy: req.instructor._id });
    if (!course) return res.json({ success: false, message: "Course not found!" });

    await Course.deleteOne({ _id: courseId });
    await Instructor.findByIdAndUpdate(req.instructor._id, { $pull: { courses: course._id } });
    return res.json({ success: true, message: "Course deleted successfully!" });
};

export const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const { title, description, price, category, thumbnail } = req.body;

    const course = await Course.findOne({ _id: courseId, addedBy: req.instructor._id });
    if (!course) return res.json({ success: false, message: "Course not found!" });

    const updated = await Course.findByIdAndUpdate(
        courseId,
        { title, description, price: Number(price), category, thumbnail },
        { new: true }
    ).lean();
    const updatedWithCount = await withLectureCount(updated);
    return res.json({ success: true, message: "Course updated successfully!", course: updatedWithCount });
};

export const getAllPublishedCourses = async (req, res) => {
    const courses = await Course.find({ isPublished: true }).populate("addedBy", "name").lean();
    const coursesWithCounts = await withLectureCounts(courses);
    return res.json({ success: true, courses: coursesWithCounts });
};

export const getCourseById = async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("addedBy", "name").lean();
    if (!course) return res.json({ success: false, message: "Course not found!" });
    const courseWithCount = await withLectureCount(course);
    return res.json({ success: true, course: courseWithCount });
};
