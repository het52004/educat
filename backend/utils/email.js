import nodemailer from "nodemailer"
import { env } from "./envValues.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.gmail,
        pass: env.gmail_app_password,
    },
});

export const sendEmailToUser = async (to, otp) => {
    const mailOptions = {
        from: `EduCat ${env.gmail}`,
        to,
        subject: "Welcome! Here is your OTP of email verification for signup to EduCat website!",
        text: `This OTP will expire in 5 minutes! do not share this OTP with anyone!\nOTP:${otp}`,
    };
    try {
        const info = await transporter.sendMail(mailOptions);        
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export const sendPasswordResetOtp = async (to, otp) => {
    const mailOptions = {
        from: `EduCat ${env.gmail}`,
        to,
        subject: "EduCat Password Reset OTP",
        text: `We received a request to reset your EduCat password. This OTP will expire in 5 minutes! do not share this OTP with anyone!\nOTP:${otp}\n\nIf you did not request this, please ignore this email.`,
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}