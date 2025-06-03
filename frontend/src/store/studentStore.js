import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useStudentStore = create((set) => ({
  students: [],
  batchStudents: [],
  student: {},
  semSubjects: [],
  feeStatus: [],
  isLoading: false,
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
        
        toast.success("Account created successfully");
    
      } catch (error) {
        console.error(error.response?.data?.message || "An error occurred");
        toast.error(error.response?.data?.message || "An error occurred");
      }
    },
    
    getStudents: async () => {
      set({ isLoading: true }); 
    
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
        set({ isLoading: false });
      }
    },
    getBatchStudents: async (batchId) => {
      set({ isLoading: true }); 
    
      try {
        const res = await axiosInstance.get(`/users/${batchId}`);
    
        if (res.data && res.data.students) {

          set({ batchStudents: res.data.students });
        } else {
          console.warn("Unexpected response format:", res.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    getStudent: async (studentId) => {
      set({ isLoading: true }); 
     try {
      const res = await axiosInstance.get(`/users/student/${studentId}`)
      set({student: res.data})
      
     } catch (error) {
      console.error("Error fetching student:", error);
    } finally {
      set({ isLoading: false });
    }

    },
    
    editStudent: async (data, studentId) => {
      try {
        const response = await axiosInstance.put(`/users/student/edit/${studentId}`, data);
        
        toast.success("Account updated successfully");
      } catch (error) {
        console.error(error.response?.data?.message || "An error occurred");
        toast.error(error.response?.data?.message || "An error occurred");
      }
    },

    deleteStudent: async (studentId) => {
      try {
        const response = await axiosInstance.delete(`/users/student/delete/${studentId}`);
        if (response.status === 200) {
          toast.success("Student deleted successfully");

          set((state) => ({
            students: state.students.filter(student => student._id !== studentId)
          }));

          return true;
        } else {
          toast.error("Failed to delete the student");
          return false;
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting the student");
        return false;
      }
    },


    getCurruntSemSubjects: async () => {
       const authUser = useAuthStore.getState().authUser;
      set({isLoading: true});
      try {
        const res = await axiosInstance.get(`/mng/currunt-sem-subjects/${authUser.batchId}`);
        set({semSubjects: res.data})
        
      } catch (error) {
        console.error("Error in getCurruntSemSubjects:", error);
      } finally {
        set({ isLoading: false });
      }
    },
   
    

    
}));
