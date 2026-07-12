import jwt from "jsonwebtoken";
import Admin from "../models/admin/Admin.model.js";
import { env } from "../utils/envValues.js";

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.cookies?.adminToken;
        if (!token) {
            return res.status(401).json({ success: false, tokenExpired: true, message: "Session expired. Please login again." });
        }
        const decoded = jwt.verify(token, env.jwt_secret);
        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) {
            return res.status(401).json({ success: false, tokenExpired: true, message: "Account not found. Please login again." });
        }
        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, tokenExpired: true, message: "Invalid session. Please login again." });
    }
};

export default verifyAdmin;
