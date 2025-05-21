import React, { useState } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { ChevronDown, ChevronUp } from "lucide-react";

const BookTable = ({ books }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleDetails = (bookNumber) => {
    setExpandedRows((prev) => ({
      ...prev,
      [bookNumber]: !prev[bookNumber],
    }));
  };

  return (
    <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      {/* TABLE VIEW (Larger Screens) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="table-auto w-full text-center border-collapse">
          <thead>
            <tr className="bg-green-600 dark:bg-green-700 text-white text-sm sm:text-base">
              <th className="py-3 px-4">Book No.</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <React.Fragment key={book.bookNumber}>
                <tr
                  className={`transition-colors duration-300 text-sm ${
                    book.status === "borrowed"
                      ? "bg-green-100 dark:bg-gray-700"
                      : "bg-green-50 dark:bg-gray-900"
                  } hover:bg-green-200 dark:hover:bg-gray-600`}
                >
                  <td className="py-2 px-4 font-medium">{book.bookNumber}</td>
                  <td className="px-4 text-gray-900 dark:text-gray-200">{book.title}</td>
                  <td className="px-4 text-gray-900 dark:text-gray-200">{book.author}</td>
                  <td className="px-4 text-gray-900 dark:text-gray-200">${book.price}</td>
                  <td className="px-4">
                    <button
                      onClick={() => toggleDetails(book.bookNumber)}
                      className="flex items-center gap-1 bg-green-600 dark:bg-green-700 text-white px-3 py-1 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
                    >
                      {expandedRows[book.bookNumber] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      Details
                    </button>
                  </td>
                </tr>
                {expandedRows[book.bookNumber] && (
                  <tr className="bg-gray-50 dark:bg-gray-700 transition-all duration-300">
                    <td colSpan="5" className="p-4 text-left text-sm text-gray-800 dark:text-gray-300">
                      <div className="space-y-2">
                        <p>
                          <strong>Status:</strong> {book.status}
                        </p>
                        <p>
                          <strong>Borrowed By:</strong> {book.borrowedBy}
                        </p>
                        <p>
                          <strong>Student Name:</strong> {book.studentName}
                        </p>
                        <p>
                          <strong>Due Date:</strong> {book.dueDate}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW (Card Layout) */}
      <div className="sm:hidden">
        {books.map((book) => (
          <div
            key={book.bookNumber}
            className="mb-4 p-4 bg-green-50 dark:bg-gray-900 rounded-lg shadow-md transition hover:shadow-lg"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{book.title}</h3>
              <button
                onClick={() => toggleDetails(book.bookNumber)}
                className="flex items-center text-green-600 dark:text-green-400"
              >
                {expandedRows[book.bookNumber] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                <span className="ml-1 text-sm">Details</span>
              </button>
            </div>
            {expandedRows[book.bookNumber] && (
              <div className="mt-2 text-gray-800 dark:text-gray-300 space-y-2">
                <p>
                  <strong>Book No:</strong> {book.bookNumber}
                </p>
                <p>
                  <strong>Author:</strong> {book.author}
                </p>
                <p>
                  <strong>Price:</strong> ${book.price}
                </p>
                <p>
                  <strong>Status:</strong> {book.status}
                </p>
                {book.status === "borrowed" && (
                  <>
                    <p>
                      <strong>Borrowed By:</strong> {book.borrowedBy}
                    </p>
                    <p>
                      <strong>Student Name:</strong> {book.studentName}
                    </p>
                    <p>
                      <strong>Due Date:</strong> {book.dueDate}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookTable;
