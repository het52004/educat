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
import verifyStudent from "../../middleware/verifyStudent.js";

const router = express.Router();

router.post("/studentLogin", studentLogin);
router.post("/signup", signup);
router.post("/requestStudentOtp", requestStudentOtp);

router.get("/checkAuth", verifyStudent, checkAuth);
router.get("/studentLogout", verifyStudent, studentLogout);
router.put("/updateProfile", verifyStudent, updateProfile);
router.delete("/deleteAccount", verifyStudent, deleteAccount);
router.post("/enroll/:courseId", verifyStudent, enrollCourse);
router.get("/isEnrolled/:courseId", verifyStudent, isEnrolled);

export default router;
