import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useStudentStore = create((set) => ({
  students: [],
  batchStudents: [],
  studentsLoading: false,
  responseMessage: { text: "", type: "" },
  formData: { 
    studentName: "",
    selectedBatch: "",
    rollNumber: "",
    gender: "",
    studentId: "",
  },

  updateField: (name, value) =>
    set((state) => ({ formData: { ...state.formData, [name]: value } })),

  setResponseMessage: (message) => set({ responseMessage: message }),

  resetForm: () =>
    set({
      formData: {
        studentName: "",
        selectedBatch: "",
        rollNumber: "",
        gender: "",
        studentId: ""
      },
    }),

    registerStudent: async (data) => {
      try {
        const response = await axiosInstance.post("/users/add", data, {
          headers: { "Content-Type": "application/json" },
        });
        
        console.log(response.data); 
        toast.success("Account created successfully");
    
      } catch (error) {
        console.error(error.response?.data?.message || "An error occurred");
        toast.error(error.response?.data?.message || "An error occurred");
      }
    },
    
    getStudents: async () => {
      set({ studentsLoading: true }); 
    
      try {
        const res = await axiosInstance.get("/users");
    
        if (res.data && res.data.students) {
          set({ students: res.data.students });
        } else {
          console.warn("Unexpected response format:", res.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        set({ studentsLoading: false });
      }
    },
    getBatchStudents: async (batchId) => {
      set({ studentsLoading: true }); 
    
      try {
        const res = await axiosInstance.get(`/users/${batchId}`);
    
        if (res.data && res.data.students) {
              console.log("batchStudents",  res.data.students);

          set({ batchStudents: res.data.students });
        } else {
          console.warn("Unexpected response format:", res.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        set({ studentsLoading: false });
      }
    },
    
    editStudent : async (data) => {
      try {
        const response = await axiosInstance.post(`/users/edit`, data, {
          headers: { "Content-Type": "application/json" },
        });
         
        console.log(response.data); 
        toast.success("Account updated successfully");
      } catch (error) {
        console.error(error.response?.data?.message || "An error occurred");
        toast.error(error.response?.data?.message || "An error occurred");
      }
    },

    
    

    
}));
