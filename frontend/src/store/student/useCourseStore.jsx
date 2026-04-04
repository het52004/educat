import { create } from "zustand";
import studentApi from "../../api/studentApi";

export const useCourseStore = create((set) => ({
    courses: [],
    selectedCourse: null,
    loading: false,

    fetchPublishedCourses: async () => {
        try {
            set({ loading: true });
            const res = await studentApi.get("/course/all");
            if (res.data.success) set({ courses: res.data.courses });
        } catch {
        } finally {
            set({ loading: false });
        }
    },

    fetchCourseById: async (courseId) => {
        try {
            set({ loading: true, selectedCourse: null });
            const res = await studentApi.get(`/course/${courseId}`);
            if (res.data.success) set({ selectedCourse: res.data.course });
        } catch {
        } finally {
            set({ loading: false });
        }
    },
}));
