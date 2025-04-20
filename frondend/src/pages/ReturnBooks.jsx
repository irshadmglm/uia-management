import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AlertCircle, RefreshCw } from "lucide-react";
import TransactionsDetails from "../components/TransactionsDetails";
import { useBooksStore } from "../store/useBooksStore";
import { axiosInstance } from "../lib/axios";

const ReturnBooks = () => {
  const {bookReturn} = useBooksStore()
  const [transactions, setTransactions] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axiosInstance.get("/transactions/borrowed"); 
        console.log(response.data.borrowedBooks);
        
        setTransactions(response.data.borrowedBooks);
        setFilteredBooks(response.data.borrowedBooks);
        setLoading(false);
      } catch (err) {
        setError("Failed to load books");
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handleSearch = (query) => {
    setFilteredBooks(
        transactions.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div className={`min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
      <Header />

      {loading ?  (
    <div className="mt-10 text-center">
      <p className="text-gray-600 dark:text-gray-400">Loading books...</p>
      <span className="loading loading-dots loading-md"></span>
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
        <TransactionsDetails details={transactions} />
      )}

      <Footer />
    </div>
  );
};

export default ReturnBooks