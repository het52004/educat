import { create } from "zustand";
import studentApi from "../../api/studentApi";

const useStudentLectureStore = create((set) => ({
    lectures: [],
    loading: false,

    fetchLectures: async (courseId) => {
        try {
            set({ loading: true, lectures: [] });
            const res = await studentApi.get(`/lectures/course/${courseId}`);
            if (res.data.success) set({ lectures: res.data.lectures });
        } catch {
        } finally {
            set({ loading: false });
        }
    },

    clearLectures: () => set({ lectures: [] }),
}));

export default useStudentLectureStore;
