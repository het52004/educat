import Student from "../../models/student/Student.model.js";
import Course from "../../models/Course.model.js";

export const enrollCourse = async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.json({ success: false, message: "Course not found!" });

    const alreadyEnrolled = req.student.enrolledCourses.map(String).includes(String(courseId));
    if (alreadyEnrolled) return res.json({ success: false, message: "Already enrolled in this course!" });

    // $addToSet is atomic and only adds the id if it isn't already present, so
    // duplicate enrollments can't be created even from a double-click or a
    // retried request racing the check above.
    await Student.findByIdAndUpdate(req.student._id, { $addToSet: { enrolledCourses: courseId } });
    const updatedStudent = await Student.findById(req.student._id).select("-password");
    return res.json({ success: true, message: "Enrolled successfully!", studentData: updatedStudent });
};

export const isEnrolled = async (req, res) => {
    const { courseId } = req.params;
    const enrolled = req.student.enrolledCourses.map(String).includes(String(courseId));
    return res.json({ success: true, enrolled });
};

export const unenrollCourse = async (req, res) => {
    const { courseId } = req.params;

    const isEnrolled = req.student.enrolledCourses.map(String).includes(String(courseId));
    if (!isEnrolled) return res.json({ success: false, message: "You are not enrolled in this course!" });

    // Only removes the course from the student's enrolled list. Certificates
    // already earned and reviews already left for this course are deliberately
    // left untouched — unenrolling shouldn't erase what the student already earned.
    await Student.findByIdAndUpdate(req.student._id, { $pull: { enrolledCourses: courseId } });
    const updatedStudent = await Student.findById(req.student._id).select("-password");
    return res.json({ success: true, message: "Unenrolled successfully!", studentData: updatedStudent });
};
