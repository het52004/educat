import express from "express";
import jwt from "jsonwebtoken";
import Student from "../../models/student/Student.model.js";
import Instructor from "../../models/instructor/Instructor.model.js";
import { env } from "../../utils/envValues.js";
import {
    getInstructorsForStudent,
    getStudentsForInstructor,
    getMessages,
    sendMessage,
} from "../../controllers/messageControllers/message.controller.js";
import verifyStudent from "../../middleware/verifyStudent.js";
import verifyInstructor from "../../middleware/verifyInstructor.js";

const attachSender = async (req, res, next) => {
    try {
        const studentToken = req.cookies?.token;
        if (studentToken) {
            const decoded = jwt.verify(studentToken, env.jwt_secret);
            const student = await Student.findById(decoded.id).select("-password");
            if (student) { req.student = student; return next(); }
        }
    } catch {}

    try {
        const instructorToken = req.cookies?.instructorToken;
        if (instructorToken) {
            const decoded = jwt.verify(instructorToken, env.jwt_secret);
            const instructor = await Instructor.findById(decoded.id).select("-password");
            if (instructor) { req.instructor = instructor; return next(); }
        }
    } catch {}

    return res.status(401).json({ success: false, tokenExpired: true, message: "Please login again." });
};

const router = express.Router();

router.get("/instructors", verifyStudent, getInstructorsForStudent);
router.get("/students", verifyInstructor, getStudentsForInstructor);
router.get("/:conversationId", getMessages);
router.post("/send", attachSender, sendMessage);

export default router;
