import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useBooksStore = create((set, get) => ({
    books: [],
    history: [],
    booksLoading: false,
    isRegistering: false,

    getBooks: async () => {
        set({ booksLoading: true });
        try {
            const res = await axiosInstance.get('/books');
            set({ books: res.data.books });
        } catch (error) {
            console.error(error.response?.data?.message || "An error occurred");
            toast.error(error.response?.data?.message || "Failed to fetch books");
        } finally {
            set({ booksLoading: false });
        }
    },

    addBook: async (data) => {
        set({ isRegistering: true });
        try {
            const res = await axiosInstance.post('/books/add', data);
            toast.success(res.data.message);
            get().getBooks();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add book");
            return false;
        } finally {
            set({ isRegistering: false });
        }
    },

    updateBook: async (bookId, data) => {
        set({ isRegistering: true });
        try {
            const res = await axiosInstance.put(`/books/update/${bookId}`, data);
            toast.success(res.data.message);
            get().getBooks();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update book");
            return false;
        } finally {
            set({ isRegistering: false });
        }
    },

    deleteBook: async (bookId) => {
        try {
            const res = await axiosInstance.delete(`/books/delete/${bookId}`);
            toast.success(res.data.message);
            get().getBooks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete book");
        }
    },

    issueBook: async (bookId, data) => {
        try {
            const response = await axiosInstance.put(`/books/issue/${bookId}`, data);
            toast.success(response.data.message);
            get().getBooks();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to issue book");
            return false;
        }
    },

    returnBook: async (bookId) => {
        try {
            const response = await axiosInstance.put(`/books/return/${bookId}`);
            toast.success(response.data.message);
            get().getBooks();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to return book");
            return false;
        }
    },

    getUserHistory: async (userId) => {
        try {
            const res = await axiosInstance.get(`/books/history/${userId}`);
            set({ history: res.data.history });
            return res.data.history;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}));