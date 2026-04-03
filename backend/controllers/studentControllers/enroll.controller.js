import Student from "../../models/student/Student.model.js";
import Course from "../../models/Course.model.js";
import jwt from "jsonwebtoken";
import { env } from "../../utils/envValues.js";

const getStudent = async (req) => {
    const token = req.cookies?.token;
    if (!token) return null;
    const decoded = jwt.verify(token, env.jwt_secret);
    return await Student.findById(decoded.id);
};

export const enrollCourse = async (req, res) => {
    const student = await getStudent(req);
    if (!student) return res.json({ success: false, message: "Login again!" });

    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.json({ success: false, message: "Course not found!" });

    const alreadyEnrolled = student.enrolledCourses.map(String).includes(String(courseId));
    if (alreadyEnrolled) return res.json({ success: false, message: "Already enrolled in this course!" });

    student.enrolledCourses.push(courseId);
    await student.save();

    const updatedStudent = await Student.findById(student._id).select("-password");
    return res.json({ success: true, message: "Enrolled successfully!", studentData: updatedStudent });
};

export const isEnrolled = async (req, res) => {
    const student = await getStudent(req);
    if (!student) return res.json({ success: false, enrolled: false });

    const { courseId } = req.params;
    const enrolled = student.enrolledCourses.map(String).includes(String(courseId));
    return res.json({ success: true, enrolled });
};
