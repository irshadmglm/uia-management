import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, BookOpen, Search, User, Hash, Tag, Check, ArrowRightLeft, Users } from 'lucide-react';
import { useStudentStore } from '../../store/studentStore';
import { useDebounce } from '../../hooks/useDebounce';

const inputCls = "w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0d2522] border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal transition-all";
const labelCls = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

const ModalWrapper = ({ isOpen, onClose, children, wide = false }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-[#11322f] rounded-2xl shadow-2xl w-full ${wide ? 'max-w-lg' : 'max-w-md'} overflow-hidden border border-gray-100 dark:border-[#0d2522] animate-in zoom-in-95 fade-in duration-200`}
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
