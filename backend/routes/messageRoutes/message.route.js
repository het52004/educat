import express from "express";
import {
    getInstructorsForStudent,
    getStudentsForInstructor,
    getMessages,
    sendMessage,
} from "../../controllers/messageControllers/message.controller.js";

const app = express();

app.get("/instructors", getInstructorsForStudent);
app.get("/students", getStudentsForInstructor);
app.get("/:conversationId", getMessages);
app.post("/send", sendMessage);

export default app;
