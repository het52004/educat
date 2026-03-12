import express from "express";
import {
  studentLogin,
  studentLogout,
  requestStudentOtp,
  signup,
} from "../../controllers/studentControllers/auth.controller.js";

const app = express();

app.post("/studentLogin", studentLogin);
app.post("/signup", signup);
app.post("/requestStudentOtp", requestStudentOtp);
app.get("/studentLogout", studentLogout);

export default app;
