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
        console.log(res.data);
        
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
        console.log(res.data);
        
        set({semesters: res.data});
    } catch (error) {
      console.log("Error in getSemesters:", error);
    }finally{
    set({isLoading: false});

    }
  },


  getSubjects: async () => {
    set({isLoading: true});
    try {
        const res = await axiosInstance.get("/mng/subjects");
        console.log(res.data);
        
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
        console.log(res.data);
        
        set({batches: res.data});
    } catch (error) {
      console.log("Error in getBatches:", error);
    }finally{
    set({isLoading: false});
    }
  },
  updateSelectedTab: async (selectedTab, newItemName) => {
    set({ isLoading: true });
    try {
      console.log("selectedtab:",selectedTab, "newItem", newItemName);
      
      const res = await axiosInstance.post(`/mng/${selectedTab}`, {
        name: newItemName.trim(),
      });

      console.log(res);

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