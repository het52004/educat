import { create } from "zustand";
import instructorApi from "../../api/instructorApi";

const useInstructorMessageStore = create((set) => ({
    students: [],
    messages: [],
    selectedStudent: null,
    loading: false,

    fetchStudents: async () => {
        try {
            const res = await instructorApi.get("/messages/students");
            if (res.data.success) set({ students: res.data.students });
        } catch {}
    },

    selectStudent: (student) => set({ selectedStudent: student, messages: [] }),

    fetchMessages: async (conversationId) => {
        try {
            set({ loading: true });
            const res = await instructorApi.get(`/messages/${conversationId}`);
            if (res.data.success) set({ messages: res.data.messages });
        } catch {
        } finally {
            set({ loading: false });
        }
    },

    sendMessage: async (conversationId, text) => {
        try {
            const res = await instructorApi.post("/messages/send", { conversationId, text, senderRole: "instructor" });
            if (res.data.success) set((state) => ({ messages: [...state.messages, res.data.message] }));
            return res.data;
        } catch {
            return { success: false };
        }
    },
}));

export default useInstructorMessageStore;
