import express from "express";
import {
  instructorLogin,
  instructorLogout,
  requestInstructorOtp,
  instructorSignup,
  checkInstructorAuth,
} from "../../controllers/instructorControllers/auth.controller.js";
import verifyInstructor from "../../middleware/verifyInstructor.js";

const router = express.Router();

router.post("/instructorLogin", instructorLogin);
router.post("/instructorSignup", instructorSignup);
router.post("/requestInstructorOtp", requestInstructorOtp);

router.get("/checkAuth", verifyInstructor, checkInstructorAuth);
router.get("/instructorLogout", verifyInstructor, instructorLogout);

export default router;
