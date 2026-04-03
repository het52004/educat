import { create } from "zustand";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/messages",
    withCredentials: true,
});

const useInstructorMessageStore = create((set) => ({
    students: [],
    messages: [],
    selectedStudent: null,
    loading: false,

    fetchStudents: async () => {
        try {
            const res = await api.get("/students");
            if (res.data.success) {
                set({ students: res.data.students });
            }
        } catch (error) {}
    },

    selectStudent: (student) => {
        set({ selectedStudent: student, messages: [] });
    },

    fetchMessages: async (conversationId) => {
        try {
            set({ loading: true });
            const res = await api.get(`/${conversationId}`);
            if (res.data.success) {
                set({ messages: res.data.messages });
            }
        } catch (error) {
        } finally {
            set({ loading: false });
        }
    },

    sendMessage: async (conversationId, text) => {
        try {
            const res = await api.post("/send", { conversationId, text, senderRole: "instructor" });
            if (res.data.success) {
                set((state) => ({ messages: [...state.messages, res.data.message] }));
            }
            return res.data;
        } catch (error) {
            return { success: false };
        }
    },
}));

export default useInstructorMessageStore;
