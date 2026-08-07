import React, { useEffect, useState } from 'react';
import { 
  PlusCircle, Search, Edit2, Trash2, ArrowRightLeft, 
  BookOpenCheck, Clock, BookOpen, Filter, RefreshCw,
  Hash, User, Tag, LayoutGrid, List
} from 'lucide-react';
import { useBooksStore } from '../../store/useBooksStore';
import ConfirmPopup from '../../components/ConfirmPopup';
import { BookFormModal, IssueBookModal } from './LibraryModals';
import CustomSelect from '../../components/CustomSelect';

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
  const { books, getBooks, booksLoading, deleteBook, addBook, updateBook, issueBook, returnBook } = useBooksStore();
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

  useEffect(() => { getBooks(); }, [getBooks]);

  const categories = ['All', ...new Set(books.map(b => b.category).filter(Boolean))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = (book.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (book.author?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (book.bookNumber?.toString().includes(searchTerm));
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesStatus = statusFilter === 'All' ||
                          (statusFilter === 'Available' && book.status === 'available') ||
                          (statusFilter === 'Borrowed' && book.status !== 'available');
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
              onClick={() => { setIsAddEditModalOpen(true); setBookToEdit(null); }}
              className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/90 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Add Book</span>
            </button>
          </div>
        </div>

        {/* Result count */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing <span className="font-bold text-gray-600 dark:text-gray-300">{filteredBooks.length}</span> of {books.length} books
          </p>
          <button onClick={() => getBooks()} className="text-xs text-gray-400 hover:text-brand-teal flex items-center gap-1 transition-colors">
            <RefreshCw size={12} className={booksLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      {booksLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#11322f] rounded-2xl h-48 animate-pulse border border-gray-100 dark:border-[#0d2522]" />
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] p-16 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-200 dark:text-gray-700" />
          <p className="font-semibold text-gray-500 dark:text-gray-400">No books found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredBooks.map(book => (
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
                {filteredBooks.map(book => (
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
    </div>
  );
};

export default LibraryBooksTab;
