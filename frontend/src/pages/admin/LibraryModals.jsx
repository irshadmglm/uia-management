import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, BookOpen, Search, User, Hash, Tag, Check, ArrowRightLeft, Users, RefreshCw, 
  Clock, ChevronDown, Calendar, Layers, Globe, DollarSign, Bookmark, FileText, AlertCircle 
} from 'lucide-react';
import { useStudentStore } from '../../store/studentStore';
import { useBooksStore } from '../../store/useBooksStore';
import { useDebounce } from '../../hooks/useDebounce';

const inputCls = "w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0d2522] border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all";
const labelCls = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

const ModalWrapper = ({ isOpen, onClose, children, wide = false, maxWidth = '' }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-[#11322f] rounded-2xl shadow-2xl w-full ${maxWidth ? maxWidth : (wide ? 'max-w-lg' : 'max-w-md')} max-h-[90vh] overflow-y-auto overflow-x-hidden border border-gray-100 dark:border-[#0d2522] animate-in zoom-in-95 fade-in duration-200`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const ModalHeader = ({ title, subtitle, icon: Icon, onClose, iconBg = 'bg-brand-teal/10', iconColor = 'text-brand-teal dark:text-brand-mint' }) => (
  <div className="relative p-5 border-b border-gray-50 dark:border-[#0d2522] flex items-center gap-3">
    <div className={`p-2.5 rounded-xl ${iconBg}`}>
      <Icon size={20} className={iconColor} />
    </div>
    <div>
      <h2 className="font-bold text-gray-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    <button
      onClick={onClose}
      className="ml-auto p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#0d2522] rounded-xl transition-all"
    >
      <X size={18} />
    </button>
  </div>
);

// --- BOOK FORM MODAL (Add / Edit) ---
export const BookFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({ 
    title: '', author: '', bookNumber: '', category: 'General', section: '',
    callNumber: '', publisher: '', volume: '', price: '', remarks: '',
    bookType: 'General', language: 'English'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        section: initialData.section || '',
        callNumber: initialData.callNumber || '',
        publisher: initialData.publisher || '',
        volume: initialData.volume || '',
        price: initialData.price || '',
        remarks: initialData.remarks || '',
        bookType: initialData.bookType || 'General',
        language: initialData.language || 'English',
      });
    } else {
      setFormData({ 
        title: '', author: '', bookNumber: '', category: 'General', section: '',
        callNumber: '', publisher: '', volume: '', price: '', remarks: '',
        bookType: 'General', language: 'English'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <ModalHeader
        title={initialData ? 'Edit Book' : 'Add New Book'}
        subtitle={initialData ? `Editing: ${initialData.title}` : 'Fill in the details to add a new book'}
        icon={BookOpen}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Book Number (ID) <span className="text-red-500">*</span></label>
            <div className="relative">
              <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input required type="number" className={`${inputCls} pl-9`} value={formData.bookNumber} onChange={e => set('bookNumber', e.target.value)} placeholder="e.g. 123" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Call Number</label>
            <div className="relative">
              <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" className={`${inputCls} pl-9`} value={formData.callNumber} onChange={e => set('callNumber', e.target.value)} placeholder="e.g. QA76.73.J38" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Book Title <span className="text-red-500">*</span></label>
            <div className="relative">
              <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input required type="text" className={`${inputCls} pl-9`} value={formData.title} onChange={e => set('title', e.target.value)} placeholder="Enter book title" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Author <span className="text-red-500">*</span></label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input required type="text" className={`${inputCls} pl-9`} value={formData.author} onChange={e => set('author', e.target.value)} placeholder="Author name" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <div className="relative">
              <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input required type="text" className={`${inputCls} pl-9`} value={formData.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Science, Fiction" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Section <span className="text-gray-400 font-normal lowercase">(optional)</span></label>
            <div className="relative">
              <Layers size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" className={`${inputCls} pl-9`} value={formData.section} onChange={e => set('section', e.target.value)} placeholder="e.g. Arabic, General, Shelf A" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Publisher</label>
            <div className="relative">
              <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" className={`${inputCls} pl-9`} value={formData.publisher} onChange={e => set('publisher', e.target.value)} placeholder="Publisher name" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Volume</label>
            <div className="relative">
              <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" className={`${inputCls} pl-9`} value={formData.volume} onChange={e => set('volume', e.target.value)} placeholder="e.g. Vol 1" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Book Type</label>
            <div className="relative">
              <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                className={`${inputCls} pl-9 pr-9 cursor-pointer appearance-none bg-gray-50 dark:bg-[#0d2522] text-gray-900 dark:text-white`}
                value={formData.bookType || 'General'}
                onChange={e => set('bookType', e.target.value)}
              >
                <option value="General">General</option>
                <option value="Reference">Reference</option>
                {formData.bookType && formData.bookType !== "General" && formData.bookType !== "Reference" && (
                  <option value={formData.bookType}>{formData.bookType}</option>
                )}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
          <div>
            <label className={labelCls}>Language</label>
            <div className="relative">
              <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" className={`${inputCls} pl-9`} value={formData.language} onChange={e => set('language', e.target.value)} placeholder="e.g. English, Arabic" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
              <input type="number" min="0" step="0.01" className={`${inputCls} pl-8`} value={formData.price} onChange={e => set('price', e.target.value)} placeholder="0.00" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Remarks</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              value={formData.remarks}
              onChange={e => set('remarks', e.target.value)}
              placeholder="Any additional notes or remarks about this book..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-50 dark:border-[#0d2522]">
          <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#0d2522] hover:bg-gray-200 dark:hover:bg-[#0a1a18] rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 text-sm font-bold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors shadow-sm">
            {initialData ? 'Update Book' : 'Add Book'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// --- ISSUE BOOK MODAL (Redesigned) ---
export const IssueBookModal = ({ isOpen, onClose, onSubmit, book }) => {
  const { students, getStudents } = useStudentStore();
  const [selectedUser, setSelectedUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) { getStudents(); setSearchQuery(''); setSelectedUser(''); }
  }, [isOpen, getStudents]);

  const handleSubmit = () => {
    if (!selectedUser) return;
    const user = students.find(s => s._id === selectedUser);
    onSubmit({ userId: user._id, userName: user.name, userRole: 'student' });
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredStudents = useMemo(() => {
    if (!debouncedSearchQuery) return students;
    const lowerQuery = debouncedSearchQuery.toLowerCase();
    return students.filter(s =>
      s.name?.toLowerCase().includes(lowerQuery) ||
      s.cicNumber?.toString().includes(lowerQuery)
    );
  }, [students, debouncedSearchQuery]);

  const selectedStudentObj = students.find(s => s._id === selectedUser);

  return (
    <ModalWrapper isOpen={isOpen && !!book} onClose={onClose} wide>
      <ModalHeader
        title="Issue Book"
        subtitle="Search and select a student below"
        icon={ArrowRightLeft}
        onClose={onClose}
        iconBg="bg-brand-mint/10"
        iconColor="text-brand-teal dark:text-brand-mint"
      />

      <div className="p-5 space-y-4">
        {/* Book Preview */}
        {book && (
          <div className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-[#0d2522] rounded-2xl border border-gray-100 dark:border-[#11322f]">
            <div className="p-2.5 bg-brand-teal/10 rounded-xl shrink-0">
              <BookOpen size={18} className="text-brand-teal dark:text-brand-mint" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Issuing Book</p>
              <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{book.title}</p>
              <p className="text-xs text-gray-400 font-mono">Book #{book.bookNumber}</p>
            </div>
          </div>
        )}

        {/* Selected Student Banner */}
        {selectedStudentObj && (
          <div className="flex items-center gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
            <div className="w-9 h-9 rounded-xl bg-brand-teal text-white flex items-center justify-center text-sm font-bold shrink-0">
              {selectedStudentObj.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Selected Student</p>
              <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{selectedStudentObj.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">CIC: {selectedStudentObj.cicNumber} · {selectedStudentObj.batchName}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedUser('')}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Search + Inline Student List */}
        <div>
          <label className={labelCls}>
            <span className="flex items-center gap-1.5"><Users size={11} /> Select Student</span>
          </label>

          {/* Search */}
          <div className="relative mb-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or CIC number..."
              className={`${inputCls} pl-9`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Inline scrollable list — no dropdown overlap */}
          <div className="h-52 overflow-y-auto rounded-xl border border-gray-100 dark:border-[#0d2522] bg-gray-50 dark:bg-[#0a1f1d]">
            {filteredStudents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <User size={28} className="text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-400">No students found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-[#11322f]">
                {filteredStudents.map(s => {
                  const isSelected = selectedUser === s._id;
                  return (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => setSelectedUser(s._id)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
                        isSelected ? 'bg-brand-teal/10 dark:bg-brand-teal/20' : 'hover:bg-white dark:hover:bg-[#11322f]'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                        isSelected ? 'bg-brand-teal text-white' : 'bg-gray-200 dark:bg-[#11322f] text-gray-600 dark:text-gray-400'
                      }`}>
                        {s.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isSelected ? 'text-brand-teal dark:text-brand-mint' : 'text-gray-800 dark:text-gray-200'}`}>
                          {s.name}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono">CIC: {s.cicNumber} · {s.batchName}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-brand-teal flex items-center justify-center shrink-0">
                          <Check size={11} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5 pl-1">{filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#0d2522] hover:bg-gray-200 dark:hover:bg-[#0a1a18] rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedUser}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-brand-teal hover:bg-brand-teal/90 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <ArrowRightLeft size={15} /> Issue Book
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export const ReturnBookModal = ({ isOpen, onClose, onSubmit, book }) => {
  const [remarks, setRemarks] = useState('');

  // Calculate days borrowed
  const daysBorrowed = book?.issueDate 
    ? Math.floor((new Date() - new Date(book.issueDate)) / (1000 * 60 * 60 * 24))
    : 0;

  useEffect(() => {
    if (isOpen) setRemarks('');
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit({ remarks });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Return Book">
      {book && (
        <div className="p-5 space-y-5">
          {/* Book Info */}
          <div className="p-4 bg-gray-50 dark:bg-[#0a1f1d] rounded-2xl border border-gray-100 dark:border-[#11322f] flex gap-4 items-start">
            <div className="w-12 h-14 bg-white dark:bg-[#11322f] rounded-lg shadow-sm border border-gray-100 dark:border-[#0d2522] flex items-center justify-center shrink-0">
              <BookOpen size={20} className="text-brand-teal" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 mb-0.5">#{book.bookNumber}</p>
              <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{book.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{book.author}</p>
            </div>
          </div>

          {/* Borrow Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Borrowed By</h4>
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#11322f] border border-gray-100 dark:border-[#0d2522] rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center">
                <User size={18} className="text-brand-teal" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{book.studentName || 'Unknown Student'}</p>
                <p className="text-xs text-gray-500">Borrowed {daysBorrowed} day{daysBorrowed !== 1 ? 's' : ''} ago</p>
              </div>
            </div>
          </div>

          {/* Remarks Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1">
              Remarks (Optional)
            </label>
            <textarea
              placeholder="E.g., Returned in good condition, damaged pages, etc."
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0a1f1d] border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-900 dark:text-white placeholder-gray-400 resize-none"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#0d2522] hover:bg-gray-200 dark:hover:bg-[#0a1a18] rounded-xl transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 text-sm font-bold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <ArrowRightLeft size={16} /> Confirm Return
            </button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};

export const BookDetailsModal = ({ isOpen, onClose, book, getBookHistory }) => {
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'history'
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && book?._id) {
      setActiveTab('details');
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
          const fetcher = getBookHistory || useBooksStore.getState().getBookHistory;
          const data = await fetcher(book._id);
          setHistory(data || []);
        } catch (err) {
          console.error("Failed to load history", err);
          setHistory([]);
        } finally {
          setIsLoadingHistory(false);
        }
      };
      fetchHistory();
    } else if (!isOpen) {
      setHistory([]);
    }
  }, [isOpen, book?._id, getBookHistory]);

  if (!book) return null;

  // Resolve active loan / borrower info
  const activeTx = history.find(t => t.status === 'active');
  const isBorrowed = book.status !== 'available' || !!book.studentName || !!activeTx;
  const borrowerName = book.studentName || activeTx?.userName || (book.status !== 'available' ? (book.borrowedBy || 'Unknown Student') : null);
  const borrowerId = book.borrowedBy || activeTx?.userId;
  const issueDate = book.issueDate || activeTx?.issueDate;
  const dueDate = book.dueDate || activeTx?.dueDate;
  const loanDays = issueDate
    ? Math.floor((new Date() - new Date(issueDate)) / (1000 * 86400))
    : 0;
  const isOverdue = dueDate && new Date(dueDate) < new Date();

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <ModalHeader
        title={`Book #${book.bookNumber}`}
        subtitle={book.title}
        icon={BookOpen}
        onClose={onClose}
      />
      <div className="flex flex-col max-h-[78vh]">
        {/* Tabs Header */}
        <div className="flex border-b border-gray-100 dark:border-[#11322f] px-5 bg-gray-50/50 dark:bg-[#0d2522]/50">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-bold border-b-2 uppercase tracking-wider transition-all ${
              activeTab === 'details' 
                ? 'border-brand-teal text-brand-teal dark:text-brand-mint' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            All Book Details
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-bold border-b-2 uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'history' 
                ? 'border-brand-teal text-brand-teal dark:text-brand-mint' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <span>Borrowing History</span>
            {history.length > 0 && (
              <span className="px-2 py-0.5 bg-brand-teal/10 text-brand-teal dark:text-brand-mint text-[11px] rounded-full font-bold">
                {history.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'details' ? (
            <>
              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-brand-teal/5 to-transparent dark:from-[#0a1f1d] p-4 sm:p-5 rounded-2xl border border-brand-teal/10 dark:border-[#11322f]">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 dark:bg-brand-teal/20 flex items-center justify-center shrink-0 border border-brand-teal/20">
                    <BookOpen size={28} className="text-brand-teal dark:text-brand-mint" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#11322f] px-2.5 py-0.5 rounded-lg border border-gray-200 dark:border-[#0d2522] shadow-xs">
                        #{book.bookNumber}
                      </span>
                      {book.category && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg border border-blue-100 dark:border-blue-800/40">
                          <Tag size={10} /> {book.category}
                        </span>
                      )}
                      {book.section && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold text-teal-800 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-300 rounded-lg border border-teal-200 dark:border-teal-800/40">
                          <Layers size={10} /> {book.section}
                        </span>
                      )}
                      {book.bookType && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold text-amber-800 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800/40">
                          <Bookmark size={10} /> {book.bookType}
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-lg border ${
                        !isBorrowed
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40' 
                          : 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/40'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${!isBorrowed ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`}></span>
                        {!isBorrowed ? 'Available' : 'Borrowed'}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1.5 font-medium">
                      <User size={13} className="text-gray-400" /> By {book.author}
                    </p>
                  </div>
                </div>
              </div>

              {/* Borrower or Availability Status Card */}
              {isBorrowed ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-orange-200 dark:border-orange-500/30 shadow-xs">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-xs">
                        <User size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-wider text-orange-600 dark:text-orange-400 block">
                          Currently Borrowed By
                        </span>
                        <h4 className="text-base font-black text-gray-900 dark:text-white leading-tight">
                          {borrowerName || 'Student'}
                        </h4>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/40">
                      <Clock size={12} /> Active Loan
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-orange-200/60 dark:border-orange-900/50 text-xs">
                    {borrowerId && (
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Student ID / Reg</p>
                        <p className="font-mono font-bold text-gray-800 dark:text-gray-200 mt-0.5">#{borrowerId}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Issued On</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                        {issueDate ? new Date(issueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Days on Loan</p>
                      <p className="font-bold text-orange-600 dark:text-orange-400 mt-0.5">
                        {loanDays} day{loanDays !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Due Date</p>
                      <p className={`font-semibold mt-0.5 ${isOverdue ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-800 dark:text-gray-200'}`}>
                        {dueDate ? new Date(dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'No due date'}
                        {isOverdue && ' (Overdue)'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Check size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Available in Library</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">This book is on the library shelf and ready to be issued</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    On Shelf
                  </span>
                </div>
              )}

              {/* Complete Specifications Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2.5">
                  Book Specifications & Metadata
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  
                  {/* Category - Prominently Displayed */}
                  <div className="p-3 bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1">
                      <Tag size={13} className="text-brand-teal" />
                      <p className="text-[10px] uppercase font-bold tracking-wider">Category</p>
                    </div>
                    <p className="text-xs font-black text-brand-teal dark:text-brand-mint">
                      {book.category || 'General'}
                    </p>
                  </div>

                  {/* Section (Optional) */}
                  <div className="p-3 bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1">
                      <Layers size={13} className="text-brand-teal" />
                      <p className="text-[10px] uppercase font-bold tracking-wider">Section</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {book.section || 'N/A'}
                    </p>
                  </div>

                  {/* Call Number */}
                  <div className="p-3 bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1">
                      <Hash size={13} />
                      <p className="text-[10px] uppercase font-bold tracking-wider">Call Number</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white font-mono break-words">
                      {book.callNumber || 'N/A'}
                    </p>
                  </div>

                  {/* Book Type */}
                  <div className="p-3 bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1">
                      <Bookmark size={13} />
                      <p className="text-[10px] uppercase font-bold tracking-wider">Book Type</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {book.bookType || 'General'}
                    </p>
                  </div>

                  {/* Language */}
                  <div className="p-3 bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1">
                      <Globe size={13} />
                      <p className="text-[10px] uppercase font-bold tracking-wider">Language</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {book.language || 'English'}
                    </p>
                  </div>

                  {/* Publisher */}
                  <div className="p-3 bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] rounded-xl shadow-xs col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1">
                      <BookOpen size={13} />
                      <p className="text-[10px] uppercase font-bold tracking-wider">Publisher</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white break-words">
                      {book.publisher || 'N/A'}
                    </p>
                  </div>

                  {/* Volume / Edition */}
                  <div className="p-3 bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1">
                      <Layers size={13} />
                      <p className="text-[10px] uppercase font-bold tracking-wider">Volume / Ed.</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {book.volume || 'Standard'}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="p-3 bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1">
                      <DollarSign size={13} />
                      <p className="text-[10px] uppercase font-bold tracking-wider">Price / Value</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {book.price ? `₹${book.price}` : 'N/A'}
                    </p>
                  </div>

                  {/* Date Added */}
                  <div className="p-3 bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1">
                      <Calendar size={13} />
                      <p className="text-[10px] uppercase font-bold tracking-wider">Date Added</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {book.createdAt ? new Date(book.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </p>
                  </div>

                  {/* Last Modified */}
                  <div className="p-3 bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] rounded-xl shadow-xs">
                    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 mb-1">
                      <Clock size={13} />
                      <p className="text-[10px] uppercase font-bold tracking-wider">Last Updated</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {book.updatedAt ? new Date(book.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Remarks if present */}
              {book.remarks && (
                <div className="p-3.5 bg-gray-50 dark:bg-[#0a1f1d] rounded-xl border border-gray-100 dark:border-[#11322f]">
                  <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                    <FileText size={13} />
                    <p className="text-[10px] uppercase font-bold tracking-wider">Remarks / Notes</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{book.remarks}</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                  <RefreshCw size={22} className="animate-spin text-brand-teal" />
                  <p className="text-xs font-semibold">Loading borrowing history...</p>
                </div>
              ) : history.length === 0 ? (
                isBorrowed && borrowerName ? (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/70 dark:border-orange-900/40">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{borrowerName}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300">
                          Currently Borrowed
                        </span>
                      </div>
                      {borrowerId && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mb-1">ID: #{borrowerId}</p>
                      )}
                      {issueDate && (
                        <p className="text-xs text-gray-500 mb-1">
                          Issued on: {new Date(issueDate).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                        {loanDays} day{loanDays !== 1 ? 's' : ''} on loan
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                    <Clock size={28} className="opacity-40" />
                    <p className="text-xs font-semibold">No borrowing history recorded for this book.</p>
                  </div>
                )
              ) : (
                <div className="relative border-l-2 border-brand-teal/30 ml-3 pl-4 space-y-4">
                  {history.map((tx) => {
                    const days = tx.returnDate
                      ? Math.floor((new Date(tx.returnDate) - new Date(tx.issueDate)) / (1000 * 86400))
                      : Math.floor((new Date() - new Date(tx.issueDate)) / (1000 * 86400));
                    
                    return (
                      <div key={tx._id} className="relative">
                        <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full ${tx.status === 'active' ? 'bg-orange-500' : 'bg-brand-teal'}`}></div>
                        <div className="bg-white dark:bg-[#0d2522] p-3.5 rounded-xl border border-gray-100 dark:border-[#11322f] shadow-xs">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">{tx.userName}</p>
                              {tx.userId && (
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">ID: #{tx.userId}</p>
                              )}
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${tx.status === 'active' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-gray-100 text-gray-500 dark:bg-[#0a1f1d] dark:text-gray-400'}`}>
                              {tx.status === 'active' ? 'Active Loan' : 'Returned'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 my-1">
                            {new Date(tx.issueDate).toLocaleDateString()} {tx.returnDate && ` → ${new Date(tx.returnDate).toLocaleDateString()}`}
                          </p>
                          <p className="text-xs font-semibold text-brand-teal dark:text-brand-mint">
                            {days} day{days !== 1 ? 's' : ''} total
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};
