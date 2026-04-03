import Admin from "../../models/admin/Admin.model.js";
import jwt from "jsonwebtoken";
import { env } from "../../utils/envValues.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Fill all the details!" });
  } else {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Admin not found!" });
    } else {
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.json({ success: false, message: "Invalid password!" });
      } else {
        const token = jwt.sign({ id: admin._id, email: admin.email, role: "admin" }, env.jwt_secret, { expiresIn: "7d" });
        res.cookie("adminToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({
          success: true,
          message: "Logged in successfully!",
          adminData: {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
          },
        });
      }
    }
  }
};

export const checkAdminAuth = async (req, res) => {
  try {
    const token = req.cookies?.adminToken;
    if (!token) {
      return res.json({ success: false, message: "Login again!" });
    } else {
      const decoded = jwt.verify(token, env.jwt_secret);
      const adminData = await Admin.findById(decoded.id).select("-password");
      if (!adminData) {
        return res.json({ success: false, message: "Admin not found! please login again!" });
      } else {
        return res.json({ success: true, message: "Data successfully fetched!", adminData });
      }
    }
  } catch (error) {
    return res.json({ success: false, message: "Invalid session! Please login again" });
  }
};

export const adminLogout = (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  return res.json({ success: true, message: "Logged out successfully!" });
};
