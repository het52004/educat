import Student from "../../models/student/Student.model.js";
import Feedback from "../../models/Feedback.model.js";
import Course from "../../models/Course.model.js";

export const getAllStudents = async (req, res) => {
  const students = await Student.find().select("-password -resetPasswordOtp -resetPasswordOtpExpires").sort({ createdAt: -1 });
  return res.json({ success: true, students });
};

export const getStudentById = async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId)
    .select("-password -resetPasswordOtp -resetPasswordOtpExpires")
    .populate("enrolledCourses", "title category price");
  if (!student) return res.json({ success: false, message: "Student not found!" });
  return res.json({ success: true, student });
};

export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId);
  if (!student) return res.json({ success: false, message: "Student not found!" });

  // Clean up related feedback and rating entries left by this student
  const feedbacks = await Feedback.find({ addedBy: studentId });
  await Promise.all(
    feedbacks.map((f) => Course.findByIdAndUpdate(f.course, { $pull: { ratings: f.rating } }))
  );
  await Feedback.deleteMany({ addedBy: studentId });

  await Student.findByIdAndDelete(studentId);
  return res.json({ success: true, message: "Student deleted successfully!" });
};
