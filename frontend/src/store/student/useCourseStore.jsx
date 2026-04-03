import { create } from "zustand";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/course",
    withCredentials: true,
});

export const useCourseStore = create((set) => ({
    courses: [],
    selectedCourse: null,
    loading: false,

    fetchPublishedCourses: async () => {
        try {
            set({ loading: true });
            const res = await api.get("/all");
            if (res.data.success) {
                set({ courses: res.data.courses });
            }
        } catch (error) {
        } finally {
            set({ loading: false });
        }
    },

    fetchCourseById: async (courseId) => {
        try {
            set({ loading: true, selectedCourse: null });
            const res = await api.get(`/${courseId}`);
            if (res.data.success) {
                set({ selectedCourse: res.data.course });
            }
        } catch (error) {
        } finally {
            set({ loading: false });
        }
    },
}));
