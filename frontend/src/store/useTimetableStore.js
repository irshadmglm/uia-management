import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useTimetableStore = create((set, get) => ({
  timetable: null,
  isLoading: false,
  isImporting: false,
  error: null,

  // Teacher-specific schedule state
  teacherSchedule: null,
  isTeacherLoading: false,

  // Batch-specific schedule state
  batchSchedule: null,
  isBatchLoading: false,

  fetchTimetable: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/mng/timetable");
      const timetableData = res.data?.timetable || res.data;
      set({ timetable: timetableData, isLoading: false });
      return timetableData;
    } catch (err) {
      console.error("Error fetching timetable:", err);
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  saveTimetable: async (payload) => {
    try {
      const res = await axiosInstance.post("/mng/timetable", payload);
      const timetableData = res.data?.timetable || res.data;
      set({ timetable: timetableData });
      toast.success("Timetable saved successfully!");
      return timetableData;
    } catch (err) {
      console.error("Error saving timetable:", err);
      toast.error(err.response?.data?.message || "Failed to save timetable");
      throw err;
    }
  },

  importTimetableData: async ({ slots, teacherMappings, batchMappings, metadata, title }) => {
    set({ isImporting: true });
    try {
      const res = await axiosInstance.post("/mng/timetable/import", {
        slots,
        teacherMappings,
        batchMappings,
        metadata,
        title,
      });

      const updatedTimetable = res.data?.timetable;
      set({ timetable: updatedTimetable, isImporting: false });
      toast.success(res.data?.message || "Timetable imported successfully!");
      return res.data;
    } catch (err) {
      console.error("Error importing timetable:", err);
      set({ isImporting: false });
      toast.error(err.response?.data?.message || "Failed to import timetable");
      throw err;
    }
  },

  fetchTeacherTimetable: async (teacherId) => {
    if (!teacherId) return null;
    set({ isTeacherLoading: true });
    try {
      const res = await axiosInstance.get(`/mng/timetable/teacher/${teacherId}`);
      set({ teacherSchedule: res.data, isTeacherLoading: false });
      return res.data;
    } catch (err) {
      console.error("Error fetching teacher timetable:", err);
      set({ isTeacherLoading: false });
      return null;
    }
  },

  fetchBatchTimetable: async (batchId) => {
    if (!batchId) return null;
    set({ isBatchLoading: true });
    try {
      const res = await axiosInstance.get(`/mng/timetable/batch/${batchId}`);
      set({ batchSchedule: res.data, isBatchLoading: false });
      return res.data;
    } catch (err) {
      console.error("Error fetching batch timetable:", err);
      set({ isBatchLoading: false });
      return null;
    }
  },

  clearTimetable: async () => {
    try {
      await axiosInstance.delete("/mng/timetable/clear");
      await get().fetchTimetable();
      toast.success("Timetable cleared successfully");
    } catch (err) {
      console.error("Error clearing timetable:", err);
      toast.error("Failed to clear timetable");
    }
  },
}));

