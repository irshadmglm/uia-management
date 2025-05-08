import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useFeeStore = create((set, get) => ({
  fees: {},
  isLoading: false,
  error: null,

  fetchFees: async (batchId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/fees?batchId=${batchId}`);
      
      const feesMap = response.data.reduce((acc, fees) => {
        acc[fees.studentId] = acc[fees.studentId] || {};
        acc[fees.studentId][fees.month] = fees.paid;
        return acc;
      }, {});
      set({ fees: feesMap, isLoading: false });

    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      toast.error("Failed to fetch fees");
    }
  },

  updateFee: async ({ studentId, batchId, month, paid }) => {
    const previousFees = get().fees;
    
    // Proper nested state update
    set(prev => ({
      fees: {
        ...prev.fees,
        [studentId]: {
          ...(prev.fees[studentId] || {}),
          [month]: paid
        }
      }
    }));
  
    try {
      await axiosInstance.post("/fees", {
        studentId,
        batchId,
        month,
        paid
      });
      toast.success("Fee status updated successfully", { id: "feeUpdate" });
    } catch (error) {
      set({ fees: previousFees });
      toast.error("Failed to update fees", { id: "feeUpdate" });
    }
  },

  getStudentStatus: (studentId) => {
    const fees = get().fees; 
    return fees?.[studentId] || {};
  },
  

  getStudentProgress: (studentId) => {
    const status = get().fees[studentId] || {};
    const paidMonths = Object.values(status).filter(Boolean).length;
    return Math.round((paidMonths / 12) * 100);
  },


  getBatchStats: (batchId, studentCount) => {
    const fees = get().fees;
    const monthlyFee = 3000;
    
    // Calculate actual paid months from data
    let totalPaid = 0;
    
    Object.values(fees).forEach(studentMonths => {
      Object.values(studentMonths).forEach(paid => {
        if (paid) totalPaid++;
      });
    });
  
    // Calculate pending based on total possible months
    const totalPossibleMonths = studentCount * 12;
    const totalPending = totalPossibleMonths - totalPaid;
  
    return {
      totalPaid,
      totalPending: Math.max(totalPending, 0), // Ensure non-negative
      totalAmount: `₹${(totalPaid * monthlyFee).toLocaleString()}`
    };
  },

  getStudentFeeStatus: async () => {
    set({ isLoading: true });
   try {
    const authUser = useAuthStore.getState().authUser;
    const res = await axiosInstance.get(`/fees/get-std-fees/${authUser._id}`);
    set({fees: res.data})
   } catch (error) {
    console.error("Error in getCurruntSemSubjects:", error);
  } finally {
    set({ isLoading: false });
  }
  } 
  
}));