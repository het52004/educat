import express from "express";
import { getAllFeedback, deleteFeedbackAsAdmin } from "../../controllers/adminControllers/feedback.controller.js";
import verifyAdmin from "../../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/feedback", verifyAdmin, getAllFeedback);
router.delete("/feedback/:feedbackId", verifyAdmin, deleteFeedbackAsAdmin);

export default router;
