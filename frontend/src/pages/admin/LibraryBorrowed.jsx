import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, User, Calendar } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';

const calculateDays = (issueDate) => {
  if (!issueDate) return 0;
  return Math.floor((new Date() - new Date(issueDate)) / (1000 * 86400));
};

const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] p-5">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-[#0d2522]"></div>
      <div className="space-y-1.5 flex-1">
        <div className="h-3 bg-gray-100 dark:bg-[#0d2522] rounded w-3/4"></div>
        <div className="h-2.5 bg-gray-100 dark:bg-[#0d2522] rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const LibraryBorrowed = () => {
  const [allBorrowedBooks, setAllBorrowedBooks] = useState([]);
  const [borrowedLoading, setBorrowedLoading] = useState(false);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    setBorrowedLoading(true);
    try {
      const res = await axiosInstance.get('/books', { params: { status: 'Borrowed', limit: 1000 } });
      setAllBorrowedBooks(res.data.books || []);
    } catch (error) {
      console.error(error);
    } finally {
      setBorrowedLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] shadow-sm p-4 sm:p-6 lg:p-8 min-h-[400px] animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-50 dark:border-[#11322f]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
            <BookOpen size={24} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Borrowed Books</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Comprehensive list of all books currently out on loan</p>
          </div>
        </div>
        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
          <span>Total Borrowed:</span>
          <span className="text-lg">{allBorrowedBooks.length}</span>
        </div>
      </div>
      
      {borrowedLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : allBorrowedBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-[#0a1f1d] rounded-3xl">
          <CheckCircle2 size={56} className="text-emerald-400 mb-4" />
          <p className="font-bold text-xl text-gray-600 dark:text-gray-300">No active borrowings</p>
          <p className="text-sm text-gray-400 mt-2">All library books are currently available on shelves.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allBorrowedBooks.map(book => (
            <div key={book._id} className="bg-white dark:bg-[#0a1f1d] rounded-2xl border border-gray-100 dark:border-[#0d2522] p-5 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start gap-2 mb-4">
                <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-xl group-hover:scale-110 transition-transform">
                  <BookOpen size={20} className="text-orange-500" />
                </div>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1.5 rounded-lg border border-orange-100 dark:border-orange-800/30 shadow-sm">
                  {calculateDays(book.issueDate)}d ago
                </span>
              </div>
              
              <div className="mb-5">
                <p className="font-bold text-base text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-brand-teal transition-colors">{book.title}</p>
                <p className="font-mono text-xs font-bold text-gray-400 mt-1.5 bg-gray-50 dark:bg-[#11322f] inline-block px-2 py-0.5 rounded-md">Book #{book.bookNumber}</p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-50 dark:border-[#11322f] space-y-2">
                <p className="text-sm font-bold text-brand-teal dark:text-brand-mint flex items-center gap-2">
                  <User size={14} />
                  {book.studentName || 'Unknown Student'}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-2">
                  <Calendar size={12} /> 
                  Issued: {new Date(book.issueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryBorrowed;
