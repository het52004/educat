import Student from "../../models/student/Student.model.js";
import jwt from "jsonwebtoken";
import { env } from "../../utils/envValues.js";
import bcrypt from "bcryptjs";

const getStudent = async (req) => {
    const token = req.cookies?.token;
    if (!token) return null;
    const decoded = jwt.verify(token, env.jwt_secret);
    return await Student.findById(decoded.id);
};

export const updateProfile = async (req, res) => {
    const student = await getStudent(req);
    if (!student) return res.json({ success: false, message: "Login again!" });

    const { fullName, contactNumber, currentPassword, newPassword } = req.body;

    if (!fullName || !contactNumber) {
        return res.json({ success: false, message: "Fill all required fields!" });
    }

    if (newPassword || currentPassword) {
        if (!currentPassword) return res.json({ success: false, message: "Enter current password to change password!" });
        const match = await student.comparePassword(currentPassword);
        if (!match) return res.json({ success: false, message: "Current password is incorrect!" });
        if (!newPassword || newPassword.length < 6) return res.json({ success: false, message: "New password must be at least 6 characters!" });
        student.password = newPassword;
    }

    student.fullName = fullName;
    student.contactNumber = contactNumber;
    await student.save();

    const updatedStudent = await Student.findById(student._id).select("-password");
    return res.json({ success: true, message: "Profile updated successfully!", studentData: updatedStudent });
};

export const deleteAccount = async (req, res) => {
    const student = await getStudent(req);
    if (!student) return res.json({ success: false, message: "Login again!" });

    const { password } = req.body;
    if (!password) return res.json({ success: false, message: "Enter your password to confirm!" });

    const match = await student.comparePassword(password);
    if (!match) return res.json({ success: false, message: "Incorrect password!" });

    await Student.findByIdAndDelete(student._id);
    res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
    return res.json({ success: true, message: "Account deleted successfully!" });
};
