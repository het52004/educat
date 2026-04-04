import { create } from "zustand";
import instructorApi from "../../api/instructorApi";

const useLectureStore = create((set) => ({
    lectures: [],
    loading: false,
    uploading: false,
    uploadProgress: 0,

    fetchLectures: async (courseId) => {
        try {
            set({ loading: true });
            const res = await instructorApi.get(`/lectures/instructor/course/${courseId}`);
            if (res.data.success) set({ lectures: res.data.lectures });
        } catch {
        } finally {
            set({ loading: false });
        }
    },

    uploadLecture: async (courseId, formData, onProgress) => {
        try {
            set({ uploading: true, uploadProgress: 0 });
            const res = await instructorApi.post("/lectures/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (e) => {
                    const pct = Math.round((e.loaded * 100) / e.total);
                    set({ uploadProgress: pct });
                    if (onProgress) onProgress(pct);
                },
            });
            if (res.data.success) set((state) => ({ lectures: [...state.lectures, res.data.lecture] }));
            return res.data;
        } catch {
            return { success: false, message: "Upload failed" };
        } finally {
            set({ uploading: false, uploadProgress: 0 });
        }
    },

    deleteLecture: async (lectureId) => {
        try {
            const res = await instructorApi.delete(`/lectures/${lectureId}`);
            if (res.data.success) set((state) => ({ lectures: state.lectures.filter((l) => l._id !== lectureId) }));
            return res.data;
        } catch {
            return { success: false, message: "Delete failed" };
        }
    },

    clearLectures: () => set({ lectures: [] }),
}));

export default useLectureStore;
