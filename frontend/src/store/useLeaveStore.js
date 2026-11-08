import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useLeaveStore = create((set, get) => ({
  leaveData: [],
  sheetBatches: [],
  teacherBatches: [],
  canEdit: false,
  stats: { totalStudents: 0, critical: 0, safe: 0 },
  isLoading: false,

  fetchSheetBatches: async () => {
    try {
        const res = await axiosInstance.get('/leave/batches');
        const batches = res.data.batches || [];
        const teacherBatches = res.data.teacherBatches || [];
        set({ sheetBatches: batches, teacherBatches });
        return { batches, teacherBatches };
    } catch (error) { 
        console.error("fetchSheetBatches error:", error);
        return { batches: [], teacherBatches: [] };
    }
  },

  fetchLeaveData: async (batchName) => {
    if (!batchName) return;
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/leave/status?batchName=${encodeURIComponent(batchName)}`);
      set({ 
        leaveData: res.data.data || [], 
        stats: res.data.stats || { totalStudents: 0, critical: 0, safe: 0 },
        canEdit: res.data.canEdit ?? false
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load leave data");
    } finally {
      set({ isLoading: false });
    }
  },

  updateStudentLeave: async (batchName, cicNumber, updates) => {
    // Optimistic Update
    const oldData = get().leaveData;
    set(state => ({
        leaveData: state.leaveData.map(s => 
            s.cicNumber === cicNumber ? { ...s, ...updates } : s
        )
    }));

    try {
        const res = await axiosInstance.put('/leave/update', { batchName, cicNumber, updates });
        toast.success(res.data.message || "Leave updated successfully");
        // Re-fetch to calculate formulas correctly from sheet
        get().fetchLeaveData(batchName); 
        return true;
    } catch (error) {
        toast.error(error.response?.data?.message || "Update failed");
        set({ leaveData: oldData }); // Revert
        return false;
    }
  },

  addStudent: async (batchName, data) => {
      try {
          const res = await axiosInstance.post('/leave/add', { batchName, ...data });
          toast.success(res.data.message || "Student Added");
          get().fetchLeaveData(batchName);
          return true;
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to add student");
          return false;
      }
  },

  deleteStudent: async (batchName, cicNumber) => {
      if(!window.confirm("Delete this student from the leave register?")) return;
      
      const oldData = get().leaveData;
      set(state => ({ leaveData: state.leaveData.filter(s => s.cicNumber !== cicNumber) }));

      try {
          const res = await axiosInstance.post('/leave/delete', { batchName, cicNumber });
          toast.success(res.data.message || "Deleted successfully");
          return true;
      } catch (error) {
          toast.error(error.response?.data?.message || "Delete failed");
          set({ leaveData: oldData });
          return false;
      }
  }
}));