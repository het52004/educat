import Feedback from "../../models/Feedback.model.js";
import Course from "../../models/Course.model.js";

export const submitFeedback = async (req, res) => {
    const { courseId } = req.params;
    const { rating, description } = req.body;

    if (!rating || !description) return res.json({ success: false, message: "Rating and review are required!" });
    if (rating < 1 || rating > 5) return res.json({ success: false, message: "Rating must be between 1 and 5!" });

    const isEnrolled = req.student.enrolledCourses.map(String).includes(String(courseId));
    if (!isEnrolled) return res.json({ success: false, message: "You must be enrolled to review this course!" });

    const existing = await Feedback.findOne({ course: courseId, addedBy: req.student._id });
    if (existing) return res.json({ success: false, message: "You have already reviewed this course!" });

    const feedback = await Feedback.create({
        course: courseId,
        addedBy: req.student._id,
        rating: Number(rating),
        description,
    });

    // Update course ratings array
    await Course.findByIdAndUpdate(courseId, { $push: { ratings: Number(rating) } });

    await feedback.populate("addedBy", "fullName");
    return res.json({ success: true, message: "Review submitted!", feedback });
};

export const getCourseFeedback = async (req, res) => {
    const { courseId } = req.params;
    const feedbacks = await Feedback.find({ course: courseId })
        .populate("addedBy", "fullName")
        .sort({ createdAt: -1 });
    return res.json({ success: true, feedbacks });
};

export const getMyFeedback = async (req, res) => {
    const { courseId } = req.params;
    const feedback = await Feedback.findOne({ course: courseId, addedBy: req.student._id });
    return res.json({ success: true, feedback });
};

export const deleteFeedback = async (req, res) => {
    const { feedbackId } = req.params;
    const feedback = await Feedback.findOne({ _id: feedbackId, addedBy: req.student._id });
    if (!feedback) return res.json({ success: false, message: "Review not found!" });

    // Remove rating from course
    await Course.findByIdAndUpdate(feedback.course, { $pull: { ratings: feedback.rating } });
    await Feedback.deleteOne({ _id: feedbackId });
    return res.json({ success: true, message: "Review deleted!" });
};
