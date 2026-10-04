import React, { useEffect, useState } from 'react';
import { Search, BookOpen, CheckCircle2, Users, ChevronRight, Calendar, RotateCcw } from 'lucide-react';
import { useStudentStore } from '../../store/studentStore';
import { useBooksStore } from '../../store/useBooksStore';

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

const LibraryStudents = () => {
  const { students, getStudents, isLoading: studentsLoading } = useStudentStore();
  const { getUserHistory, history } = useBooksStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => { getStudents(); }, [getStudents]);

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
    <div className="flex flex-col lg:flex-row gap-4 h-full animate-fadeIn">
      {/* === USERS LIST PANEL === */}
      <div className="w-full lg:w-80 flex-shrink-0 bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] shadow-sm overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
        
        {/* Search */}
        <div className="p-5 border-b border-gray-50 dark:border-[#0d2522]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-teal/10 rounded-xl">
              <Users size={20} className="text-brand-teal" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">Students</h2>
              <p className="text-xs text-gray-500">{filteredStudents.length} Registered</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search name or CIC..."
              className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0a1f1d] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal w-full text-gray-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-[#11322f] transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-[#0d2522]">
          {studentsLoading ? (
            <div className="p-4 space-y-2">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center h-full text-gray-400">
              <Users size={32} className="mb-2 opacity-20" />
              <p className="text-sm font-semibold">No students found</p>
            </div>
          ) : (
            filteredStudents.map(student => {
              const isSelected = selectedUser?._id === student._id;
              return (
                <button
                  key={student._id}
                  onClick={() => handleUserSelect(student)}
                  className={`w-full text-left px-5 py-3.5 transition-all flex items-center gap-3 group ${
                    isSelected
                      ? 'bg-brand-teal/5 dark:bg-brand-teal/10'
                      : 'hover:bg-gray-50 dark:hover:bg-[#0a1f1d]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors shadow-sm ${
                    isSelected
                      ? 'bg-brand-teal text-white shadow-brand-teal/20'
                      : 'bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] text-gray-500 dark:text-gray-400 group-hover:border-brand-teal/30'
                  }`}>
                    {student.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate transition-colors ${isSelected ? 'text-brand-teal dark:text-brand-mint' : 'text-gray-800 dark:text-gray-200'}`}>
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">CIC: {student.cicNumber} · {student.batchName}</p>
                  </div>
                  <ChevronRight size={16} className={`flex-shrink-0 transition-all ${isSelected ? 'text-brand-teal rotate-90' : 'text-gray-300 dark:text-gray-600 group-hover:text-brand-teal group-hover:translate-x-1'}`} />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* === DETAILS PANEL === */}
      <div className="flex-1 min-w-0 h-[calc(100vh-14rem)] flex flex-col">
        {!selectedUser ? (
          <div className="flex-1 bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] shadow-sm flex flex-col items-center justify-center p-10 text-center">
            <div className="w-24 h-24 bg-gray-50 dark:bg-[#0a1f1d] rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-gray-100 dark:border-[#11322f]">
              <Users size={40} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="font-bold text-xl text-gray-600 dark:text-gray-300 mb-2">Select a student</h3>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Choose a student from the left panel to view their currently borrowed books and borrowing history
            </p>
          </div>
        ) : (
          <div className="flex-1 bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] shadow-sm flex flex-col overflow-hidden">
            
            {/* User Header */}
            <div className="relative bg-gradient-to-r from-[#0d2522] to-[#11322f] p-6 sm:p-8 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 to-transparent"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-mint/5 rounded-full blur-2xl"></div>
              
              <div className="relative flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.25rem] bg-brand-mint/20 border border-brand-mint/30 flex items-center justify-center text-brand-mint font-black text-3xl shadow-lg">
                  {selectedUser.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{selectedUser.name}</h2>
                  <p className="text-sm text-brand-mint/70">CIC: {selectedUser.cicNumber} · {selectedUser.batchName}</p>
                </div>
                <div className="ml-auto text-right bg-black/20 p-3 rounded-2xl border border-white/5 backdrop-blur-sm hidden sm:block">
                  <div className="text-3xl font-black text-brand-mint leading-none">{activeBooks.length}</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1 font-bold">Active Loans</div>
                </div>
              </div>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
              {historyLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <>
                  {/* Currently Borrowed */}
                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                        <BookOpen size={18} className="text-orange-500" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">Currently Borrowed</h3>
                      <span className="ml-auto text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">{activeBooks.length}</span>
                    </div>
                    
                    {activeBooks.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 dark:bg-[#0a1f1d] rounded-3xl border border-dashed border-gray-200 dark:border-[#11322f]">
                        <CheckCircle2 size={32} className="mx-auto mb-3 text-emerald-400" />
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No books currently borrowed</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 xl:grid-cols-2">
                        {activeBooks.map(item => (
                          <div key={item._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-orange-50/50 dark:bg-[#0a1f1d] border border-orange-100 dark:border-[#11322f] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-3 bg-white dark:bg-[#11322f] rounded-xl flex-shrink-0 shadow-sm border border-orange-100 dark:border-[#0d2522]">
                              <BookOpen size={20} className="text-orange-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-gray-900 dark:text-white truncate mb-1">{item.bookTitle}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                <Calendar size={12} className="text-gray-400" /> 
                                Issued: {new Date(item.issueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 rounded-xl border border-orange-200 dark:border-orange-800/30">
                                <Clock size={12} />
                                {calculateDays(item.issueDate)}d ago
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Borrowing History */}
                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gray-100 dark:bg-[#0a1f1d] rounded-xl">
                        <RotateCcw size={18} className="text-gray-500 dark:text-gray-400" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">Borrowing History</h3>
                      <span className="ml-auto text-xs font-bold text-gray-500 bg-gray-100 dark:bg-[#0a1f1d] px-3 py-1 rounded-full">{pastBooks.length}</span>
                    </div>
                    
                    {pastBooks.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 dark:bg-[#0a1f1d] rounded-3xl border border-dashed border-gray-200 dark:border-[#11322f]">
                        <p className="text-sm font-semibold text-gray-400">No past borrowing history</p>
                      </div>
                    ) : (
                      <div className="grid gap-3 xl:grid-cols-2">
                        {pastBooks.map(item => (
                          <div key={item._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#0a1f1d] border border-transparent hover:border-gray-100 dark:hover:border-[#11322f] rounded-2xl transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <CheckCircle2 size={18} className="text-emerald-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.bookTitle}</p>
                              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                <RotateCcw size={10} className="text-emerald-400" /> 
                                Returned: {new Date(item.returnDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">
                              Returned
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryStudents;
