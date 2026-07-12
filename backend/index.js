import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./utils/envValues.js";
import { connectDB } from "./db/connectDb.js";
import studentRoutes from "./routes/studentRoutes/auth.route.js";
import adminRoutes from "./routes/adminRoutes/auth.route.js";
import adminDashboardRoutes from "./routes/adminRoutes/dashboard.route.js";
import adminStudentRoutes from "./routes/adminRoutes/students.route.js";
import adminInstructorRoutes from "./routes/adminRoutes/instructors.route.js";
import adminCourseRoutes from "./routes/adminRoutes/courses.route.js";
import adminFeedbackRoutes from "./routes/adminRoutes/feedback.route.js";
import instructorRoutes from "./routes/instructorRoutes/auth.route.js";
import courseRoutes from "./routes/courseRoutes/course.route.js";
import messageRoutes from "./routes/messageRoutes/message.route.js";
import lectureRoutes from "./routes/lectureRoutes/lecture.route.js";
import feedbackRoutes from "./routes/feedbackRoutes/feedback.route.js";
import quizRoutes from "./routes/quizRoutes/quiz.route.js";
import analyticsRoutes from "./routes/analyticsRoutes/analytics.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const port = env.port;

app.get("/", (req, res) => {
    res.send("Backend server is running");
});

app.use("/student", studentRoutes);
app.use("/admin", adminRoutes);
app.use("/admin", adminDashboardRoutes);
app.use("/admin", adminStudentRoutes);
app.use("/admin", adminInstructorRoutes);
app.use("/admin", adminCourseRoutes);
app.use("/admin", adminFeedbackRoutes);
app.use("/instructor", instructorRoutes);
app.use("/course", courseRoutes);
app.use("/messages", messageRoutes);
app.use("/lectures", lectureRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/quiz", quizRoutes);
app.use("/analytics", analyticsRoutes);

app.listen(port, () => {
    console.log(`backend server running on port ${port}`);
    connectDB();
});
