import jwt from "jsonwebtoken";
import Instructor from "../models/instructor/Instructor.model.js";
import { env } from "../utils/envValues.js";

const verifyInstructor = async (req, res, next) => {
    try {
        const token = req.cookies?.instructorToken;
        if (!token) {
            return res.status(401).json({ success: false, tokenExpired: true, message: "Session expired. Please login again." });
        }
        const decoded = jwt.verify(token, env.jwt_secret);
        const instructor = await Instructor.findById(decoded.id).select("-password");
        if (!instructor) {
            return res.status(401).json({ success: false, tokenExpired: true, message: "Account not found. Please login again." });
        }
        req.instructor = instructor;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, tokenExpired: true, message: "Invalid session. Please login again." });
    }
};

export default verifyInstructor;
