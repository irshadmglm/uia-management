import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useLeaveStore = create((set, get) => ({
  leaveData: [],
  sheetBatches: [],
  stats: { total: 0, critical: 0, safe: 0 },
  isLoading: false,

  fetchSheetBatches: async () => {
    try {
        const res = await axiosInstance.get('/leave/batches');
        set({ sheetBatches: res.data.batches });
    } catch (error) { console.error(error); }
  },

  fetchLeaveData: async (batchName) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/leave/status?batchName=${batchName}`);
      set({ leaveData: res.data.data, stats: res.data.stats });
    } catch (error) {
      toast.error("Failed to load data");
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
        await axiosInstance.put('/leave/update', { batchName, cicNumber, updates });
        toast.success("Updated");
        // Re-fetch to calculate formulas correctly from sheet
        get().fetchLeaveData(batchName); 
    } catch (error) {
        toast.error("Update failed");
        set({ leaveData: oldData }); // Revert
    }
  },

  addStudent: async (batchName, data) => {
      try {
          await axiosInstance.post('/leave/add', { batchName, ...data });
          toast.success("Student Added");
          get().fetchLeaveData(batchName);
      } catch (error) {
          toast.error("Failed to add");
      }
  },

  deleteStudent: async (batchName, cicNumber) => {
      if(!window.confirm("Delete this student from the sheet?")) return;
      
      const oldData = get().leaveData;
      set(state => ({ leaveData: state.leaveData.filter(s => s.cicNumber !== cicNumber) }));

      try {
          await axiosInstance.post('/leave/delete', { batchName, cicNumber });
          toast.success("Deleted");
      } catch (error) {
          toast.error("Delete failed");
          set({ leaveData: oldData });
      }
  }
}));