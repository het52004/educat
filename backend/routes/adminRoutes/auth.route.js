import express from "express";
import {
  adminLogin,
  adminLogout,
  checkAdminAuth,
} from "../../controllers/adminControllers/auth.controller.js";
import verifyAdmin from "../../middleware/verifyAdmin.js";

const app = express();

app.post("/adminLogin", adminLogin);
app.get("/checkAuth", verifyAdmin, checkAdminAuth);
app.get("/adminLogout", verifyAdmin, adminLogout);

export default app;
