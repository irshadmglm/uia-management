import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";


export const useStaffStore = create((set, get) => ({
  teachers: [],
  isLoading: false,
  batches: [],
  attendance:{},

  getTeachers: async () => {
    set({isLoading: true});
    try {
        const res = await axiosInstance.get("/users/teachers");
        console.log(res.data);
        
        set({teachers: res.data.teachers});
    } catch (error) {
      console.log("Error in getTeachers:", error);
    }finally{
    set({isLoading: false});

    }
  },

  getBatch: async () => {
    try {
    const authUser = useAuthStore.getState().authUser
    if (!authUser) {
      console.error("User is not authenticated!");
    } else {
      console.log("authUser:", authUser);
     const res = await axiosInstance.get(`/mng/class/${authUser._id}`)
     console.log("data:",res.data.assignedbatches);
     
     set({batches: res.data.assignedbatches});
    }
    } catch (error) {
      console.log("Error in getTeachers:", error);
    }finally{
    set({isLoading: false});
    }
  },

  submitAttendance: async (classId, attendance, date) => {
    set({isLoading: true});
    try {
      console.log(classId, attendance, date);
      
      // date = new Date(date).toISOString();
      const res = await axiosInstance.post('/mng/mark-attendance',{classId, attendance, date})

      console.log("Attendance submitted successfully:", res.data);

      await useStaffStore.getState().getBatch(); 
      
    } catch (error) {
      console.log("Error in submitAttendance:", error);
    }finally{
      set({isLoading: false});
      }
  },

  getAttendance: async (classId, date) => {
    set({isLoading: true});
    try {
      const res = await axiosInstance.get(`/mng/mark-attendance/?classId=${classId}&date=${date}`)

      set({ attendance: res.data.attendance || {} });
    } catch (error) {
      console.log("Error in getAttendance:", error);
    }finally{
      set({isLoading: false});
      }
  }

}));