import TempInstructor from "../../models/instructor/TempInstructor.model.js";
import Instructor from "../../models/instructor/Instructor.model.js";
import { sendEmailToUser } from "../../utils/email.js";
import jwt from "jsonwebtoken";
import { env } from "../../utils/envValues.js";

export const instructorLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Fill all the details!" });
  } else {
    const instructor = await Instructor.findOne({ email });
    if (!instructor) {
      return res.json({ success: false, message: "Instructor not found! Please sign up first" });
    } else {
      const isMatch = await instructor.comparePassword(password);
      if (!isMatch) {
        return res.json({ success: false, message: "Invalid password!" });
      } else {
        const token = jwt.sign({ id: instructor._id, email: instructor.email, role: "instructor" }, env.jwt_secret, { expiresIn: "7d" });
        res.cookie("instructorToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
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
      }
    }
  }
};

export const requestInstructorOtp = async (req, res) => {
  const { name, email, password, bio, expertise } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Fill all the details!" });
  } else {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }
    const existingTemp = await TempInstructor.findOne({ email });
    const existing = await Instructor.findOne({ email });
    if (existingTemp) {
      return res.json({ success: false, message: `Email has already been sent to ${email}` });
    }
    if (existing) {
      return res.json({ success: false, message: "Instructor already exists! Please login" });
    }
    if (password.length < 6) {
      return res.json({ success: false, message: "Password must be at least 6 characters" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (await sendEmailToUser(email, otp)) {
      const tempInstructor = await TempInstructor.create({
        name,
        email,
        password,
        bio: bio || "",
        expertise: expertise || [],
        otp,
      });
      if (tempInstructor) {
        return res.json({ success: true, message: `OTP has been sent to ${email}` });
      } else {
        return res.json({ success: false, message: "Technical issue going on with server!" });
      }
    } else {
      return res.json({ success: false, message: "Failed to send email!" });
    }
  }
};

export const instructorSignup = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.json({ success: false, message: "Please fill all fields" });
  } else {
    const instructor = await TempInstructor.findOne({ email });
    if (!instructor) {
      return res.json({ success: false, message: "Please register again! OTP has expired" });
    } else {
      if (instructor.otp !== otp) {
        return res.json({ success: false, message: "OTP does not match! Try again" });
      } else {
        const newInstructor = await Instructor.create({
          name: instructor.name,
          password: instructor.password,
          email: instructor.email,
          bio: instructor.bio,
          expertise: instructor.expertise,
        });
        if (!newInstructor) {
          return res.json({ success: false, message: "Error registering! try again" });
        } else {
          return res.json({
            success: true,
            message: "Your account has been registered to EduCat successfully! Thank you",
          });
        }
      }
    }
  }
};

export const checkInstructorAuth = async (req, res) => {
  try {
    const token = req.cookies?.instructorToken;
    if (!token) {
      return res.json({ success: false, message: "Login again!" });
    } else {
      const decoded = jwt.verify(token, env.jwt_secret);
      const instructorData = await Instructor.findById(decoded.id).select("-password");
      if (!instructorData) {
        return res.json({ success: false, message: "Instructor not found! please login again!" });
      } else {
        return res.json({ success: true, message: "Data successfully fetched!", instructorData });
      }
    }
  } catch (error) {
    return res.json({ success: false, message: "Invalid session! Please login again" });
  }
};

export const instructorLogout = (req, res) => {
  res.clearCookie("instructorToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  return res.json({ success: true, message: "Logged out successfully!" });
};
