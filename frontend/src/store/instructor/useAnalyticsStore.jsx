import { create } from "zustand";
import instructorApi from "../../api/instructorApi";

const useAnalyticsStore = create((set) => ({
    analytics: null,
    loading: false,

    fetchAnalytics: async () => {
        try {
            set({ loading: true });
            const res = await instructorApi.get("/analytics/instructor");
            if (res.data.success) set({ analytics: res.data.analytics });
        } catch {}
        finally { set({ loading: false }); }
    },
}));

export default useAnalyticsStore;
