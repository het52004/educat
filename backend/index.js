import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./utils/envValues.js";
import { connectDB } from "./db/connectDb.js";
import studentRoutes from "./routes/studentRoutes/auth.route.js";
import adminRoutes from "./routes/adminRoutes/auth.route.js";
import instructorRoutes from "./routes/instructorRoutes/auth.route.js";
import courseRoutes from "./routes/courseRoutes/course.route.js";

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
app.use("/instructor", instructorRoutes);
app.use("/course", courseRoutes);

app.listen(port, () => {
    console.log(`backend server running on port ${port}`);
    connectDB();
});
