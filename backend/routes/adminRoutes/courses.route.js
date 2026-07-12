import express from "express";
import { getAllCourses, toggleCoursePublish, deleteCourseAsAdmin } from "../../controllers/adminControllers/courses.controller.js";
import verifyAdmin from "../../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/courses", verifyAdmin, getAllCourses);
router.patch("/courses/:courseId/toggle-publish", verifyAdmin, toggleCoursePublish);
router.delete("/courses/:courseId", verifyAdmin, deleteCourseAsAdmin);

export default router;
