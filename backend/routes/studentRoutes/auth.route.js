import express from "express";
import {
  studentLogin,
  studentLogout,
  requestStudentOtp,
  signup,
  checkAuth,
} from "../../controllers/studentControllers/auth.controller.js";
import { updateProfile, deleteAccount } from "../../controllers/studentControllers/profile.controller.js";
import { enrollCourse, isEnrolled } from "../../controllers/studentControllers/enroll.controller.js";

const app = express();

app.post("/studentLogin", studentLogin);
app.post("/signup", signup);
app.post("/requestStudentOtp", requestStudentOtp);
app.get("/checkAuth", checkAuth);
app.get("/studentLogout", studentLogout);
app.put("/updateProfile", updateProfile);
app.delete("/deleteAccount", deleteAccount);
app.post("/enroll/:courseId", enrollCourse);
app.get("/isEnrolled/:courseId", isEnrolled);

export default app;
