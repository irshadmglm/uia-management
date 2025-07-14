import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";


export const useStaffStore = create((set, get) => ({
  teachers: [],
  teacher: {},
  isLoading: false,
  batches: [],
  batch: {},
  attendance:{},
  assignedSubjects: [],

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

  getTeacher: async (teacherId) => {
    set({ isLoading: true }); 
   try {
    const res = await axiosInstance.get(`/users/teacher/${teacherId}`)
    set({teacher: res.data})
    
   } catch (error) {
    console.error("Error fetching teacher:", error);
  } finally {
    set({ isLoading: false });
  }

  },
  updateTeacher: async (teacherId, details) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put(`/users/teacher/update/${teacherId}`, details); 
      toast.success("Teacher Details updated successfully");
      set((state) => ({
        teachers: state.teachers.map((teacher) =>
          teacher._id === teacherId ? { ...teacher, ...details } : teacher
        ),
      }));
    } catch (error) {
      console.log("Error in updateTeacher:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteTeacher: async (teacherId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/users/teacher/delete/${teacherId}`); 
      toast.success("Teacher Details updated successfully");
      set((state) => ({
        teachers: state.teachers.filter((teacher) => teacher._id !== teacherId),
      }));
    } catch (error) {
      console.log("Error in deleteTeacher:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getBatch: async () => {
    try {
    const authUser = useAuthStore.getState().authUser
    if (!authUser) {
      console.error("User is not authenticated!");
    } else {
     const res = await axiosInstance.get(`/mng/class/${authUser._id}`)
     
     set({batches: res.data.assignedbatches});
    }
    } catch (error) {
      console.log("Error in getTeachers:", error);
    }finally{
    set({isLoading: false});
    }
  },

  getBatchById: async (batchId)=> {
    set({isLoading: true});
    try {      
      const res = await axiosInstance.get(`/mng/batch/${batchId}`)
      set({batch: res.data.batch});
    } catch (error) {
      console.log("Error in getTeachers:", error);
    }finally{
    set({isLoading: false});
    }
  },
  getStudentBatch: async () => {
  const authUser = useAuthStore.getState().authUser;

  try {
    await get().getBatchById(authUser.batchId);
  } catch (error) {
    console.error("Error in getStudentBatch:", error);
  }
},

  getAssignedSubjects: async (teacherId) => {
    set({isLoading: true});
    let userId;
    if(!teacherId){
      userId = useAuthStore.getState().authUser._id;
    }else{
      userId = teacherId;
    }
    try {
      const res = await axiosInstance.get(`/mng/assigned-subjects/${userId}`);
      set({assignedSubjects: res.data})
    } catch (error) {
      console.log("Error in getAssignedSubjects:", error);
    }finally{
      set({isLoading: false});
      }
  },

  submitAttendance: async (classId, attendance, date) => {
    set({isLoading: true});
    try {
      
      // date = new Date(date).toISOString();
      const res = await axiosInstance.post('/mng/mark-attendance',{classId, attendance, date})


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