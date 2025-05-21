import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";


export const useAdminStore = create((set, get) => ({
  teachers: [],
  batches: [],
  subjects: [],
  semesters: [],
  isLoading: false,

  getTeachers: async () => {
    set({isLoading: true});
    try {
        const res = await axiosInstance.get("/users/teachers");
        
        set({teachers: res.data.teachers});
    } catch (error) {
      console.log("Error in getTeachers:", error);
    }finally{
    set({isLoading: false});

    }
  },
  getSemesters: async () => {
    set({isLoading: true});
    try {
        const res = await axiosInstance.get("/mng/curriculum");
        
        set({semesters: res.data});
    } catch (error) {
      console.log("Error in getSemesters:", error);
    }finally{
    set({isLoading: false});

    }
  },


  getSubjects: async (semesterId) => {
    console.log(semesterId);
    
    set({isLoading: true});
    try {
        const res = await axiosInstance.get(`/mng/subjects/${semesterId}`);
        
        set({subjects: res.data});
    } catch (error) {
      console.log("Error in getSubjects:", error);
    }finally{
    set({isLoading: false});

    }
  },
  getBatches: async () => {
    set({isLoading: true});
    try {
        const res = await axiosInstance.get("/mng/batches");
        
        set({batches: res.data});
    } catch (error) {
      console.log("Error in getBatches:", error);
    }finally{
    set({isLoading: false});
    }
  },
  addBatchCemarklink: async (link, batchId) => {
    try {
      const res = await axiosInstance.patch("/mng/update-ce-link", {
        batchId,
        CEmarkListLink: link,
      });
      return res.data; // Optional: return response if needed
    } catch (error) {
      console.error("Error updating CE mark list:", error);
      throw error;
    }
  },
  addBatchIRmarklink: async (link, batchId) => {
    try {
      const res = await axiosInstance.patch("/mng/update-ir-link", {
        batchId,
        IRmarkListLink: link,
      });
      return res.data; 
    } catch (error) {
      console.error("Error updating CE mark list:", error);
      throw error;
    }
  },
  

  updateSelectedTab: async (selectedTab, newItemName) => {
    set({ isLoading: true });
    try {
      
      const res = await axiosInstance.post(`/mng/${selectedTab}`, {
        name: newItemName.trim(),
      });


      const { batches, subjects, teachers, semesters } = get();

      if (selectedTab === "batches") {
        set({ batches: [...batches, res.data.newBatch] });
      } else if (selectedTab === "semesters") {
        set({ semesters: [...semesters, res.data.newSemesters] });
      } else if (selectedTab === "subjects") {
        set({ subjects: [...subjects, res.data.newSubject] });
      } else if (selectedTab === "teachers") {
        set({ teachers: [...teachers, res.data.newTeacher] }); 
      }

      toast.success(`${newItemName} added successfully!`);
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item.");
    } finally {
      set({ isLoading: false });
    }
  }

}));