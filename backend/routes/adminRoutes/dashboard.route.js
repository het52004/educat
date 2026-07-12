import express from "express";
import { getAdminStats } from "../../controllers/adminControllers/dashboard.controller.js";
import verifyAdmin from "../../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/stats", verifyAdmin, getAdminStats);

export default router;
