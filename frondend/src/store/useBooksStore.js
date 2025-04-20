import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useBooksStore = create((set,get) => ({
    books: [],
    booksLoading: false,
    isRegistering: false,
    getBooks: async () => {
        set({ booksLoading: true });
        try {
            const res = await axiosInstance.get('/books');
            set({books: res.data.books});
            
        } catch (error) {
          console.error(error.response?.data?.message || "An error occurred");
            toast.error(error.response?.data?.message || "An error occurred");
        }finally{
            set({ booksLoading: false });
        }
    },
    bookBorrow: async (data) => {
        console.log(data);
        
        try {
          const response = await axiosInstance.post("/transactions/borrow", data, {
            headers: { "Content-Type": "application/json" },
          });
      
          console.log(response.data.message);
          toast.success(response.data.message);
      
        } catch (error) {
          console.error(error.response?.data?.message || "An error occurred");
          toast.error(error.response?.data?.message || "An error occurred");
        }
      },
      
      bookReturn: async (bookNumber) => {
        try {
          const response = await axiosInstance.post(
            "/transactions/return",
            { bookNumber },  
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          console.log(response.data.message);
      
          toast.success(response.data.message);
        } catch (error) {
          console.log(error.response?.data?.message || "An error occurred");
          toast.error(error.response?.data?.message || "An error occurred");
        }
      }

}))