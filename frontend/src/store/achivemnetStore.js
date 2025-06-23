import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useAchievement = create((set, get) => ({
  achievements: [],
  isLoading: false,
  error: null,

  // Fetch all achievements 
  getAllAchievements: async () => {
    set({ isLoading: true, error: null });
    try {
        const authUser = useAuthStore.getState().authUser;
      const res = await axiosInstance.get(`/achievements/${authUser._id}`);
      set({ achievements: res.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch achievements:", error.message);
      set({ error: error.message, isLoading: false });
      toast.error("Failed to load achievements");
    }
  },

  
  // Fetch all achievements for a student
  getStdAchievements: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      const id = studentId || useAuthStore.getState().authUser._id;
      const res = await axiosInstance.get(`/achievements/${id}`);
      set({ achievements: res.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch achievements:", error.message);
      set({ error: error.message, isLoading: false });
      toast.error("Failed to load achievements");
    }
  },

  // Add a new achievement
  addAchievement: async (data) => {
    try {
        const authUser = useAuthStore.getState().authUser;
      const res = await axiosInstance.post(`/achievements/${authUser._id}`, data);
      set((state) => ({
        achievements: [...state.achievements, res.data]
      }));
      toast.success("Achievement added");
    } catch (error) {
      console.error("Failed to add achievement:", error.message);
      toast.error("Failed to add achievement");
    }
  },

  // Update an existing achievement
  updateAchievement: async (achievementId, data) => {
    try {
      const res = await axiosInstance.put(`/achievements/${achievementId}`, data);
      set((state) => ({
        achievements: state.achievements.map((a) =>
          a._id === achievementId ? res.data : a
        )
      }));
      toast.success("Achievement updated");
    } catch (error) {
      console.error("Failed to update achievement:", error.message);
      toast.error("Update failed");
    }
  }
}));
