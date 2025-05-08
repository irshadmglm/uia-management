import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useMarksStore = create((set, get) => ({
    semesters: [],
    isLoading: false,
    markList: [],
    countToApprove: [],

    addMarkList: async (studentId, semesterId, markList) => {
        set({isLoading: true})
        try {
          const res = await axiosInstance.post("/marklist", {
            studentId,
            semesterId,
            markList,
          });
          toast.success(res.data.message);
        } catch (error) {
          toast.error(error.message);
        } finally {
            set({isLoading: false})
        }
    },
    getMarkList: async (studentId, semesterId) => {
        set({isLoading: true});
        try {
            if(studentId, semesterId){
                const res = await axiosInstance.get(`/marklist/?studentId=${studentId}&semesterId=${semesterId}`);
            set({markList: res.data})
            }else if(studentId){
                const res = await axiosInstance.get(`/marklist/?studentId=${studentId}`);
            set({markList: res.data})
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            set({isLoading: false})
        }
    },
    getMarkListToapprove: async (batchId) => {
        set({isLoading: true});
        try {
            const res = await axiosInstance.get(`/marklist/?batchId=${batchId}`);
            set({markList: res.data})
        
        } catch (error) {
            toast.error(error.message);
        } finally {
            set({isLoading: false})
        }
    },
    getcountToApprove: async () => {
        try {
            const res =await axiosInstance.get('/marklist/countToApprove');
            
            set({countToApprove: res.data})
        } catch (error) {
            console.log("Error in getcountToApprove", error);
        }
    },

    getSemesters: async () => {
        set({ isLoading: true });
    
        try {
            const res = await axiosInstance.get('/mng/curriculum'); 
    
            set({ semesters: res.data });
        } catch (error) {
            console.log("Error in getSemesters:", error);
        } finally {
            set({ isLoading: false }); 
        }
    }
    
}))