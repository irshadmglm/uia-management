import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import StudentLibraryProfile from '../common/StudentLibraryProfile';
import { BookOpen } from 'lucide-react';

const StudentMyLibrary = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-teal/10 rounded-2xl">
          <BookOpen size={24} className="text-brand-teal" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">My Library Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">View your active loans and borrowing history</p>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-[#0a1f1d] p-4 sm:p-6 rounded-3xl border border-gray-100 dark:border-[#0d2522]">
        <StudentLibraryProfile studentId={authUser._id} studentDetails={authUser} />
      </div>
    </div>
  );
};

export default StudentMyLibrary;
