import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";


export const useAdminStore = create((set, get) => ({
  teachers: [],
  batches: [],
  subjects: [],
  artSubjects: [],
  semesters: [],
  artSems: [],
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
        const res = await axiosInstance.get("/mng/semester");
        
        set({semesters: res.data});
    } catch (error) {
      console.log("Error in getSemesters:", error);
    }finally{
    set({isLoading: false});

    }
  },
  getArtSems: async () => {
    set({isLoading: true});
    try {
        const res = await axiosInstance.get("/mng/art-sem");
        
        set({artSems: res.data});
    } catch (error) {
      console.log("Error in getArtSems:", error);
    }finally{
    set({isLoading: false});

    }
  },

  deleteSemester: async (semesterId) => {
    try {
      const res = await axiosInstance.delete(`/mng/semester/delete/${semesterId}`);
      if (res.status === 200) {
        toast.success("Semester deleted successfully");
        set((state) => ({
          semesters: state.semesters.filter(semester => semester._id !== semesterId)
        }));
      } else {
        toast.error("Failed to delete the Semester");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting Semester");
      return false;
    }
  },
  deleteArtSems: async (artSemId) => {
    try {
      const res = await axiosInstance.delete(`/mng/art-sem/delete/${artSemId}`);
      if (res.status === 200) {
        toast.success("ArtSemsem deleted successfully");
        set((state) => ({
          artSems: state.artSems.filter(artSem => artSem._id !== artSemId)
        }));
      } else {
        toast.error("Failed to delete the artSem");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting artSem");
      return false;
    }
  },
  
  updateSemester: async (semesterId, name) => {
    try {
      const res = await axiosInstance.put(`/mng/semester/update/${semesterId}`, {name});
      if (res.status === 200) {
        toast.success("Semester updated successfully");
        set((state) => ({
          semesters: state.semesters.map((semester) =>
            semester._id === semesterId
              ? { ...semester, name }
              : semester
          )
        }));
        
      } else {
        toast.error("Failed to update Semester");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the Semester");
      return false;
    }
  },
  updateArtSem: async (artSemId, name) => {
    try {
      const res = await axiosInstance.put(`/mng/art-sem/update/${artSemId}`, {name});
      if (res.status === 200) {
        toast.success("artSem updated successfully");
        set((state) => ({
          artSems: state.artSems.map((artSem) =>
            artSem._id === artSemId
              ? { ...artSem, name }
              : artSem
          )
        }));
        
      } else {
        toast.error("Failed to update artSem");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the artSem");
      return false;
    }
  },
  
  deleteBatch: async (batchId) => {
    try {
      const res = await axiosInstance.delete(`/mng/batch/delete/${batchId}`);
      if (res.status === 200) {
        toast.success("Batch deleted successfully");
        set((state) => ({
          batches: state.batches.filter(batch => batch._id !== batchId)
        }));
      } else {
        toast.error("Failed to delete the Batch");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the Batch");
      return false;
    }
  },
  
  updateBatch: async (batchId, name) => {
    try {
      
      const res = await axiosInstance.put(`/mng/batch/update/${batchId}`, {name});
      if (res.status === 200) {
        toast.success("Batch updated successfully");
        set((state) => ({
          batches: state.batches.map((batch) =>
            batch._id === batchId
              ? { ...batch, name }
              : batch
          )
        }));
        
      } else {
        toast.error("Failed to update the Batch");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the Batch");
      return false;
    }
  },
  

  getSubjects: async (semesterId) => {
    
    set({isLoading: true});
    try {
        const res = await axiosInstance.get(`/mng/subjects/${semesterId}`);
        
        set({subjects: res.data});
        return response.data;
    } catch (error) {
      console.log("Error in getSubjects:", error);
    }finally{
    set({isLoading: false});

    }
  },
  getArtSubjects: async (semesterId) => {
    
    set({isLoading: true});
    try {
        const res = await axiosInstance.get(`/mng/art-subjects/${semesterId}`);
        
        set({artSubjects: res.data});
        return response.data;
    } catch (error) {
      console.log("Error in getSubjects:", error);
    }finally{
    set({isLoading: false});
    }
  },

  addSubject: async (semesterId, details) => {
    try {
      const response = await axiosInstance.post(`mng/subjects/${semesterId}`, details);
  console.log(response);
  
      if (response.status === 201 || response.status === 200) {
        toast.success("Subject added successfully");
  
        const newSubject = response.data.newSubject 

        if (details.isArtSub) {
            set((state) => ({ artSubjects: [...state.artSubjects, newSubject] }));
          } else {
            set((state) => ({ subjects: [...state.subjects, newSubject] }));
          }

       
  
        return true;
      } else {
        toast.error("Failed to add subject");
        return false;
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("An error occurred while adding the subject");
      return false;
    }
  },
  
  deleteSubject: async (subjectId) => {
    try {
      const res = await axiosInstance.delete(`/mng/subject/delete/${subjectId}`);
      if (res.status === 200) {
        toast.success("Subject deleted successfully");
        set((state) => ({
          subjects: state.subjects.filter(subject => subject._id !== subjectId )
        }));
      } else {
        toast.error("Failed to delete the Subject");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the Subject");
      return false;
    }
  },
  
  updateSubject: async (subjectId, details) => {
    try {
      const res = await axiosInstance.put(`/mng/subject/update/${subjectId}`, details);
      if (res.status === 200) {
        toast.success("Subject updated successfully");
  
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject._id === subjectId
              ? { ...subject, ...details }
              : subject
          )
        }));
  
      } else {
        toast.error("Failed to update the subject");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the Subject");
      return false;
    }
  },
  deleteArtSubject: async (subjectId) => {
    try {
      const res = await axiosInstance.delete(`/mng/art-subject/delete/${subjectId}`);
      if (res.status === 200) {
        toast.success("Subject deleted successfully");
        set((state) => ({
          subjects: state.subjects.filter(subject => subject._id !== subjectId )
        }));
      } else {
        toast.error("Failed to delete the Subject");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the Subject");
      return false;
    }
  },
  
  updateArtSubject: async (subjectId, details) => {
    try {
      const res = await axiosInstance.put(`/mng/art-subject/update/${subjectId}`, details);
      if (res.status === 200) {
        toast.success("Subject updated successfully");
  
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject._id === subjectId
              ? { ...subject, ...details }
              : subject
          )
        }));
  
      } else {
        toast.error("Failed to update the subject");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the Subject");
      return false;
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
  addAcademicStatuslink: async (link, batchId, item) => {
    try {
      const res = await axiosInstance.patch("/mng/update-academic-status-link", {
        batchId,
        [item]: link,
      });
      return res.data; 
    } catch (error) {
      console.error("Error updating Academic Status:", error);
      throw error;
    }
  },
  deleteAcademicStatuslink: async (batchId, item) => {
    try {
      const res = await axiosInstance.patch("/mng/delete-academic-status-link", {
        batchId,
        item
      });
      set((state) => ({
  batches: state.batches.map(batch => {
    if (batch._id === batchId) {
      return {
        ...batch,
        [item]: null, 
      };
    }
    return batch;
  })
}));
      return res.data; 
    } catch (error) {
      console.error("Error deteting Academic Status:", error);
      throw error;
    }
  },
  

  updateSelectedTab: async (selectedTab, newItemName) => {
    set({ isLoading: true });
    try {
      let endpoint;
      
       if (selectedTab === "semester Subjects"){
        endpoint = "semester"
      }else if (selectedTab === "arts Subjects"){
        endpoint = "art-sem"
      }else if (selectedTab === "batches"){
        endpoint = "batches"
      }
      const res = await axiosInstance.post(`/mng/${endpoint}`, {
        name: newItemName.trim(),
      });


      const { batches, subjects, teachers, semesters, artSems } = get();

      if (selectedTab === "batches") {
        set({ batches: [...batches, res.data.newBatch] });
      } else if (selectedTab === "current Semester") {
        set({ semesters: [...semesters, res.data.newSemester] });
      } else if (selectedTab === "semester Subjects") {
        set({ semesters: [...semesters, res.data.newSemester] });
      }  else if (selectedTab === "arts Subjects") {
        set({ artSems: [...artSems, res.data.newArtSem] });
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