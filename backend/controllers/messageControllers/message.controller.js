import Message from "../../models/Message.model.js";
import Student from "../../models/student/Student.model.js";
import Instructor from "../../models/instructor/Instructor.model.js";
import jwt from "jsonwebtoken";
import { env } from "../../utils/envValues.js";

const getStudentFromToken = async (req) => {
    const token = req.cookies?.token;
    if (!token) return null;
    const decoded = jwt.verify(token, env.jwt_secret);
    return await Student.findById(decoded.id).select("-password");
};

const getInstructorFromToken = async (req) => {
    const token = req.cookies?.instructorToken;
    if (!token) return null;
    const decoded = jwt.verify(token, env.jwt_secret);
    return await Instructor.findById(decoded.id).select("-password");
};

export const getInstructorsForStudent = async (req, res) => {
    const student = await getStudentFromToken(req);
    if (!student) return res.json({ success: false, message: "Login again!" });
    const instructors = await Instructor.find({}, "name email");
    return res.json({ success: true, instructors });
};

export const getStudentsForInstructor = async (req, res) => {
    const instructor = await getInstructorFromToken(req);
    if (!instructor) return res.json({ success: false, message: "Login again!" });
    const students = await Student.find({}, "fullName email");
    return res.json({ success: true, students });
};

export const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    return res.json({ success: true, messages });
};

export const sendMessage = async (req, res) => {
    const { conversationId, text, senderRole } = req.body;
    if (!conversationId || !text || !senderRole) {
        return res.json({ success: false, message: "Missing fields!" });
    }

    let sender = null;
    let senderName = "";
    let senderId = null;

    if (senderRole === "student") {
        sender = await getStudentFromToken(req);
        if (!sender) return res.json({ success: false, message: "Login again!" });
        senderName = sender.fullName;
        senderId = sender._id;
    } else {
        sender = await getInstructorFromToken(req);
        if (!sender) return res.json({ success: false, message: "Login again!" });
        senderName = sender.name;
        senderId = sender._id;
    }

    const message = await Message.create({ conversationId, senderId, senderRole, senderName, text });
    return res.json({ success: true, message });
};
