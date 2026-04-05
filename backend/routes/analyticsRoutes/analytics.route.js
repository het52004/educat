import express from "express";
import { getInstructorAnalytics } from "../../controllers/analyticsControllers/analytics.controller.js";
import verifyInstructor from "../../middleware/verifyInstructor.js";

const router = express.Router();

router.get("/instructor", verifyInstructor, getInstructorAnalytics);

export default router;
