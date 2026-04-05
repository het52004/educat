import { create } from "zustand";
import studentApi from "../../api/studentApi";

const useQuizStore = create((set) => ({
    quiz: null,
    certificate: null,
    certificates: [],
    quizResult: null,
    loading: false,

    fetchQuiz: async (courseId) => {
        try {
            set({ loading: true, quiz: null, quizResult: null });
            const res = await studentApi.get(`/quiz/student/${courseId}`);
            if (res.data.success) set({ quiz: res.data.quiz });
        } catch {}
        finally { set({ loading: false }); }
    },

    submitQuiz: async (courseId, answers) => {
        try {
            set({ loading: true });
            const res = await studentApi.post(`/quiz/submit/${courseId}`, { answers });
            if (res.data.success) {
                set({ quizResult: res.data, certificate: res.data.certificate || null });
            }
            return res.data;
        } catch {
            return { success: false, message: "Something went wrong" };
        } finally {
            set({ loading: false });
        }
    },

    fetchCertificate: async (courseId) => {
        try {
            const res = await studentApi.get(`/quiz/certificate/${courseId}`);
            if (res.data.success) set({ certificate: res.data.certificate });
        } catch {}
    },

    fetchMyCertificates: async () => {
        try {
            const res = await studentApi.get(`/quiz/certificates/mine`);
            if (res.data.success) set({ certificates: res.data.certificates });
        } catch {}
    },

    resetQuiz: () => set({ quiz: null, quizResult: null }),
}));

export default useQuizStore;
