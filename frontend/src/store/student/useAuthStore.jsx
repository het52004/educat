import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  requestOtpError: null,
  error: null,

  requestOtp: async (data) => {
    try {
      set({ requestOtpError: "" });
      const res = await axios.post(
        "http://localhost:5000/student/requestStudentOtp",
        {
          fullName: data.fullname,
          email: data.email,
          password: data.password,
          contact: data.contact,
        },
      );

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
      const res = await axios.post("http://localhost:5000/student/signup", {
        email,
        otp,
      });
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
  checkAuth: async (email) => {
    try {
      const res = await axios.post("http://localhost:5000/student/checkAuth", {
        email,
      });
      if (!res.data.success) {
        alert(res.data.message);
        return false;
      } else {
        set({ user: res.data.studentData });
        return true;
      }
    } catch (error) {
      alert(error);
    }
  },
}));
