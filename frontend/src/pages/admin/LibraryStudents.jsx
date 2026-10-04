import React, { useEffect, useState, useMemo } from 'react';
import { Search, Users, LayoutGrid, List, ChevronRight, X } from 'lucide-react';
import { useStudentStore } from '../../store/studentStore';
import StudentLibraryProfile from '../common/StudentLibraryProfile';
import { motion, AnimatePresence } from 'framer-motion';

const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] p-5">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#0d2522]"></div>
      <div className="space-y-2 flex-1">
        <div className="h-3.5 bg-gray-100 dark:bg-[#0d2522] rounded w-3/4"></div>
        <div className="h-2.5 bg-gray-100 dark:bg-[#0d2522] rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const LibraryStudents = () => {
  const { students, getStudents, isLoading: studentsLoading } = useStudentStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => { 
    getStudents(); 
  }, [getStudents]);

  // Extract unique batches from students
  const batches = useMemo(() => {
    const batchSet = new Set(students.map(s => s.batchName).filter(Boolean));
    return ['All', ...Array.from(batchSet)];
  }, [students]);

  // Filter students by search and batch
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.cicNumber?.toString().includes(searchTerm);
      const matchesBatch = selectedBatch === 'All' || s.batchName === selectedBatch;
      return matchesSearch && matchesBatch;
    });
  }, [students, searchTerm, selectedBatch]);

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto pb-10">
      {/* Header & Batches Tabs */}
      <div className="bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] shadow-sm p-4 sm:p-5">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-teal/10 rounded-2xl">
              <Users size={24} className="text-brand-teal" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Student Library Profiles</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">View borrowing history and active loans for all students</p>
            </div>
          </div>
          
          {/* Batches Scrollable Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {batches.map(batch => (
              <button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border whitespace-nowrap ${
                  selectedBatch === batch
                    ? 'bg-brand-teal text-white border-brand-teal shadow-md shadow-brand-teal/20'
                    : 'bg-gray-50 dark:bg-[#0a1f1d] text-gray-600 dark:text-gray-300 border-transparent hover:border-gray-200 dark:hover:border-[#11322f] hover:bg-white dark:hover:bg-[#11322f]'
                }`}
              >
                {batch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar: Search and View Mode */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by student name or CIC number..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#11322f] border border-gray-100 dark:border-[#0d2522] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-900 dark:text-white placeholder-gray-400 shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex bg-white dark:bg-[#11322f] rounded-2xl p-1 gap-1 shrink-0 shadow-sm border border-gray-100 dark:border-[#0d2522]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-[#0a1f1d] text-brand-teal' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-gray-100 dark:bg-[#0a1f1d] text-brand-teal' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Student List */}
      {studentsLoading ? (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] p-16 text-center shadow-sm">
          <Users size={56} className="mx-auto mb-4 text-gray-200 dark:text-gray-700" />
          <p className="font-bold text-lg text-gray-500 dark:text-gray-400">No students found</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your search or batch filter.</p>
        </div>
      ) : (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {filteredStudents.map(student => (
            <button
              key={student._id}
              onClick={() => setSelectedStudent(student)}
              className="text-left bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] p-5 shadow-sm hover:shadow-md hover:border-brand-teal/30 transition-all group flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-[#0a1f1d] border border-gray-100 dark:border-[#11322f] flex items-center justify-center font-bold text-lg text-brand-teal group-hover:scale-105 transition-transform shrink-0">
                {student.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate mb-0.5 group-hover:text-brand-teal transition-colors">
                  {student.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-mono bg-gray-100 dark:bg-[#0a1f1d] px-1.5 py-0.5 rounded">CIC: {student.cicNumber}</span>
                  <span className="truncate">{student.batchName}</span>
                </div>
              </div>
              <div className="shrink-0 w-8 h-8 rounded-full bg-gray-50 dark:bg-[#0a1f1d] flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white text-gray-400 transition-colors">
                <ChevronRight size={16} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Student Profile Slide-over / Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedStudent(null)}
            />
            
            {/* Slide-over panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#11322f] h-full shadow-2xl flex flex-col border-l border-gray-200 dark:border-[#0d2522]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#0d2522] bg-white dark:bg-[#11322f]">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Users size={20} className="text-brand-teal" />
                  Library Profile Details
                </h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#0a1f1d] text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-[#0a1f1d]">
                <StudentLibraryProfile studentId={selectedStudent._id} studentDetails={selectedStudent} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LibraryStudents;
