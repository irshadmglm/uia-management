import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Undo2, AlertCircle } from "lucide-react";
import { useBooksStore } from "../store/useBooksStore";


const TransactionsDetails = ({ details }) => {
 const { bookReturn } = useBooksStore();
  const [expandedRows, setExpandedRows] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [returnedBooks, setReturnedBooks] = useState([]);

  const toggleDetails = (bookNumber) => {
    setExpandedRows((prev) => ({
      ...prev,
      [bookNumber]: !prev[bookNumber],
    }));
  };

  const handleReturn = (bookNumber) => {
    if (window.confirm("Are you sure you want to return this book?")) {
      setReturnedBooks((prev) => [...prev, bookNumber]);
      bookReturn(bookNumber);
      
    
    }
  };

  

  // Filter the details based on the search query
  const filteredBooks = details.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.bookTitle.toLowerCase().includes(query) ||
      book.studentName.toLowerCase().includes(query) ||
      String(book.bookNumber).includes(query)
    );
  });

  // Sort the filtered books by due date
  const sortedBooks = filteredBooks.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 mt-">
      {/* Search and Sort Controls */}
      <div className="flex flex-row items-center justify-between mb-4 gap-4 mt-20">
        <input
          type="text"
          placeholder="Search by Title, Student or Book No..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
  onClick={toggleSortOrder}
  className="flex items-center gap-1 p-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 transition"
>
  Date <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
</button>

      </div>

      {/* Card Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sortedBooks.map((book) => {
          const isOverdue = new Date() > new Date(book.dueDate);
          const isReturned = returnedBooks.includes(book.bookNumber);
          return (
            <div
              key={book.bookNumber}
              className={`
                bg-white dark:bg-gray-800 rounded-lg shadow border 
                ${isOverdue && !isReturned ? "border-red-500" : "border-gray-200 dark:border-gray-700"}
                hover:shadow-lg transition duration-300 relative
              `}
            >
              {/* Overdue Badge */}
              {isOverdue && !isReturned && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  <AlertCircle size={14} /> Overdue
                </div>
              )}
              {/* Returned Badge */}
              {isReturned && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Returned
                </div>
              )}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {book.bookTitle}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Book No: <span className="font-medium">{book.bookNumber}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Student: <span className="font-medium">{book.studentName}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(book.dueDate).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => toggleDetails(book.bookNumber)}
                      className="p-2 bg-green-600 dark:bg-green-700 rounded-full text-white hover:bg-green-700 transition"
                    >
                      {expandedRows[book.bookNumber] ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                    {!isReturned && (
                      <button
                        onClick={() => handleReturn(book.bookNumber)}
                        className="p-2 bg-red-600 dark:bg-red-700 rounded-full text-white hover:bg-red-700 transition"
                      >
                        <Undo2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {expandedRows[book.bookNumber] && (
                <div className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
                  <p>
                    <strong>Borrow Date:</strong>{" "}
                    {new Date(book.borrowDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Due Date:</strong>{" "}
                    {new Date(book.dueDate).toLocaleDateString()}
                  </p>
                  {/* You can add more details here if needed */}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionsDetails;
