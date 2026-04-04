import { create } from "zustand";
import studentApi from "../../api/studentApi";

export const useAuthStore = create((set) => ({
    user: null,
    requestOtpError: null,
    loginError: null,
    error: null,

    forceLogout: () => {
        set({ user: null });
        window.location.href = "/studentlogin";
    },

    requestOtp: async (data) => {
        try {
            set({ requestOtpError: "" });
            const res = await studentApi.post("/student/requestStudentOtp", {
                fullName: data.fullname,
                email: data.email,
                password: data.password,
                contact: data.contact,
            });
            if (!res.data.success) {
                set({ requestOtpError: res.data.message });
                return false;
            }
            alert(res.data.message);
            localStorage.setItem("email", data.email);
            set({ requestOtpError: null });
            return true;
        } catch {
            set({ requestOtpError: "Something went wrong" });
            return false;
        }
    },

    enterOtp: async (otp, email) => {
        try {
            set({ error: "" });
            const res = await studentApi.post("/student/signup", { email, otp });
            if (!res.data.success) {
                set({ error: res.data.message });
                return false;
            }
            alert(res.data.message);
            set({ error: null });
            return true;
        } catch {
            set({ error: "Something went wrong" });
            return false;
        }
    },

    login: async (data) => {
        try {
            set({ loginError: "" });
            const res = await studentApi.post("/student/studentLogin", {
                email: data.email,
                password: data.password,
            });
            if (!res.data.success) {
                set({ loginError: res.data.message });
                return false;
            }
            set({ user: res.data.studentData, loginError: null });
            return true;
        } catch {
            set({ loginError: "Something went wrong" });
            return false;
        }
    },

    checkAuth: async () => {
        try {
            const res = await studentApi.get("/student/checkAuth");
            if (!res.data.success) {
                set({ user: null });
                return false;
            }
            set({ user: res.data.studentData });
            return true;
        } catch {
            set({ user: null });
            return false;
        }
    },

    logout: async () => {
        try {
            await studentApi.get("/student/studentLogout");
            set({ user: null });
            return true;
        } catch {
            set({ user: null });
            return false;
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await studentApi.put("/student/updateProfile", data);
            if (res.data.success) set({ user: res.data.studentData });
            return res.data;
        } catch {
            return { success: false, message: "Something went wrong" };
        }
    },

    deleteAccount: async (password) => {
        try {
            const res = await studentApi.delete("/student/deleteAccount", { data: { password } });
            if (res.data.success) set({ user: null });
            return res.data;
        } catch {
            return { success: false, message: "Something went wrong" };
        }
    },

    enrollCourse: async (courseId) => {
        try {
            const res = await studentApi.post(`/student/enroll/${courseId}`);
            if (res.data.success) set({ user: res.data.studentData });
            return res.data;
        } catch {
            return { success: false, message: "Something went wrong" };
        }
    },
}));
