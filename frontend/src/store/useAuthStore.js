import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";


export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      console.log(res.data);
      
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({  });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      
      set({ authUser: res.data });
      toast.success("Logged in successfully");

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

 changePassword: async (currentPassword, newPassword ) => {
  try {
    const user = get().authUser;

    const data = {
      ...(user.role === "student" && { studentId: user._id }),
      ...(user.role === "teacher" && { teacherId: user._id }),
      currentPassword,
      newPassword,
    };

    const res = await axiosInstance.patch("/users/change-password", data);
    toast.success( res.message || "Password updated successfully");
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.message || "Failed to update password");
  }
}


  // updateProfile: async (data) => {
  //   set({ isUpdatingProfile: true });
  //   try {
  //     const res = await axiosInstance.put("/auth/update-profile", data);
  //     set({ authUser: res.data });
  //     toast.success("Profile updated successfully");
  //   } catch (error) {
  //     console.log("error in update profile:", error);
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isUpdatingProfile: false });
  //   }
  // },

}));