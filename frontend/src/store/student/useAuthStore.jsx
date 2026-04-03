import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/student",
  withCredentials: true,
});

export const useAuthStore = create((set) => ({
  user: null,
  requestOtpError: null,
  loginError: null,
  error: null,

  requestOtp: async (data) => {
    try {
      set({ requestOtpError: "" });
      const res = await api.post("/requestStudentOtp", {
        fullName: data.fullname,
        email: data.email,
        password: data.password,
        contact: data.contact,
      });

      if (!res.data.success) {
        set({ requestOtpError: res.data.message });
        return false;
      } else {
        alert(res.data.message);
        localStorage.setItem("email", data.email);
        set({ requestOtpError: null });
        return true;
      }
    } catch (error) {
      set({ requestOtpError: "Something went wrong" });
      return false;
    }
  },

  enterOtp: async (otp, email) => {
    try {
      set({ error: "" });
      const res = await api.post("/signup", { email, otp });
      if (!res.data.success) {
        set({ error: res.data.message });
        return false;
      } else {
        alert(res.data.message);
        set({ error: null });
        return true;
      }
    } catch (error) {
      set({ error: "Something went wrong" });
      return false;
    }
  },

  login: async (data) => {
    try {
      set({ loginError: "" });
      const res = await api.post("/studentLogin", {
        email: data.email,
        password: data.password,
      });
      if (!res.data.success) {
        set({ loginError: res.data.message });
        return false;
      } else {
        set({ user: res.data.studentData, loginError: null });
        return true;
      }
    } catch (error) {
      set({ loginError: "Something went wrong" });
      return false;
    }
  },

  checkAuth: async () => {
    try {
      const res = await api.get("/checkAuth");
      if (!res.data.success) {
        set({ user: null });
        return false;
      } else {
        set({ user: res.data.studentData });
        return true;
      }
    } catch (error) {
      set({ user: null });
      return false;
    }
  },

  logout: async () => {
    try {
      const res = await api.get("/studentLogout");
      if (res.data.success) {
        set({ user: null });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await api.put("/updateProfile", data);
      if (res.data.success) {
        set({ user: res.data.studentData });
      }
      return res.data;
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },

  deleteAccount: async (password) => {
    try {
      const res = await api.delete("/deleteAccount", { data: { password } });
      if (res.data.success) {
        set({ user: null });
      }
      return res.data;
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },

  enrollCourse: async (courseId) => {
    try {
      const res = await api.post(`/enroll/${courseId}`);
      if (res.data.success) {
        set({ user: res.data.studentData });
      }
      return res.data;
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  },
}));
