import express from "express";
import {
  adminLogin,
  adminLogout,
  checkAdminAuth,
} from "../../controllers/adminControllers/auth.controller.js";

const app = express();

app.post("/adminLogin", adminLogin);
app.get("/checkAuth", checkAdminAuth);
app.get("/adminLogout", adminLogout);

export default app;
