import React, { useState, useEffect } from "react";
import { X, Mail, Phone, BookOpen, GraduationCap, RefreshCw, LayoutGrid } from "lucide-react";
import { useStaffStore } from "../store/useStaffStore";

const TeacherProfileModal = ({ teacher, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("details");
  const { getAssignedSubjects, assignedSubjects, isLoading } = useStaffStore();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("details");
      setHasFetched(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === "academic" && teacher && !hasFetched) {
      getAssignedSubjects(teacher._id);
      setHasFetched(true);
    }
  }, [isOpen, activeTab, teacher, getAssignedSubjects, hasFetched]);

  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[85vh] bg-white dark:bg-[#11322f] rounded-[24px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header / Banner */}
        <div className="h-32 bg-gradient-to-r from-brand-teal to-sky-500 relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-6 sm:px-8 pb-6 flex-1 overflow-y-auto">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-[#11322f] shadow-lg bg-white overflow-hidden shrink-0">
              <img
                src={
                  teacher.profileImage ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-15oVSs246BVTRobf0Ye3gECp5_E3-OKUGgAD4N8HZgj8xa-PElzug6S6tW0sdlT1cY&usqp=CAU"
                }
                alt={teacher.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left pb-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {teacher.name}
              </h2>
              <span className="inline-block px-2.5 py-0.5 mt-1 bg-brand-mint/20 text-brand-teal dark:text-brand-mint text-xs font-bold rounded-md uppercase tracking-wider">
                {teacher.role}
              </span>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-1 border-b border-gray-100 dark:border-[#0d2522] mb-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-5 py-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === "details"
                  ? "border-brand-teal text-brand-teal dark:text-brand-mint"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("academic")}
              className={`px-5 py-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === "academic"
                  ? "border-brand-teal text-brand-teal dark:text-brand-mint"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Academic Profile
            </button>
          </div>

          {/* Tabs Content */}
          <div className="pb-4">
            {activeTab === "details" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-[#0a1f1d] rounded-2xl border border-gray-100 dark:border-[#0d2522]">
                    <div className="flex items-center gap-3 text-gray-500 mb-1">
                      <Mail size={16} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Username / Email</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white pl-7">
                      {teacher.userName}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-[#0a1f1d] rounded-2xl border border-gray-100 dark:border-[#0d2522]">
                    <div className="flex items-center gap-3 text-gray-500 mb-1">
                      <Phone size={16} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Phone Number</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white pl-7">
                      {teacher.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <RefreshCw size={24} className="animate-spin mb-3 text-brand-teal" />
                    <p className="text-sm font-medium text-gray-500">Loading academic data...</p>
                  </div>
                ) : !assignedSubjects || assignedSubjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-[#0a1f1d] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <GraduationCap size={32} className="text-gray-400 mb-3 opacity-50" />
                    <p className="text-sm font-medium text-gray-500 text-center px-4">
                      No subjects or classes assigned to this teacher yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assigned Subjects & Classes</h4>
                    <div className="grid gap-3">
                      {assignedSubjects.map((subject, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-[#0a1f1d] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-brand-mint/20 text-brand-teal dark:text-brand-mint rounded-xl shrink-0">
                              <BookOpen size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">{subject.subjectName || subject.name || subject.title || "Subject"}</p>
                              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                                <LayoutGrid size={12} />
                                <span>{subject.batchDetails?.name || "Unknown Class"}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* If period data was returned, we could show it here */}
                          <div className="mt-3 sm:mt-0 px-3 py-1.5 bg-gray-50 dark:bg-[#11322f] rounded-lg text-[11px] font-semibold text-gray-600 dark:text-gray-300 w-fit">
                            Class: {subject.batchDetails?.name || "Unknown Class"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileModal;
