import { create } from "zustand";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/instructor",
    withCredentials: true,
});

const courseApi = axios.create({
    baseURL: "http://localhost:5000/course",
    withCredentials: true,
});

export const useInstructorAuthStore = create((set) => ({
    instructor: null,
    courses: [],
    requestOtpError: null,
    loginError: null,
    error: null,

    requestOtp: async (data) => {
        try {
            set({ requestOtpError: "" });
            const res = await api.post("/requestInstructorOtp", {
                name: data.name,
                email: data.email,
                password: data.password,
                bio: data.bio,
                expertise: data.expertise,
            });
            if (!res.data.success) {
                set({ requestOtpError: res.data.message });
                return false;
            } else {
                alert(res.data.message);
                localStorage.setItem("instructorEmail", data.email);
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
            const res = await api.post("/instructorSignup", { email, otp });
            if (!res.data.success) {
                set({ error: res.data.message });
                return false;
            } else {
                alert(res.data.message);
                localStorage.removeItem("instructorEmail");
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
            const res = await api.post("/instructorLogin", {
                email: data.email,
                password: data.password,
            });
            if (!res.data.success) {
                set({ loginError: res.data.message });
                return false;
            } else {
                set({ instructor: res.data.instructorData, loginError: null });
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
                set({ instructor: null });
                return false;
            } else {
                set({ instructor: res.data.instructorData });
                return true;
            }
        } catch (error) {
            set({ instructor: null });
            return false;
        }
    },

    logout: async () => {
        try {
            const res = await api.get("/instructorLogout");
            if (res.data.success) {
                set({ instructor: null, courses: [] });
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    },

    createCourse: async (data) => {
        try {
            const res = await courseApi.post("/create", data);
            if (!res.data.success) {
                return { success: false, message: res.data.message };
            } else {
                set((state) => ({ courses: [res.data.course, ...state.courses] }));
                return { success: true };
            }
        } catch (error) {
            return { success: false, message: "Something went wrong" };
        }
    },

    fetchInstructorCourses: async () => {
        try {
            const res = await courseApi.get("/instructor-courses");
            if (res.data.success) {
                set({ courses: res.data.courses });
            }
        } catch (error) {}
    },

    deleteCourse: async (courseId) => {
        try {
            const res = await courseApi.delete(`/delete/${courseId}`);
            if (res.data.success) {
                set((state) => ({ courses: state.courses.filter((c) => c._id !== courseId) }));
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    },

    updateCourse: async (courseId, data) => {
        try {
            const res = await courseApi.put(`/update/${courseId}`, data);
            if (res.data.success) {
                set((state) => ({
                    courses: state.courses.map((c) => (c._id === courseId ? res.data.course : c)),
                }));
                return { success: true };
            }
            return { success: false, message: res.data.message };
        } catch (error) {
            return { success: false, message: "Something went wrong" };
        }
    },
}));
