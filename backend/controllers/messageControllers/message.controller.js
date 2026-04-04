import Message from "../../models/Message.model.js";
import Student from "../../models/student/Student.model.js";
import Instructor from "../../models/instructor/Instructor.model.js";

export const getInstructorsForStudent = async (req, res) => {
    const instructors = await Instructor.find({}, "name email");
    return res.json({ success: true, instructors });
};

export const getStudentsForInstructor = async (req, res) => {
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
    if (!conversationId || !text || !senderRole) return res.json({ success: false, message: "Missing fields!" });

    let senderId, senderName;
    if (senderRole === "student") {
        if (!req.student) return res.status(401).json({ success: false, tokenExpired: true, message: "Login again!" });
        senderId = req.student._id;
        senderName = req.student.fullName;
    } else {
        if (!req.instructor) return res.status(401).json({ success: false, tokenExpired: true, message: "Login again!" });
        senderId = req.instructor._id;
        senderName = req.instructor.name;
    }

    const message = await Message.create({ conversationId, senderId, senderRole, senderName, text });
    return res.json({ success: true, message });
};
