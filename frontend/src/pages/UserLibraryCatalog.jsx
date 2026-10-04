import React, { useEffect, useState } from 'react';
import { 
  Search, BookOpen, Clock, Filter, User, Tag, LayoutGrid, List, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useBooksStore } from '../store/useBooksStore';
import CustomSelect from '../components/CustomSelect';
import { useDebounce } from '../hooks/useDebounce';

const StatusBadge = ({ status, studentName, issueDate }) => {
  const days = issueDate
    ? Math.floor((new Date() - new Date(issueDate)) / (1000 * 86400))
    : 0;

  if (status === 'available') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Available
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-1 items-end">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-800/30">
        <Clock size={11} />
        Borrowed
      </span>
    </div>
  );
};

const BookCard = ({ book }) => (
  <div className="group bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
    {/* Card Top Color Strip */}
    <div className={`h-1.5 ${book.status === 'available' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-orange-400 to-amber-500'}`}></div>

    <div className="p-4 sm:p-5">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${book.status === 'available' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
            <BookOpen size={16} className={book.status === 'available' ? 'text-emerald-500' : 'text-orange-500'} />
          </div>
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 font-mono">#{book.bookNumber}</span>
        </div>
        <StatusBadge status={book.status} studentName={book.studentName} issueDate={book.issueDate} />
      </div>

      {/* Book Info */}
      <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-1 group-hover:text-brand-teal transition-colors line-clamp-2">
        {book.title}
      </h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-3">
        <User size={11} /> {book.author}
      </p>

      {book.category && (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/30">
          <Tag size={9} /> {book.category}
        </span>
      )}
    </div>
  </div>
);

const BookRow = ({ book }) => (
  <tr className="group hover:bg-gray-50 dark:hover:bg-[#11322f]/80 transition-colors">
    <td className="px-4 py-3">
      <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#0d2522] px-2 py-1 rounded-lg">#{book.bookNumber}</span>
    </td>
    <td className="px-4 py-3">
      <p className="font-semibold text-sm text-gray-900 dark:text-white">{book.title}</p>
      <p className="text-xs text-gray-400">{book.author}</p>
    </td>
    <td className="px-4 py-3 hidden sm:table-cell">
      {book.category && (
        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/30">
          {book.category}
        </span>
      )}
    </td>
    <td className="px-4 py-3 text-right">
      <StatusBadge status={book.status} studentName={book.studentName} issueDate={book.issueDate} />
    </td>
  </tr>
);

const UserLibraryCatalog = () => {
  const { 
    books, categories, totalBooks, totalPages, getBooks, booksLoading
  } = useBooksStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    getBooks({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm,
      category: selectedCategory,
      status: statusFilter
    });
  }, [currentPage, debouncedSearchTerm, selectedCategory, statusFilter, getBooks]);

  useEffect(() => { 
    setCurrentPage(1); 
  }, [debouncedSearchTerm, selectedCategory, statusFilter]);

  const startItem = totalBooks === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalBooks);

  return (
    <div className="space-y-4 animate-fadeIn max-w-7xl mx-auto">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-teal/10 rounded-2xl">
          <BookOpen size={24} className="text-brand-teal" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Library Catalog</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Search and discover books available in our library</p>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] p-4 sm:p-5 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title, author or book number..."
              className="pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0a1f1d] border-0 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal w-full text-gray-900 dark:text-white placeholder-gray-400 transition-shadow"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
            <CustomSelect
              className="py-3 px-4 bg-gray-50 dark:bg-[#0a1f1d] border-0 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-900 dark:text-white shrink-0 shadow-sm"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </CustomSelect>
            <CustomSelect
              className="py-3 px-4 bg-gray-50 dark:bg-[#0a1f1d] border-0 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-900 dark:text-white shrink-0 shadow-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Borrowed">Borrowed</option>
            </CustomSelect>

            {/* View Toggle */}
            <div className="flex bg-gray-50 dark:bg-[#0a1f1d] rounded-2xl p-1 gap-1 shrink-0 shadow-sm border border-gray-100 dark:border-[#0d2522]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-[#11322f] text-brand-teal shadow' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-[#11322f] text-brand-teal shadow' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Chips */}
      {categories && categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-brand-teal text-white border-brand-teal shadow-md shadow-brand-teal/20'
                : 'bg-white dark:bg-[#11322f] text-gray-600 dark:text-gray-300 border-gray-100 dark:border-[#0d2522] hover:border-brand-teal/40 hover:text-brand-teal dark:hover:text-brand-mint shadow-sm'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => {
            if (cat === 'All') return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-brand-teal text-white border-brand-teal shadow-md shadow-brand-teal/20'
                    : 'bg-white dark:bg-[#11322f] text-gray-600 dark:text-gray-300 border-gray-100 dark:border-[#0d2522] hover:border-brand-teal/40 hover:text-brand-teal dark:hover:text-brand-mint shadow-sm'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      )}

      {/* Content */}
      {booksLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#11322f] rounded-3xl h-48 animate-pulse border border-gray-100 dark:border-[#0d2522] shadow-sm" />
          ))}
        </div>
      ) : totalBooks === 0 ? (
        <div className="bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] p-16 sm:p-24 text-center shadow-sm">
          <BookOpen size={56} className="mx-auto mb-4 text-gray-200 dark:text-gray-700" />
          <p className="font-bold text-lg text-gray-500 dark:text-gray-400">No books found</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your search or category filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {books.map(book => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-[#0a1f1d] border-b border-gray-100 dark:border-[#11322f]">
                <tr>
                  <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">No.</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Book</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#0d2522]">
                {books.map(book => (
                  <BookRow key={book._id} book={book} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!booksLoading && totalBooks > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#11322f] px-5 py-3 rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-white">{startItem}–{endItem}</span> of <span className="font-bold text-gray-900 dark:text-white">{totalBooks}</span> books
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-gray-100 dark:border-[#0d2522] text-gray-500 hover:bg-gray-50 dark:hover:bg-[#0a1f1d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              if (totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                      currentPage === page
                        ? 'bg-brand-teal text-white shadow-md'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#0a1f1d] border border-gray-100 dark:border-[#0d2522]'
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="text-gray-400 px-1">…</span>;
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-gray-100 dark:border-[#0d2522] text-gray-500 hover:bg-gray-50 dark:hover:bg-[#0a1f1d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLibraryCatalog;
