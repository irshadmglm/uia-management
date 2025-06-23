import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useReadingProgress = create((set, get) => ({
  readingProgress: [],
  isLoading: false,
  error: null,

  // GET reading progress for a student
  getStdReadingProgress: async (studentId ) => {
    set({ isLoading: true, error: null });
    try {
      
      let id = studentId || useAuthStore.getState().authUser._id;
      
      const res = await axiosInstance.get(`/reading-progress/${id}`);
      set({ readingProgress: res.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch reading progress:", error.message);
      set({ error: error.message, isLoading: false });
      toast.error("Failed to load reading progress");
    }
  },

  // POST a new reading record
  addReadingProgress: async ( data ) => {
    try {
        const authUser = useAuthStore.getState().authUser;
      const res = await axiosInstance.post(`/reading-progress/${authUser._id}`, data);
      set((state) => ({
        readingProgress: [...state.readingProgress, res.data],
      }));
      toast.success("Reading progress added");
    } catch (error) {
      console.error("Add failed:", error.message);
      toast.error("Failed to add reading progress");
    }
  },

  // PUT update existing record
  updateReadingProgress: async (recordId, data) => {
    try {
      const res = await axiosInstance.put(`/reading-progress/${recordId}`, data);
      set((state) => ({
        readingProgress: state.readingProgress.map((r) =>
          r._id === recordId ? res.data : r
        ),
      }));
      toast.success("Reading progress updated");
    } catch (error) {
      console.error("Update failed:", error.message);
      toast.error("Failed to update reading progress");
    }
  }
}));
