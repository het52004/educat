import { create } from "zustand";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/messages",
    withCredentials: true,
});

const useMessageStore = create((set) => ({
    instructors: [],
    messages: [],
    selectedInstructor: null,
    loading: false,

    fetchInstructors: async () => {
        try {
            const res = await api.get("/instructors");
            if (res.data.success) {
                set({ instructors: res.data.instructors });
            }
        } catch (error) {}
    },

    selectInstructor: (instructor) => {
        set({ selectedInstructor: instructor, messages: [] });
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
            const res = await api.post("/send", { conversationId, text, senderRole: "student" });
            if (res.data.success) {
                set((state) => ({ messages: [...state.messages, res.data.message] }));
            }
            return res.data;
        } catch (error) {
            return { success: false };
        }
    },
}));

export default useMessageStore;
