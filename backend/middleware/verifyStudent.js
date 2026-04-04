import jwt from "jsonwebtoken";
import Student from "../models/student/Student.model.js";
import { env } from "../utils/envValues.js";

const verifyStudent = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ success: false, tokenExpired: true, message: "Session expired. Please login again." });
        }
        const decoded = jwt.verify(token, env.jwt_secret);
        const student = await Student.findById(decoded.id).select("-password");
        if (!student) {
            return res.status(401).json({ success: false, tokenExpired: true, message: "Account not found. Please login again." });
        }
        req.student = student;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, tokenExpired: true, message: "Invalid session. Please login again." });
    }
};

export default verifyStudent;
