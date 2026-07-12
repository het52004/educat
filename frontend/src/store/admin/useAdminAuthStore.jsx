import { create } from "zustand";
import adminApi from "../../api/adminApi";

export const useAdminAuthStore = create((set) => ({
  admin: null,
  loginError: null,

  forceLogout: () => {
    set({ admin: null });
    window.location.href = "/adminlogin";
  },

  login: async (data) => {
    try {
      set({ loginError: "" });
      const res = await adminApi.post("/admin/adminLogin", {
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
      const res = await adminApi.get("/admin/checkAuth");
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
      const res = await adminApi.get("/admin/adminLogout");
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
