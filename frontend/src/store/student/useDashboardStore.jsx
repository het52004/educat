import { create } from 'zustand';

const useDashboardStore = create((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}));

export default useDashboardStore;