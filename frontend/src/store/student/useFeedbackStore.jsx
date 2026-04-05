import { create } from "zustand";
import studentApi from "../../api/studentApi";

const useFeedbackStore = create((set) => ({
    feedbacks: [],
    myFeedback: null,
    loading: false,

    fetchFeedbacks: async (courseId) => {
        try {
            set({ loading: true });
            const res = await studentApi.get(`/feedback/course/${courseId}`);
            if (res.data.success) set({ feedbacks: res.data.feedbacks });
        } catch {}
        finally { set({ loading: false }); }
    },

    fetchMyFeedback: async (courseId) => {
        try {
            const res = await studentApi.get(`/feedback/my/${courseId}`);
            if (res.data.success) set({ myFeedback: res.data.feedback });
        } catch {}
    },

    submitFeedback: async (courseId, rating, description) => {
        try {
            const res = await studentApi.post(`/feedback/submit/${courseId}`, { rating, description });
            if (res.data.success) {
                set((state) => ({
                    feedbacks: [res.data.feedback, ...state.feedbacks],
                    myFeedback: res.data.feedback,
                }));
            }
            return res.data;
        } catch {
            return { success: false, message: "Something went wrong" };
        }
    },

    deleteFeedback: async (feedbackId, courseId) => {
        try {
            const res = await studentApi.delete(`/feedback/${feedbackId}`);
            if (res.data.success) {
                set((state) => ({
                    feedbacks: state.feedbacks.filter((f) => f._id !== feedbackId),
                    myFeedback: null,
                }));
            }
            return res.data;
        } catch {
            return { success: false, message: "Something went wrong" };
        }
    },
}));

export default useFeedbackStore;
