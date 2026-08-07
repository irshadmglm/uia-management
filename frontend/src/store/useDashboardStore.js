import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useDashboardStore = create((set) => ({
  metrics: null,
  isLoading: false,
  error: null,

  fetchDashboardMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      // Endpoint prefix in axiosInstance includes /api/v1
      // Assuming management routes are mapped under /mng
      const response = await axiosInstance.get("/mng/dashboard-metrics");
      set({ metrics: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      set({ 
        error: error.response?.data?.message || "Failed to load dashboard metrics",
        isLoading: false 
      });
      toast.error("Failed to load dashboard data");
    }
  },
}));
