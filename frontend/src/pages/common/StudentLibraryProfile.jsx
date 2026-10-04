import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Calendar, RotateCcw, User, CreditCard } from 'lucide-react';
import { useBooksStore } from '../../store/useBooksStore';

const calculateDays = (issueDate) => {
  if (!issueDate) return 0;
  return Math.floor((new Date() - new Date(issueDate)) / (1000 * 86400));
};

const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] p-5 h-24"></div>
);

const StudentLibraryProfile = ({ studentId, studentDetails }) => {
  const { getUserHistory, history } = useBooksStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      await getUserHistory(studentId);
      setLoading(false);
    };
    if (studentId) fetchHistory();
  }, [studentId, getUserHistory]);

  const activeBooks = history.filter(h => h.status === 'active');
  const pastBooks = history.filter(h => h.status === 'returned');

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn">
      {/* Header Profile Section */}
      {studentDetails && (
        <div className="relative bg-gradient-to-r from-[#0d2522] to-[#11322f] rounded-3xl p-6 sm:p-8 overflow-hidden shadow-lg border border-[#1a4742]">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-mint/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-[1.5rem] bg-brand-mint/20 border border-brand-mint/30 flex items-center justify-center text-brand-mint font-black text-4xl shadow-lg">
              {studentDetails.name?.[0]?.toUpperCase()}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{studentDetails.name}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-lg text-sm text-brand-mint border border-white/5 backdrop-blur-md">
                  <CreditCard size={14} /> CIC: {studentDetails.cicNumber}
                </span>
                {studentDetails.batchName && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-lg text-sm text-brand-mint border border-white/5 backdrop-blur-md">
                    <User size={14} /> {studentDetails.batchName}
                  </span>
                )}
              </div>
            </div>

            <div className="hidden sm:block shrink-0 text-right bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-sm shadow-inner">
              <div className="text-4xl font-black text-brand-mint leading-none">{activeBooks.length}</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1.5 font-bold">Active Loans</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Active Loans */}
        <div className="bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <BookOpen size={20} className="text-orange-500" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">Currently Borrowed</h3>
            </div>
            <span className="text-sm font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">{activeBooks.length}</span>
          </div>

          <div className="space-y-4">
            {loading ? (
              [...Array(2)].map((_, i) => <SkeletonCard key={i} />)
            ) : activeBooks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-[#0a1f1d] rounded-2xl border border-dashed border-gray-200 dark:border-[#11322f]">
                <CheckCircle2 size={40} className="mx-auto mb-4 text-emerald-400 opacity-80" />
                <p className="font-semibold text-gray-500 dark:text-gray-400">No books currently borrowed</p>
                <p className="text-xs text-gray-400 mt-1">Great job keeping up with returns!</p>
              </div>
            ) : (
              activeBooks.map(item => (
                <div key={item._id} className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 bg-white dark:bg-[#0a1f1d] border border-orange-100 dark:border-[#11322f] rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-amber-500"></div>
                  
                  <div className="p-3.5 bg-orange-50 dark:bg-[#11322f] rounded-xl shrink-0 shadow-sm border border-orange-100/50 dark:border-[#0d2522]">
                    <BookOpen size={20} className="text-orange-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate mb-1.5 group-hover:text-orange-500 transition-colors">{item.bookTitle}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" /> 
                      Issued: <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(item.issueDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                  
                  <div className="shrink-0 sm:self-end">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-2 rounded-xl border border-orange-200 dark:border-orange-800/30">
                      <Clock size={14} />
                      {calculateDays(item.issueDate)} days ago
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Borrowing History */}
        <div className="bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <RotateCcw size={20} className="text-emerald-500" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">Borrowing History</h3>
            </div>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">{pastBooks.length}</span>
          </div>

          <div className="space-y-3">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            ) : pastBooks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-[#0a1f1d] rounded-2xl border border-dashed border-gray-200 dark:border-[#11322f]">
                <RotateCcw size={40} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="font-semibold text-gray-500 dark:text-gray-400">No borrowing history</p>
              </div>
            ) : (
              pastBooks.map(item => (
                <div key={item._id} className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-[#0a1f1d] border border-gray-100 dark:border-[#11322f] rounded-2xl transition-all group hover:bg-white hover:shadow-sm dark:hover:bg-[#11322f]">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/30 group-hover:scale-105 transition-transform">
                    <CheckCircle2 size={20} className="text-emerald-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate mb-1">{item.bookTitle}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar size={12}/> Issued: {new Date(item.issueDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><RotateCcw size={12}/> Returned: {new Date(item.returnDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentLibraryProfile;
