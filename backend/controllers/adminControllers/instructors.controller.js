import Instructor from "../../models/instructor/Instructor.model.js";
import Course from "../../models/Course.model.js";
import Lecture from "../../models/Lecture.model.js";
import Feedback from "../../models/Feedback.model.js";
import Student from "../../models/student/Student.model.js";

export const getAllInstructors = async (req, res) => {
  const instructors = await Instructor.find()
    .select("-password -resetPasswordOtp -resetPasswordOtpExpires")
    .populate("courses", "title")
    .sort({ createdAt: -1 });
  return res.json({ success: true, instructors });
};

export const getInstructorById = async (req, res) => {
  const { instructorId } = req.params;
  const instructor = await Instructor.findById(instructorId)
    .select("-password -resetPasswordOtp -resetPasswordOtpExpires")
    .populate("courses", "title category price isPublished");
  if (!instructor) return res.json({ success: false, message: "Instructor not found!" });
  return res.json({ success: true, instructor });
};

export const deleteInstructor = async (req, res) => {
  const { instructorId } = req.params;
  const instructor = await Instructor.findById(instructorId);
  if (!instructor) return res.json({ success: false, message: "Instructor not found!" });

  const courseIds = instructor.courses;

  // Cascade delete everything tied to this instructor's courses
  await Lecture.deleteMany({ courseId: { $in: courseIds } });
  await Feedback.deleteMany({ course: { $in: courseIds } });
  await Student.updateMany(
    { enrolledCourses: { $in: courseIds } },
    { $pull: { enrolledCourses: { $in: courseIds } } }
  );
  await Course.deleteMany({ _id: { $in: courseIds } });

  await Instructor.findByIdAndDelete(instructorId);
  return res.json({ success: true, message: "Instructor deleted successfully!" });
};
