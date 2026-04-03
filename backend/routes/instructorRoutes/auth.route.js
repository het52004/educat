import express from "express";
import {
  instructorLogin,
  instructorLogout,
  requestInstructorOtp,
  instructorSignup,
  checkInstructorAuth,
} from "../../controllers/instructorControllers/auth.controller.js";

const app = express();

app.post("/instructorLogin", instructorLogin);
app.post("/instructorSignup", instructorSignup);
app.post("/requestInstructorOtp", requestInstructorOtp);
app.get("/checkAuth", checkInstructorAuth);
app.get("/instructorLogout", instructorLogout);

export default app;
