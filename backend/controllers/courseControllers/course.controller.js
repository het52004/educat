import Course from "../../models/Course.model.js";
import Instructor from "../../models/instructor/Instructor.model.js";

export const createCourse = async (req, res) => {
    const { title, description, price, category, thumbnail, duration, lectures } = req.body;
    if (!title || !description || !price || !category) return res.json({ success: false, message: "Fill all required details!" });

    const course = await Course.create({
        title, description,
        price: Number(price),
        category,
        thumbnail: thumbnail || "",
        duration: duration || "",
        lectures: Number(lectures) || 0,
        isPublished: true,
        addedBy: req.instructor._id,
    });
    if (!course) return res.json({ success: false, message: "Failed to create course!" });

    await Instructor.findByIdAndUpdate(req.instructor._id, { $push: { courses: course._id } });
    return res.json({ success: true, message: "Course published successfully!", course });
};

export const getInstructorCourses = async (req, res) => {
    const courses = await Course.find({ addedBy: req.instructor._id });
    return res.json({ success: true, courses });
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
    const { title, description, price, category, thumbnail, duration, lectures } = req.body;

    const course = await Course.findOne({ _id: courseId, addedBy: req.instructor._id });
    if (!course) return res.json({ success: false, message: "Course not found!" });

    const updated = await Course.findByIdAndUpdate(
        courseId,
        { title, description, price: Number(price), category, thumbnail, duration, lectures: Number(lectures) },
        { new: true }
    );
    return res.json({ success: true, message: "Course updated successfully!", course: updated });
};

export const getAllPublishedCourses = async (req, res) => {
    const courses = await Course.find({ isPublished: true }).populate("addedBy", "name");
    return res.json({ success: true, courses });
};

export const getCourseById = async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("addedBy", "name");
    if (!course) return res.json({ success: false, message: "Course not found!" });
    return res.json({ success: true, course });
};
