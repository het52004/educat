import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/admin",
  withCredentials: true,
});

export const useAdminAuthStore = create((set) => ({
  admin: null,
  loginError: null,

  login: async (data) => {
    try {
      set({ loginError: "" });
      const res = await api.post("/adminLogin", {
        email: data.email,
        password: data.password,
      });
      if (!res.data.success) {
        set({ loginError: res.data.message });
        return false;
      } else {
        set({ admin: res.data.adminData, loginError: null });
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
        set({ admin: null });
        return false;
      } else {
        set({ admin: res.data.adminData });
        return true;
      }
    } catch (error) {
      set({ admin: null });
      return false;
    }
  },

  logout: async () => {
    try {
      const res = await api.get("/adminLogout");
      if (res.data.success) {
        set({ admin: null });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },
}));
