import React, { useEffect, useState } from "react";
import { Search, Users, UserCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useStudentStore } from "../../store/studentStore";
import { useMarksStore } from "../../store/useMarksStore";

import { useAuthStore } from "../../store/useAuthStore";
import { useAchievement } from "../../store/achivemnetStore";
import { useReadingProgress } from "../../store/readingProgressStore";

const BatchStudents = () => {
  const { item: rawItem, batchId } = useParams();
  const item = rawItem === "achievements" ? "achievements" : rawItem;

  const [searchQuery, setSearchQuery] = useState("");
  const { getBatchStudents, batchStudents } = useStudentStore();
  const { getMarkListToapprove, markList } = useMarksStore();
  const { markListCountToApprove, marksCountToApproveByStd } = useMarksStore();
  const { achievementsCountToApprove, achieveCountToApproveByStd } = useAchievement();
  const { progressCountToApprove, progressCountToApproveByStd } = useReadingProgress();
  const { authUser } = useAuthStore();

  const [students, setStudents] = useState([]);
  const [countToApprove, setCountToApprove] = useState([]);

  useEffect(() => {
    if (batchId) {
      getBatchStudents(batchId);
      getMarkListToapprove(batchId);
    }
  }, [batchId, getBatchStudents, getMarkListToapprove]);

  useEffect(() => {
    if (batchStudents?.length) {
      setStudents([...batchStudents]);
    }
  }, [batchStudents, markList]);

  useEffect(() => {
    if (batchId) {
      if (item === "marklist") marksCountToApproveByStd(batchId);
      else if (item === "achievements") achieveCountToApproveByStd(batchId);
      else if (item === "reading-progress") progressCountToApproveByStd(batchId);
    }
  }, [item, batchId, marksCountToApproveByStd, achieveCountToApproveByStd, progressCountToApproveByStd]);

  useEffect(() => {
    let arr = [];
    if (item === "marklist") arr = markListCountToApprove;
    else if (item === "achievements") arr = achievementsCountToApprove;
    else if (item === "reading-progress") arr = progressCountToApprove;

    setCountToApprove([...arr]);
  }, [item, markListCountToApprove, achievementsCountToApprove, progressCountToApprove]);

  const filteredStudents = students.filter((student) =>
    [student.name, String(student.cicNumber)]
      .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-teal/10 dark:bg-[#11322f] rounded-xl">
            <Users className="text-brand-teal w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-oswald tracking-wide capitalize">
            Students' {item.replace("-", " ")}
          </h2>
        </div>
        
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students..."
            className="pl-12 pr-4 py-3 w-full rounded-xl border-0 shadow-sm bg-white dark:bg-[#11322f] text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-teal transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] text-gray-500 dark:text-gray-400">
          No students found.
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStudents.map((student, index) => {
            const badge = countToApprove.find((s) => String(s._id) === String(student._id));
            return (
            <Link
                key={student._id}
                to={
                  authUser.role === "admin"
                    ? `/dashboard/admin/${item}/${student._id}`
                    : `/dashboard/teacher/${item}/${student._id}`
                }
                className="group relative flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-[#11322f] dark:to-[#0d2522] rounded-2xl p-5 border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-gray-100 dark:border-[#0d2522] hover:shadow-xl hover:-translate-y-1 hover:border-brand-teal/50 transition-all duration-300 overflow-hidden"
              >
                {/* Left Accent Border */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-teal to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>

                {/* Decorative background element */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-teal/5 rounded-full blur-2xl group-hover:bg-brand-teal/15 transition-colors"></div>
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-sky-400/5 rounded-full blur-2xl group-hover:bg-sky-400/10 transition-colors"></div>
                  
                  {/* Watermark Icon */}
                  <Users className="absolute -bottom-4 -right-2 w-24 h-24 text-gray-100 dark:text-[#16423e] rotate-[-15deg] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 opacity-50" />
                </div>

                {/* Top Right Actions / Badges */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-30">
                  {authUser.role === "admin" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        useAuthStore.getState().impersonate(student._id);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-100 dark:border-emerald-800/30 shadow-sm transition-all"
                      title="Impersonate Student"
                    >
                      <UserCheck size={14} />
                    </button>
                  )}
                  {badge?.count > 0 && (
                    <div className="w-7 h-7 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white text-xs font-bold shadow-md border-2 border-white dark:border-[#11322f] animate-pulse">
                      {badge.count}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 relative z-10 h-full">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-white dark:bg-[#0d2522] text-brand-teal font-bold flex items-center justify-center border border-gray-100 dark:border-transparent shadow-sm text-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-brand-teal/20 group-hover:text-brand-teal relative overflow-hidden">
                     <div className="absolute inset-0 bg-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <span className="relative z-10">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5 block">Student Details</span>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-[13px] sm:text-[14.5px] leading-snug group-hover:text-brand-teal transition-colors mb-1 break-words">
                      {student.name}
                    </h3>
                    <div className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
                      CIC: {student.cicNumber || "N/A"}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BatchStudents;
