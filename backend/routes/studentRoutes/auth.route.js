import express from "express";
import {
  studentLogin,
  studentLogout,
  requestStudentOtp,
} from "../../controllers/studentControllers/auth.controller.js";

const app = express();

app.post("/studentLogin", studentLogin);
app.post("/requestStudentOtp", requestStudentOtp);
app.get("/studentLogout", studentLogout);

export default app;
