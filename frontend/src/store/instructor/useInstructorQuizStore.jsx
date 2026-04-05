import { create } from "zustand";
import instructorApi from "../../api/instructorApi";

const useInstructorQuizStore = create((set) => ({
    quiz: null,
    loading: false,

    fetchQuiz: async (courseId) => {
        try {
            set({ loading: true, quiz: null });
            const res = await instructorApi.get(`/quiz/instructor/${courseId}`);
            if (res.data.success) set({ quiz: res.data.quiz });
        } catch {}
        finally { set({ loading: false }); }
    },

    createQuiz: async (courseId, data) => {
        try {
            const res = await instructorApi.post(`/quiz/create/${courseId}`, data);
            if (res.data.success) set({ quiz: res.data.quiz });
            return res.data;
        } catch {
            return { success: false, message: "Something went wrong" };
        }
    },

    deleteQuiz: async (courseId) => {
        try {
            const res = await instructorApi.delete(`/quiz/${courseId}`);
            if (res.data.success) set({ quiz: null });
            return res.data;
        } catch {
            return { success: false, message: "Something went wrong" };
        }
    },
}));

export default useInstructorQuizStore;
