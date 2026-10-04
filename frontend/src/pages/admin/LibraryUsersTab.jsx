import React, { useEffect, useState } from 'react';
import { Search, BookOpen, Clock, CheckCircle2, Users, ChevronRight, Calendar, User, RotateCcw, BookMarked } from 'lucide-react';
import { useStudentStore } from '../../store/studentStore';
import { useBooksStore } from '../../store/useBooksStore';
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

const LibraryUsersTab = () => {
  const { students, getStudents, isLoading: studentsLoading } = useStudentStore();
  const { getUserHistory, history } = useBooksStore();
  
  const [activeSubTab, setActiveSubTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  const [allBorrowedBooks, setAllBorrowedBooks] = useState([]);
  const [borrowedLoading, setBorrowedLoading] = useState(false);

  useEffect(() => { getStudents(); }, [getStudents]);

  useEffect(() => {
    if (activeSubTab === 'borrowed') {
      fetchBorrowedBooks();
    }
  }, [activeSubTab]);

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

  const handleUserSelect = async (user) => {
    if (selectedUser?._id === user._id) { setSelectedUser(null); return; }
    setSelectedUser(user);
    setHistoryLoading(true);
    await getUserHistory(user._id);
    setHistoryLoading(false);
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cicNumber?.toString().includes(searchTerm)
  );

  const activeBooks = history.filter(h => h.status === 'active');
  const pastBooks = history.filter(h => h.status === 'returned');

  return (
    <div className="space-y-4">
      {/* Subtabs Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSubTab('students')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'students'
              ? 'bg-brand-teal text-white shadow-md'
              : 'bg-white dark:bg-[#11322f] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-100 dark:border-[#0d2522]'
          }`}
        >
          <Users size={16} /> Students
        </button>
        <button
          onClick={() => setActiveSubTab('borrowed')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'borrowed'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white dark:bg-[#11322f] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-100 dark:border-[#0d2522]'
          }`}
        >
          <BookMarked size={16} /> All Borrowed Books
        </button>
      </div>

      {activeSubTab === 'students' ? (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* === USERS LIST PANEL === */}
          <div className="w-full lg:w-80 flex-shrink-0 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm overflow-hidden flex flex-col">
            
            {/* Search */}
            <div className="p-4 border-b border-gray-50 dark:border-[#0d2522]">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-brand-teal" />
                <h2 className="font-bold text-sm text-gray-800 dark:text-white">Students</h2>
                <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-50 dark:bg-[#0d2522] px-2 py-0.5 rounded-full">{filteredStudents.length}</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search name or CIC..."
                  className="pl-8 pr-4 py-2 bg-gray-50 dark:bg-[#0d2522] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal w-full text-gray-900 dark:text-white placeholder-gray-400 border-0"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-[#0d2522] max-h-[400px] lg:max-h-[600px]">
              {studentsLoading ? (
                <div className="p-4 space-y-2">
                  {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">No students found</div>
              ) : (
                filteredStudents.map(student => {
                  const isSelected = selectedUser?._id === student._id;
                  return (
                    <button
                      key={student._id}
                      onClick={() => handleUserSelect(student)}
                      className={`w-full text-left px-4 py-3 transition-all flex items-center gap-3 group ${
                        isSelected
                          ? 'bg-brand-teal/5 dark:bg-brand-teal/10'
                          : 'hover:bg-gray-50 dark:hover:bg-[#0d2522]/60'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-brand-teal text-white'
                          : 'bg-gray-100 dark:bg-[#0d2522] text-gray-500 dark:text-gray-400'
                      }`}>
                        {student.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-brand-teal dark:text-brand-mint' : 'text-gray-800 dark:text-gray-200'}`}>
                          {student.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">CIC: {student.cicNumber} · {student.batchName}</p>
                      </div>
                      <ChevronRight size={14} className={`flex-shrink-0 transition-all ${isSelected ? 'text-brand-teal rotate-90' : 'text-gray-300 dark:text-gray-600 group-hover:text-gray-400'}`} />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* === DETAILS PANEL === */}
          <div className="flex-1 min-w-0">
            {!selectedUser ? (
              <div className="h-full min-h-[300px] bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm flex flex-col items-center justify-center p-10 text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-[#0d2522] rounded-3xl flex items-center justify-center mb-4">
                  <Users size={36} className="text-gray-200 dark:text-gray-700" />
                </div>
                <p className="font-bold text-gray-500 dark:text-gray-400">Select a student</p>
                <p className="text-sm text-gray-400 mt-1 max-w-xs">Choose a student from the left panel to view their currently borrowed books and borrowing history</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm overflow-hidden">
                
                {/* User Header */}
                <div className="relative bg-gradient-to-r from-[#0d2522] to-[#11322f] p-5 sm:p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 to-transparent"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-mint/20 border border-brand-mint/30 flex items-center justify-center text-brand-mint font-black text-2xl">
                      {selectedUser.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{selectedUser.name}</h2>
                      <p className="text-xs text-white/50 mt-0.5">CIC: {selectedUser.cicNumber} · {selectedUser.batchName}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-2xl font-black text-brand-mint">{activeBooks.length}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Active Loans</div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-6">
                  {historyLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                  ) : (
                    <>
                      {/* Currently Borrowed */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <BookOpen size={15} className="text-orange-500" />
                          </div>
                          <h3 className="font-bold text-sm text-gray-800 dark:text-white">Currently Borrowed</h3>
                          <span className="ml-auto text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">{activeBooks.length}</span>
                        </div>
                        {activeBooks.length === 0 ? (
                          <div className="text-center py-6 bg-gray-50 dark:bg-[#0d2522] rounded-2xl">
                            <CheckCircle2 size={28} className="mx-auto mb-2 text-emerald-400" />
                            <p className="text-xs text-gray-400">No books currently borrowed</p>
                          </div>
                        ) : (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {activeBooks.map(item => (
                              <div key={item._id} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-[#0d2522] border border-orange-100 dark:border-orange-900/20 rounded-2xl">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex-shrink-0">
                                  <BookOpen size={16} className="text-orange-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{item.bookTitle}</p>
                                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                    <Calendar size={9} /> {new Date(item.issueDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex-shrink-0">
                                  <span className="text-[10px] font-bold text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
                                    {calculateDays(item.issueDate)}d
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Borrowing History */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-gray-100 dark:bg-[#0d2522] rounded-lg">
                            <RotateCcw size={15} className="text-gray-500 dark:text-gray-400" />
                          </div>
                          <h3 className="font-bold text-sm text-gray-800 dark:text-white">Borrowing History</h3>
                          <span className="ml-auto text-xs font-bold text-gray-500 bg-gray-100 dark:bg-[#0d2522] px-2 py-0.5 rounded-full">{pastBooks.length}</span>
                        </div>
                        {pastBooks.length === 0 ? (
                          <div className="text-center py-6 bg-gray-50 dark:bg-[#0d2522] rounded-2xl">
                            <p className="text-xs text-gray-400">No borrowing history</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {pastBooks.map(item => (
                              <div key={item._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-[#0d2522] rounded-2xl transition-colors group">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle2 size={16} className="text-emerald-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-xs text-gray-800 dark:text-gray-200 truncate">{item.bookTitle}</p>
                                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                    <RotateCcw size={9} /> Returned: {new Date(item.returnDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">Returned</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* === ALL BORROWED BOOKS PANEL === */
        <div className="bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm p-4 sm:p-6 min-h-[400px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <BookOpen size={20} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Borrowed Books</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Books currently borrowed by students</p>
            </div>
            <div className="ml-auto bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-bold">
              {allBorrowedBooks.length} Books
            </div>
          </div>
          
          {borrowedLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : allBorrowedBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <CheckCircle2 size={48} className="text-emerald-400 mb-4" />
              <p className="font-bold text-gray-600 dark:text-gray-300">No active borrowings</p>
              <p className="text-sm text-gray-400 mt-1">All library books are currently available.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allBorrowedBooks.map(book => (
                <div key={book._id} className="bg-white dark:bg-[#0a1f1d] rounded-2xl border border-gray-100 dark:border-[#0d2522] p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl group-hover:scale-110 transition-transform">
                      <BookOpen size={16} className="text-orange-500" />
                    </div>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg border border-orange-100 dark:border-orange-800/30">
                      {calculateDays(book.issueDate)}d ago
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 leading-tight">{book.title}</p>
                    <p className="font-mono text-[10px] text-gray-400 mt-1">Book #{book.bookNumber}</p>
                  </div>
                  
                  <div className="mt-auto pt-3 border-t border-gray-50 dark:border-[#11322f] space-y-1.5">
                    <p className="text-xs font-semibold text-brand-teal dark:text-brand-mint flex items-center gap-1.5">
                      <User size={12} />
                      {book.studentName || 'Unknown Student'}
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                      <Calendar size={10} /> 
                      Issued: {new Date(book.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryUsersTab;
