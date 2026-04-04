import { create } from "zustand";
import studentApi from "../../api/studentApi";

const useMessageStore = create((set) => ({
    instructors: [],
    messages: [],
    selectedInstructor: null,
    loading: false,

    fetchInstructors: async () => {
        try {
            const res = await studentApi.get("/messages/instructors");
            if (res.data.success) set({ instructors: res.data.instructors });
        } catch {}
    },

    selectInstructor: (instructor) => set({ selectedInstructor: instructor, messages: [] }),

    fetchMessages: async (conversationId) => {
        try {
            set({ loading: true });
            const res = await studentApi.get(`/messages/${conversationId}`);
            if (res.data.success) set({ messages: res.data.messages });
        } catch {
        } finally {
            set({ loading: false });
        }
    },

    sendMessage: async (conversationId, text) => {
        try {
            const res = await studentApi.post("/messages/send", { conversationId, text, senderRole: "student" });
            if (res.data.success) set((state) => ({ messages: [...state.messages, res.data.message] }));
            return res.data;
        } catch {
            return { success: false };
        }
    },
}));

export default useMessageStore;
