import Student from "../../models/student/Student.model.js";
import Course from "../../models/Course.model.js";

export const enrollCourse = async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.json({ success: false, message: "Course not found!" });

    const alreadyEnrolled = req.student.enrolledCourses.map(String).includes(String(courseId));
    if (alreadyEnrolled) return res.json({ success: false, message: "Already enrolled in this course!" });

    await Student.findByIdAndUpdate(req.student._id, { $push: { enrolledCourses: courseId } });
    const updatedStudent = await Student.findById(req.student._id).select("-password");
    return res.json({ success: true, message: "Enrolled successfully!", studentData: updatedStudent });
};

export const isEnrolled = async (req, res) => {
    const { courseId } = req.params;
    const enrolled = req.student.enrolledCourses.map(String).includes(String(courseId));
    return res.json({ success: true, enrolled });
};
