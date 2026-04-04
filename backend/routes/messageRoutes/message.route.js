import express from "express";
import {
    getInstructorsForStudent,
    getStudentsForInstructor,
    getMessages,
    sendMessage,
} from "../../controllers/messageControllers/message.controller.js";
import verifyStudent from "../../middleware/verifyStudent.js";
import verifyInstructor from "../../middleware/verifyInstructor.js";

const tryStudent = async (req, res, next) => {
    try {
        await verifyStudent(req, res, next);
    } catch {
        next();
    }
};

const tryInstructor = async (req, res, next) => {
    try {
        await verifyInstructor(req, res, next);
    } catch {
        next();
    }
};

const router = express.Router();

router.get("/instructors", verifyStudent, getInstructorsForStudent);
router.get("/students", verifyInstructor, getStudentsForInstructor);
router.get("/:conversationId", getMessages);
router.post("/send", tryStudent, tryInstructor, sendMessage);

export default router;
