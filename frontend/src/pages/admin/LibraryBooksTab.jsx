import React, { useEffect, useState, useMemo } from 'react';
import { 
  PlusCircle, Search, Edit2, Trash2, ArrowRightLeft, 
  BookOpenCheck, Clock, BookOpen, Filter, RefreshCw,
  Hash, User, Tag, LayoutGrid, List, FileSpreadsheet,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useBooksStore } from '../../store/useBooksStore';
import ConfirmPopup from '../../components/ConfirmPopup';
import { BookFormModal, IssueBookModal } from './LibraryModals';
import LibraryBulkImportModal from './LibraryBulkImportModal';
import CustomSelect from '../../components/CustomSelect';
import { useDebounce } from '../../hooks/useDebounce';

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
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-800/30">
        <Clock size={11} />
        Borrowed · {days}d
      </span>
      {studentName && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500 pl-1">by {studentName}</span>
      )}
    </div>
  );
};

const BookCard = ({ book, onEdit, onDelete, onIssue, onReturn }) => (
  <div className="group bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
    {/* Card Top Color Strip */}
    <div className={`h-1.5 ${book.status === 'available' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-orange-400 to-amber-500'}`}></div>

    <div className="p-4 sm:p-5">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#0d2522] dark:bg-[#0a1f1d] rounded-xl">
            <BookOpen size={16} className="text-brand-mint" />
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
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/30 mb-4">
          <Tag size={9} /> {book.category}
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-[#0d2522]">
        <button
          onClick={() => onEdit(book)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-all"
        >
          <Edit2 size={13} /> Edit
        </button>
        <button
          onClick={() => onDelete(book)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
        >
          <Trash2 size={13} /> Delete
        </button>
        {book.status === 'available' ? (
          <button
            onClick={() => onIssue(book)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-brand-teal dark:text-brand-mint bg-brand-mint/10 hover:bg-brand-mint/20 rounded-lg transition-all"
          >
            <ArrowRightLeft size={13} /> Issue
          </button>
        ) : (
          <button
            onClick={() => onReturn(book)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-lg transition-all"
          >
            <ArrowRightLeft size={13} /> Return
          </button>
        )}
      </div>
    </div>
  </div>
);

const BookRow = ({ book, onEdit, onDelete, onIssue, onReturn }) => (
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
    <td className="px-4 py-3">
      <StatusBadge status={book.status} studentName={book.studentName} issueDate={book.issueDate} />
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center justify-end gap-1">
        <button onClick={() => onEdit(book)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-all" title="Edit">
          <Edit2 size={15} />
        </button>
        <button onClick={() => onDelete(book)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all" title="Delete">
          <Trash2 size={15} />
        </button>
        {book.status === 'available' ? (
          <button onClick={() => onIssue(book)} className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-brand-teal bg-brand-mint/10 hover:bg-brand-mint/20 rounded-lg transition-all ml-1">
            <ArrowRightLeft size={12} /> Issue
          </button>
        ) : (
          <button onClick={() => onReturn(book)} className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 rounded-lg transition-all ml-1">
            <ArrowRightLeft size={12} /> Return
          </button>
        )}
      </div>
    </td>
  </tr>
);

const LibraryBooksTab = () => {
  const { 
    books, categories, totalBooks, totalPages, getBooks, 
    booksLoading, deleteBook, addBook, updateBook, issueBook, 
    returnBook, bulkImportBooks, isRegistering 
  } = useBooksStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [bookToIssue, setBookToIssue] = useState(null);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
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

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [debouncedSearchTerm, selectedCategory, statusFilter]);

  const startItem = totalBooks === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalBooks);

  const handleDeleteClick = (book) => { setBookToDelete(book); setIsDeleteModalOpen(true); };
  const confirmDelete = async () => {
    if (bookToDelete) { await deleteBook(bookToDelete._id); setIsDeleteModalOpen(false); setBookToDelete(null); }
  };
  const handleAddEditSubmit = async (data) => {
    const success = bookToEdit ? await updateBook(bookToEdit._id, data) : await addBook(data);
    if (success) { setIsAddEditModalOpen(false); setBookToEdit(null); }
  };
  const handleIssueSubmit = async (data) => {
    if (bookToIssue) {
      const success = await issueBook(bookToIssue._id, data);
      if (success) { setIsIssueModalOpen(false); setBookToIssue(null); }
    }
  };
  const handleReturnClick = async (book) => {
    if (window.confirm(`Return "${book.title}"?`)) await returnBook(book._id);
  };
  const handleBulkImport = async (booksData, duplicateAction) => {
    const result = await bulkImportBooks(booksData, duplicateAction);
    return !!result;
  };

  return (
    <div className="space-y-4">
      {/* Modals */}
      <ConfirmPopup
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete "${bookToDelete?.title}"?`}
      />
      <BookFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => { setIsAddEditModalOpen(false); setBookToEdit(null); }}
        onSubmit={handleAddEditSubmit}
        initialData={bookToEdit}
      />
      <IssueBookModal
        isOpen={isIssueModalOpen}
        onClose={() => { setIsIssueModalOpen(false); setBookToIssue(null); }}
        onSubmit={handleIssueSubmit}
        book={bookToIssue}
      />
      <LibraryBulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        onImport={handleBulkImport}
        isImporting={isRegistering}
      />

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by title, author or book no..."
              className="pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#0d2522] border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal w-full text-gray-900 dark:text-white placeholder-gray-400"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <CustomSelect
              className="py-2.5 px-3 bg-gray-50 dark:bg-[#0d2522] border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-900 dark:text-white"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </CustomSelect>
            <CustomSelect
              className="py-2.5 px-3 bg-gray-50 dark:bg-[#0d2522] border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-900 dark:text-white"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Borrowed">Borrowed</option>
            </CustomSelect>

            {/* View Toggle */}
            <div className="flex bg-gray-50 dark:bg-[#0d2522] rounded-xl p-1 gap-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-[#11322f] text-brand-teal shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-[#11322f] text-brand-teal shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={16} />
              </button>
            </div>

            <button
              onClick={() => setIsBulkImportModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
              title="Bulk Import Excel / CSV Catalogue"
            >
              <FileSpreadsheet size={16} />
              <span className="hidden sm:inline">Import</span>
            </button>

            <button
              onClick={() => { setIsAddEditModalOpen(true); setBookToEdit(null); }}
              className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/90 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

      </div>

      {/* Category Chips */}
      {categories && categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-brand-teal text-white border-brand-teal shadow-md'
                : 'bg-white dark:bg-[#11322f] text-gray-600 dark:text-gray-300 border-gray-100 dark:border-[#0d2522] hover:border-brand-teal/40 hover:text-brand-teal dark:hover:text-brand-mint'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brand-teal text-white border-brand-teal shadow-md'
                  : 'bg-white dark:bg-[#11322f] text-gray-600 dark:text-gray-300 border-gray-100 dark:border-[#0d2522] hover:border-brand-teal/40 hover:text-brand-teal dark:hover:text-brand-mint'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {booksLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#11322f] rounded-2xl h-48 animate-pulse border border-gray-100 dark:border-[#0d2522]" />
          ))}
        </div>
      ) : totalBooks === 0 ? (
        <div className="bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] p-16 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-200 dark:text-gray-700" />
          <p className="font-semibold text-gray-500 dark:text-gray-400">No books found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.map(book => (
            <BookCard
              key={book._id}
              book={book}
              onEdit={b => { setBookToEdit(b); setIsAddEditModalOpen(true); }}
              onDelete={handleDeleteClick}
              onIssue={b => { setBookToIssue(b); setIsIssueModalOpen(true); }}
              onReturn={handleReturnClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-[#0d2522] border-b border-gray-100 dark:border-[#11322f]">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">No.</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Book</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#0d2522]">
                {books.map(book => (
                  <BookRow
                    key={book._id}
                    book={book}
                    onEdit={b => { setBookToEdit(b); setIsAddEditModalOpen(true); }}
                    onDelete={handleDeleteClick}
                    onIssue={b => { setBookToIssue(b); setIsIssueModalOpen(true); }}
                    onReturn={handleReturnClick}
                  />
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

export default LibraryBooksTab;
