import Course from "../../models/Course.model.js";
import Instructor from "../../models/instructor/Instructor.model.js";
import Lecture from "../../models/Lecture.model.js";
import Feedback from "../../models/Feedback.model.js";
import Student from "../../models/student/Student.model.js";

export const getAllCourses = async (req, res) => {
  const courses = await Course.find().populate("addedBy", "name email").sort({ createdAt: -1 });
  return res.json({ success: true, courses });
};

export const toggleCoursePublish = async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) return res.json({ success: false, message: "Course not found!" });

  course.isPublished = !course.isPublished;
  await course.save();
  return res.json({ success: true, message: `Course ${course.isPublished ? "published" : "unpublished"} successfully!`, course });
};

export const deleteCourseAsAdmin = async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) return res.json({ success: false, message: "Course not found!" });

  await Lecture.deleteMany({ courseId });
  await Feedback.deleteMany({ course: courseId });
  await Student.updateMany({ enrolledCourses: courseId }, { $pull: { enrolledCourses: courseId } });
  if (course.addedBy) {
    await Instructor.findByIdAndUpdate(course.addedBy, { $pull: { courses: courseId } });
  }
  await Course.findByIdAndDelete(courseId);

  return res.json({ success: true, message: "Course deleted successfully!" });
};
