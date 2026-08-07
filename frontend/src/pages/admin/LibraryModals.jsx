import React, { useState, useEffect, useRef } from 'react';
import { X, BookOpen, Search, User, Hash, Tag, Check, ArrowRightLeft } from 'lucide-react';
import { useStudentStore } from '../../store/studentStore';

const inputCls = "w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0d2522] border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all";
const labelCls = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

const ModalWrapper = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#11322f] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-[#0d2522] animate-in zoom-in-95 fade-in duration-200"
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
  const [formData, setFormData] = useState({ title: '', author: '', bookNumber: '', category: 'General' });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: '', author: '', bookNumber: '', category: 'General' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        title={initialData ? 'Edit Book' : 'Add New Book'}
        subtitle={initialData ? `Editing: ${initialData.title}` : 'Fill in the details to add a new book'}
        icon={BookOpen}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className={labelCls}>Book Number (ID)</label>
          <div className="relative">
            <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input required type="number" className={`${inputCls} pl-9`} value={formData.bookNumber} onChange={e => set('bookNumber', e.target.value)} placeholder="e.g. 123" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Book Title</label>
          <div className="relative">
            <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input required type="text" className={`${inputCls} pl-9`} value={formData.title} onChange={e => set('title', e.target.value)} placeholder="Enter book title" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Author</label>
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

        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#0d2522] hover:bg-gray-200 dark:hover:bg-[#0a1a18] rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-2.5 text-sm font-bold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-colors shadow-sm">
            {initialData ? 'Update Book' : 'Add Book'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// --- ISSUE BOOK MODAL ---
export const IssueBookModal = ({ isOpen, onClose, onSubmit, book }) => {
  const { students, getStudents } = useStudentStore();
  const [selectedUser, setSelectedUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) { getStudents(); setSearchQuery(''); setIsDropdownOpen(false); setSelectedUser(''); }
  }, [isOpen, getStudents]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    const user = students.find(s => s._id === selectedUser);
    onSubmit({ userId: user._id, userName: user.name, userRole: 'student' });
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.cicNumber?.toString().includes(searchQuery)
  );

  const selectedStudentObj = students.find(s => s._id === selectedUser);

  return (
    <ModalWrapper isOpen={isOpen && !!book} onClose={onClose}>
      <ModalHeader
        title="Issue Book"
        subtitle="Select a student to issue this book to"
        icon={ArrowRightLeft}
        onClose={onClose}
        iconBg="bg-brand-mint/10"
        iconColor="text-brand-teal dark:text-brand-mint"
      />

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Book Preview */}
        {book && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#0d2522] rounded-2xl border border-gray-100 dark:border-[#11322f]">
            <div className="p-2.5 bg-brand-teal/10 rounded-xl">
              <BookOpen size={18} className="text-brand-teal dark:text-brand-mint" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Book to Issue</p>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{book.title}</p>
              <p className="text-xs text-gray-400 font-mono">#{book.bookNumber}</p>
            </div>
          </div>
        )}

        {/* Student Selector */}
        <div>
          <label className={labelCls}>Select Student</label>
          <div className="relative" ref={dropdownRef}>
            {/* Trigger */}
            <div
              className={`${inputCls} cursor-pointer flex items-center justify-between gap-2 ${isDropdownOpen ? 'ring-2 ring-brand-teal' : ''}`}
              onClick={() => setIsDropdownOpen(o => !o)}
            >
              {selectedStudentObj ? (
                <span className="flex items-center gap-2 truncate">
                  <span className="w-6 h-6 rounded-lg bg-brand-teal/10 text-brand-teal dark:text-brand-mint flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {selectedStudentObj.name?.[0]?.toUpperCase()}
                  </span>
                  <span className="truncate text-sm">{selectedStudentObj.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">CIC: {selectedStudentObj.cicNumber}</span>
                </span>
              ) : (
                <span className="text-gray-400 text-sm">-- Select a student --</span>
              )}
              <span className="text-gray-400 text-xs">{isDropdownOpen ? '▲' : '▼'}</span>
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute z-20 w-full mt-2 bg-white dark:bg-[#0d2522] rounded-2xl shadow-xl border border-gray-100 dark:border-[#11322f] max-h-64 flex flex-col overflow-hidden">
                <div className="p-2 border-b border-gray-50 dark:border-[#11322f]">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search name or CIC..."
                      className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-[#11322f] rounded-xl text-xs border-0 focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-900 dark:text-white placeholder-gray-400"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onClick={e => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="overflow-y-auto">
                  {filteredStudents.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-400">No students found</div>
                  ) : filteredStudents.map(s => (
                    <button
                      key={s._id}
                      type="button"
                      className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors ${selectedUser === s._id ? 'bg-brand-teal/10 text-brand-teal dark:text-brand-mint' : 'hover:bg-gray-50 dark:hover:bg-[#11322f] text-gray-800 dark:text-gray-200'}`}
                      onClick={() => { setSelectedUser(s._id); setIsDropdownOpen(false); setSearchQuery(''); }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-[#11322f] flex items-center justify-center text-xs font-bold flex-shrink-0 text-gray-500 dark:text-gray-400">
                          {s.name?.[0]?.toUpperCase()}
                        </span>
                        <span className="truncate font-medium">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-400 font-mono">CIC: {s.cicNumber}</span>
                        {selectedUser === s._id && <Check size={14} className="text-brand-teal dark:text-brand-mint" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#0d2522] hover:bg-gray-200 dark:hover:bg-[#0a1a18] rounded-xl transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedUser}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-brand-teal hover:bg-brand-teal/90 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <ArrowRightLeft size={15} /> Issue Book
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
