import TempInstructor from "../../models/instructor/TempInstructor.model.js";
import Instructor from "../../models/instructor/Instructor.model.js";
import { sendEmailToUser } from "../../utils/email.js";
import jwt from "jsonwebtoken";
import { env } from "../../utils/envValues.js";

export const instructorLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ success: false, message: "Fill all the details!" });

    const instructor = await Instructor.findOne({ email });
    if (!instructor) return res.json({ success: false, message: "Instructor not found! Please sign up first" });

    const isMatch = await instructor.comparePassword(password);
    if (!isMatch) return res.json({ success: false, message: "Invalid password!" });

    const token = jwt.sign({ id: instructor._id, email: instructor.email, role: "instructor" }, env.jwt_secret, { expiresIn: "7d" });
    res.cookie("instructorToken", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json({
        success: true,
        message: "Logged in successfully!",
        instructorData: {
            _id: instructor._id,
            name: instructor.name,
            email: instructor.email,
            bio: instructor.bio,
            expertise: instructor.expertise,
            courses: instructor.courses,
        },
    });
};

export const requestInstructorOtp = async (req, res) => {
    const { name, email, password, bio, expertise } = req.body;
    if (!name || !email || !password) return res.json({ success: false, message: "Fill all the details!" });

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) return res.json({ success: false, message: "Invalid email format" });
    if (await TempInstructor.findOne({ email })) return res.json({ success: false, message: `Email has already been sent to ${email}` });
    if (await Instructor.findOne({ email })) return res.json({ success: false, message: "Instructor already exists! Please login" });
    if (password.length < 6) return res.json({ success: false, message: "Password must be at least 6 characters" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (await sendEmailToUser(email, otp)) {
        await TempInstructor.create({ name, email, password, bio: bio || "", expertise: expertise || [], otp });
        return res.json({ success: true, message: `OTP has been sent to ${email}` });
    }
    return res.json({ success: false, message: "Failed to send email!" });
};

export const instructorSignup = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.json({ success: false, message: "Please fill all fields" });

    const instructor = await TempInstructor.findOne({ email });
    if (!instructor) return res.json({ success: false, message: "Please register again! OTP has expired" });
    if (instructor.otp !== otp) return res.json({ success: false, message: "OTP does not match! Try again" });

    const newInstructor = await Instructor.create({
        name: instructor.name,
        password: instructor.password,
        email: instructor.email,
        bio: instructor.bio,
        expertise: instructor.expertise,
    });
    if (!newInstructor) return res.json({ success: false, message: "Error registering! try again" });

    await TempInstructor.deleteOne({ email });
    return res.json({ success: true, message: "Your account has been registered to EduCat successfully! Thank you" });
};

export const checkInstructorAuth = async (req, res) => {
    return res.json({ success: true, message: "Data successfully fetched!", instructorData: req.instructor });
};

export const instructorLogout = (req, res) => {
    res.clearCookie("instructorToken", { httpOnly: true, secure: false, sameSite: "lax" });
    return res.json({ success: true, message: "Logged out successfully!" });
};
