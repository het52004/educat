import { create } from "zustand";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/lectures",
    withCredentials: true,
});

const useStudentLectureStore = create((set) => ({
    lectures: [],
    loading: false,

    fetchLectures: async (courseId) => {
        try {
            set({ loading: true, lectures: [] });
            const res = await api.get(`/course/${courseId}`);
            if (res.data.success) {
                set({ lectures: res.data.lectures });
            }
        } catch (error) {
        } finally {
            set({ loading: false });
        }
    },

    clearLectures: () => set({ lectures: [] }),
}));

export default useStudentLectureStore;
