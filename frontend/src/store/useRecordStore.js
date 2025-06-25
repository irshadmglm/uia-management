import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useRecordStore = create((set, get) => ({
  records: [],
  isLoading: false,

  fetchRecords: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/records");
      set({ records: res.data });
    } catch (error) {
      toast.error("Failed to fetch records");
    } finally {
      set({ isLoading: false });
    }
  },

  addRecord: async (recordData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/records", recordData);
      set((state) => ({
        records: [res.data, ...state.records],
      }));
      toast.success("Record added successfully");
    } catch (error) {
      toast.error("Failed to add record");
    } finally {
      set({ isLoading: false });
    }
  },

  updateRecord: async (id, updatedData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.put(`/records/${id}`, updatedData);
      set((state) => ({
        records: state.records.map((rec) =>
          rec._id === id ? res.data : rec
        ),
      }));
      toast.success("Record updated");
    } catch (error) {
      toast.error("Failed to update record");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteRecord: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/records/${id}`);
      set((state) => ({
        records: state.records.filter((rec) => rec._id !== id),
      }));
      toast.success("Record deleted");
    } catch (error) {
      toast.error("Failed to delete record");
    } finally {
      set({ isLoading: false });
    }
  },
}));
