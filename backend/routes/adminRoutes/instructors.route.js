import express from "express";
import { getAllInstructors, getInstructorById, deleteInstructor } from "../../controllers/adminControllers/instructors.controller.js";
import verifyAdmin from "../../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/instructors", verifyAdmin, getAllInstructors);
router.get("/instructors/:instructorId", verifyAdmin, getInstructorById);
router.delete("/instructors/:instructorId", verifyAdmin, deleteInstructor);

export default router;
