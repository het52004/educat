import TempStudent from "../../models/student/TempStudent.model.js";
import Student from "../../models/student/Student.model.js";
import { sendEmailToUser } from "../../utils/email.js";

export const studentLogin = (req, res) => {
  res.send("Login endpoint");
};

export const requestStudentOtp = async (req, res) => {
  const { fullName, email, password, contact } = req.body;
  if (!fullName || !email || !password || !contact) {
    return res.json({ success: false, message: "Fill all the details!" });
  } else {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.json({
        success: false,
        message: "Invalid email format",
      });
    }
    const existingTemp = await TempStudent.findOne({ email });
    const existing = await Student.findOne({ email });
    if (existingTemp) {
      return res.json({
        success: false,
        message: `Email has already been sent to ${email}`,
      });
    }
    if (existing) {
      return res.json({
        success: false,
        message: `Student already Exists! Please login`,
      });
    }
    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    if (contact.length !== 10) {
      return res.json({
        success: false,
        message: "Contact not valid!",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (await sendEmailToUser(email, otp)) {
      const tempStudent = await TempStudent.create({
        fullName,
        email,
        password,
        contact,
        otp,
      });
      if (tempStudent) {
        return res.json({
          success: true,
          message: `OTP has been sent to ${email}`,
        });
      } else {
        return res.json({
          success: false,
          message: "Technical issue going on with server!",
        });
      }
    } else {
      return res.json({ success: false, message: "Failed to send email!" });
    }
  }
};

export const signup = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.json({ success: false, message: "Please fill all fields" });
  } else {
    const student = await TempStudent.findOne({ email });
    if (!student) {
      return res.json({
        success: false,
        message: "Please register again! OTP has expired",
      });
    } else {
      if (student.otp !== otp) {
        return res.json({
          success: false,
          message: "OTP does not match! Try again",
        });
      } else {
        const newStudent = await Student.create({
          fullName: student.fullName,
          password: student.password,
          email: student.email,
          contactNumber: student.contact,
        });
        if (!newStudent) {
          return res.json({
            success: false,
            message: "Error registering! try again",
          });
        } else {
          return res.json({
            success: true,
            message:
              "Your account has been registered to EduCat successfully! Thank you",
          });
        }
      }
    }
  }
};

export const checkAuth = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Login again!" });
    } else {
      const studentData = await Student.findOne({ email });
      if (!studentData) {
        return res.json({
          success: false,
          message: "Student data not found! please login again!",
        });
      } else {
        return res.json({
          success: true,
          message: "Data successfully fetched!",
          studentData,
        });
      }
    }
  } catch (error) {}
};

export const studentLogout = (req, res) => {
  res.send("Logout endpoint");
};
