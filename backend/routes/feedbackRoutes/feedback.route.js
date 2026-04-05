import express from "express";
import { submitFeedback, getCourseFeedback, getMyFeedback, deleteFeedback } from "../../controllers/feedbackControllers/feedback.controller.js";
import verifyStudent from "../../middleware/verifyStudent.js";

const router = express.Router();

router.get("/course/:courseId", getCourseFeedback);
router.get("/my/:courseId", verifyStudent, getMyFeedback);
router.post("/submit/:courseId", verifyStudent, submitFeedback);
router.delete("/:feedbackId", verifyStudent, deleteFeedback);

export default router;
