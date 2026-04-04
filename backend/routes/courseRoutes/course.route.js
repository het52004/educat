import express from "express";
import {
    createCourse,
    getInstructorCourses,
    deleteCourse,
    updateCourse,
    getAllPublishedCourses,
    getCourseById,
} from "../../controllers/courseControllers/course.controller.js";
import verifyInstructor from "../../middleware/verifyInstructor.js";

const router = express.Router();

router.get("/all", getAllPublishedCourses);
router.get("/:courseId", getCourseById);

router.post("/create", verifyInstructor, createCourse);
router.get("/instructor-courses", verifyInstructor, getInstructorCourses);
router.delete("/delete/:courseId", verifyInstructor, deleteCourse);
router.put("/update/:courseId", verifyInstructor, updateCourse);

export default router;
