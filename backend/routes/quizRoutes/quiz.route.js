import express from "express";
import {
    createQuiz,
    getQuizByCourse,
    getQuizForStudent,
    submitQuiz,
    getCertificate,
    getMyCertificates,
    deleteQuiz,
} from "../../controllers/quizControllers/quiz.controller.js";
import verifyStudent from "../../middleware/verifyStudent.js";
import verifyInstructor from "../../middleware/verifyInstructor.js";

const router = express.Router();

// Instructor
router.post("/create/:courseId", verifyInstructor, createQuiz);
router.get("/instructor/:courseId", verifyInstructor, getQuizByCourse);
router.delete("/:courseId", verifyInstructor, deleteQuiz);

// Student
router.get("/student/:courseId", verifyStudent, getQuizForStudent);
router.post("/submit/:courseId", verifyStudent, submitQuiz);
router.get("/certificate/:courseId", verifyStudent, getCertificate);
router.get("/certificates/mine", verifyStudent, getMyCertificates);

export default router;
