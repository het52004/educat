import TempStudent from "../../models/student/TempStudent.model.js";
import Student from "../../models/student/Student.model.js";
import { sendEmailToUser } from "../../utils/email.js";
import jwt from "jsonwebtoken";
import { env } from "../../utils/envValues.js";

export const studentLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ success: false, message: "Fill all the details!" });

    const student = await Student.findOne({ email });
    if (!student) return res.json({ success: false, message: "Student not found! Please sign up first" });

    const isMatch = await student.comparePassword(password);
    if (!isMatch) return res.json({ success: false, message: "Invalid password!" });

    const token = jwt.sign({ id: student._id, email: student.email }, env.jwt_secret, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json({
        success: true,
        message: "Logged in successfully!",
        studentData: {
            _id: student._id,
            fullName: student.fullName,
            email: student.email,
            contactNumber: student.contactNumber,
            enrolledCourses: student.enrolledCourses,
        },
    });
};

export const requestStudentOtp = async (req, res) => {
    const { fullName, email, password, contact } = req.body;
    if (!fullName || !email || !password || !contact) return res.json({ success: false, message: "Fill all the details!" });

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) return res.json({ success: false, message: "Invalid email format" });
    if (await TempStudent.findOne({ email })) return res.json({ success: false, message: `Email has already been sent to ${email}` });
    if (await Student.findOne({ email })) return res.json({ success: false, message: "Student already exists! Please login" });
    if (password.length < 6) return res.json({ success: false, message: "Password must be at least 6 characters" });
    if (contact.length !== 10) return res.json({ success: false, message: "Contact not valid!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (await sendEmailToUser(email, otp)) {
        await TempStudent.create({ fullName, email, password, contact, otp });
        return res.json({ success: true, message: `OTP has been sent to ${email}` });
    }
    return res.json({ success: false, message: "Failed to send email!" });
};

export const signup = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.json({ success: false, message: "Please fill all fields" });

    const tempStudent = await TempStudent.findOne({ email });
    if (!tempStudent) return res.json({ success: false, message: "Please register again! OTP has expired" });
    if (tempStudent.otp !== otp) return res.json({ success: false, message: "OTP does not match! Try again" });

    const newStudent = await Student.create({
        fullName: tempStudent.fullName,
        password: tempStudent.password,
        email: tempStudent.email,
        contactNumber: tempStudent.contact,
    });
    if (!newStudent) return res.json({ success: false, message: "Error registering! try again" });

    await TempStudent.deleteOne({ email });
    return res.json({ success: true, message: "Your account has been registered to EduCat successfully! Thank you" });
};

export const checkAuth = async (req, res) => {
    return res.json({ success: true, message: "Data successfully fetched!", studentData: req.student });
};

export const studentLogout = (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
    return res.json({ success: true, message: "Logged out successfully!" });
};
