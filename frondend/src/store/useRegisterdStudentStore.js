import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useRegisterdStudentStore = create((set, get) => ({
  Registeredstudents: [],
  filteredStudents: [],
  isLoading: false,
 
  newAdmission: async (data) => {
    set({ isLoading: true }); 

      try {
        const response = await axiosInstance.post("/admission", data, {
          headers: { "Content-Type": "application/json" },
        });
        
        toast.success(response.data.message);
    
      } catch (error) {
        console.error(error.response?.data?.message || "An error occurred");
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        set({ isLoading: false });
      }
    },
    
    getRegisteredStudents: async () => {
      set({ isLoading: true }); 
    
      try {
        const res = await axiosInstance.get("/admission");
    
        if (res.data && res.data.students) {
          set({ Registeredstudents: res.data.students });
          set({ filteredStudents: res.data.students });
        } else {
          console.warn("Unexpected response format:", res.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        set({ isLoading: false });
      }
    },
    filteringBatch: (selectedBatch) => {
      const { Registeredstudents } = get(); 
      let filteredStudents = null;
      if(selectedBatch === "All Batch"){
        filteredStudents = Registeredstudents;
      }else{
        filteredStudents = Registeredstudents.filter((student) => student.selectedBatch === selectedBatch);
      }
      set({ filteredStudents }); 
    },
    
    selectStudent : async (id, isSelected) => {
      try {
        
          const response = await axiosInstance.post('/admission/selected', {id, isSelected});
        
        toast.success(response.data.message);

      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "An error occurred");
      }
    }
    
    // editStudent : async (data) => {
    //   try {
    //     const response = await axiosInstance.post(`/users/edit`, data, {
    //       headers: { "Content-Type": "application/json" },
    //     });
         
    //     toast.success("Account updated successfully");
    //   } catch (error) {
    //     console.error(error.response?.data?.message || "An error occurred");
    //     toast.error(error.response?.data?.message || "An error occurred");
    //   }
    // },
    
    
}));
