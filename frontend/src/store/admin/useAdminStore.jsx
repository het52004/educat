import { create } from "zustand";
import adminApi from "../../api/adminApi";

export const useAdminStore = create((set, get) => ({
  stats: null,
  students: [],
  instructors: [],
  courses: [],
  feedbacks: [],
  loading: false,
  actionError: null,

  fetchStats: async () => {
    try {
      const res = await adminApi.get("/admin/stats");
      if (res.data.success) set({ stats: res.data.stats });
      return res.data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  fetchStudents: async () => {
    try {
      set({ loading: true });
      const res = await adminApi.get("/admin/students");
      if (res.data.success) set({ students: res.data.students });
      return res.data;
    } catch {
      return { success: false, message: "Something went wrong" };
    } finally {
      set({ loading: false });
    }
  },

  deleteStudent: async (studentId) => {
    try {
      const res = await adminApi.delete(`/admin/students/${studentId}`);
      if (res.data.success) {
        set((state) => ({ students: state.students.filter((s) => s._id !== studentId) }));
      }
      return res.data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  fetchInstructors: async () => {
    try {
      set({ loading: true });
      const res = await adminApi.get("/admin/instructors");
      if (res.data.success) set({ instructors: res.data.instructors });
      return res.data;
    } catch {
      return { success: false, message: "Something went wrong" };
    } finally {
      set({ loading: false });
    }
  },

  deleteInstructor: async (instructorId) => {
    try {
      const res = await adminApi.delete(`/admin/instructors/${instructorId}`);
      if (res.data.success) {
        set((state) => ({ instructors: state.instructors.filter((i) => i._id !== instructorId) }));
        // Instructor deletion cascades to their courses; refresh course list if already loaded
        if (get().courses.length) get().fetchCourses();
      }
      return res.data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  fetchCourses: async () => {
    try {
      set({ loading: true });
      const res = await adminApi.get("/admin/courses");
      if (res.data.success) set({ courses: res.data.courses });
      return res.data;
    } catch {
      return { success: false, message: "Something went wrong" };
    } finally {
      set({ loading: false });
    }
  },

  toggleCoursePublish: async (courseId) => {
    try {
      const res = await adminApi.patch(`/admin/courses/${courseId}/toggle-publish`);
      if (res.data.success) {
        set((state) => ({
          courses: state.courses.map((c) => (c._id === courseId ? res.data.course : c)),
        }));
      }
      return res.data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  deleteCourse: async (courseId) => {
    try {
      const res = await adminApi.delete(`/admin/courses/${courseId}`);
      if (res.data.success) {
        set((state) => ({ courses: state.courses.filter((c) => c._id !== courseId) }));
      }
      return res.data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },

  fetchFeedback: async () => {
    try {
      set({ loading: true });
      const res = await adminApi.get("/admin/feedback");
      if (res.data.success) set({ feedbacks: res.data.feedbacks });
      return res.data;
    } catch {
      return { success: false, message: "Something went wrong" };
    } finally {
      set({ loading: false });
    }
  },

  deleteFeedback: async (feedbackId) => {
    try {
      const res = await adminApi.delete(`/admin/feedback/${feedbackId}`);
      if (res.data.success) {
        set((state) => ({ feedbacks: state.feedbacks.filter((f) => f._id !== feedbackId) }));
      }
      return res.data;
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  },
}));
