import Feedback from "../../models/Feedback.model.js";
import Course from "../../models/Course.model.js";

export const getAllFeedback = async (req, res) => {
  const feedbacks = await Feedback.find()
    .populate("addedBy", "fullName email")
    .populate("course", "title")
    .sort({ createdAt: -1 });
  return res.json({ success: true, feedbacks });
};

export const deleteFeedbackAsAdmin = async (req, res) => {
  const { feedbackId } = req.params;
  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) return res.json({ success: false, message: "Feedback not found!" });

  await Course.findByIdAndUpdate(feedback.course, { $pull: { ratings: feedback.rating } });
  await Feedback.findByIdAndDelete(feedbackId);

  return res.json({ success: true, message: "Feedback deleted successfully!" });
};
