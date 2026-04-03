import express from "express";
import {
    createCourse,
    getInstructorCourses,
    deleteCourse,
    updateCourse,
    getAllPublishedCourses,
    getCourseById,
} from "../../controllers/courseControllers/course.controller.js";

const app = express();

app.post("/create", createCourse);
app.get("/instructor-courses", getInstructorCourses);
app.delete("/delete/:courseId", deleteCourse);
app.put("/update/:courseId", updateCourse);
app.get("/all", getAllPublishedCourses);
app.get("/:courseId", getCourseById);

export default app;
