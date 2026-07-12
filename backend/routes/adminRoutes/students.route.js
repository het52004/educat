import express from "express";
import { getAllStudents, getStudentById, deleteStudent } from "../../controllers/adminControllers/students.controller.js";
import verifyAdmin from "../../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/students", verifyAdmin, getAllStudents);
router.get("/students/:studentId", verifyAdmin, getStudentById);
router.delete("/students/:studentId", verifyAdmin, deleteStudent);

export default router;
