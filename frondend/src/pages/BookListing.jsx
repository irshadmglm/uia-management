import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AlertCircle, RefreshCw } from "lucide-react";
import BookTable from "../components/BookTable";
import { useBooksStore } from "../store/useBooksStore";

const BookListing = () => {
  const { getBooks, books, booksLoading } = useBooksStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        await getBooks();
      } catch (err) {
        setError("Failed to fetch student data. Please try again.");
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header  />

      {booksLoading ? (
        <div className="mt-10 text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-500"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center mt-10">
          <AlertCircle className="text-red-500 dark:text-red-400" size={48} />
          <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 dark:hover:bg-red-700 transition"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      ) : (
        <BookTable books={books} />
      )}

      <Footer />
    </div>
  );
};

export default  BookListing;
