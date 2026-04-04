import { create } from "zustand";
import instructorApi from "../../api/instructorApi";

export const useInstructorAuthStore = create((set) => ({
    instructor: null,
    courses: [],
    requestOtpError: null,
    loginError: null,
    error: null,

    forceLogout: () => {
        set({ instructor: null, courses: [] });
        window.location.href = "/instructorlogin";
    },

    requestOtp: async (data) => {
        try {
            set({ requestOtpError: "" });
            const res = await instructorApi.post("/instructor/requestInstructorOtp", {
                name: data.name,
                email: data.email,
                password: data.password,
                bio: data.bio,
                expertise: data.expertise,
            });
            if (!res.data.success) {
                set({ requestOtpError: res.data.message });
                return false;
            }
            alert(res.data.message);
            localStorage.setItem("instructorEmail", data.email);
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
            const res = await instructorApi.post("/instructor/instructorSignup", { email, otp });
            if (!res.data.success) {
                set({ error: res.data.message });
                return false;
            }
            alert(res.data.message);
            localStorage.removeItem("instructorEmail");
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
            const res = await instructorApi.post("/instructor/instructorLogin", {
                email: data.email,
                password: data.password,
            });
            if (!res.data.success) {
                set({ loginError: res.data.message });
                return false;
            }
            set({ instructor: res.data.instructorData, loginError: null });
            return true;
        } catch {
            set({ loginError: "Something went wrong" });
            return false;
        }
    },

    checkAuth: async () => {
        try {
            const res = await instructorApi.get("/instructor/checkAuth");
            if (!res.data.success) {
                set({ instructor: null });
                return false;
            }
            set({ instructor: res.data.instructorData });
            return true;
        } catch {
            set({ instructor: null });
            return false;
        }
    },

    logout: async () => {
        try {
            await instructorApi.get("/instructor/instructorLogout");
            set({ instructor: null, courses: [] });
            return true;
        } catch {
            set({ instructor: null, courses: [] });
            return false;
        }
    },

    createCourse: async (data) => {
        try {
            const res = await instructorApi.post("/course/create", data);
            if (!res.data.success) return { success: false, message: res.data.message };
            set((state) => ({ courses: [res.data.course, ...state.courses] }));
            return { success: true };
        } catch {
            return { success: false, message: "Something went wrong" };
        }
    },

    fetchInstructorCourses: async () => {
        try {
            const res = await instructorApi.get("/course/instructor-courses");
            if (res.data.success) set({ courses: res.data.courses });
        } catch {}
    },

    deleteCourse: async (courseId) => {
        try {
            const res = await instructorApi.delete(`/course/delete/${courseId}`);
            if (res.data.success) {
                set((state) => ({ courses: state.courses.filter((c) => c._id !== courseId) }));
                return true;
            }
            return false;
        } catch {
            return false;
        }
    },

    updateCourse: async (courseId, data) => {
        try {
            const res = await instructorApi.put(`/course/update/${courseId}`, data);
            if (res.data.success) {
                set((state) => ({
                    courses: state.courses.map((c) => (c._id === courseId ? res.data.course : c)),
                }));
                return { success: true };
            }
            return { success: false, message: res.data.message };
        } catch {
            return { success: false, message: "Something went wrong" };
        }
    },
}));
