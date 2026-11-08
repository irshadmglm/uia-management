import React, { useEffect, useState } from "react";
import { 
  Calendar, Clock, BookOpen, Users2, Printer, Loader2, Sparkles, CheckCircle2 
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useTimetableStore } from "../../store/useTimetableStore";

const DEFAULT_WEEKDAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const TeacherTimetablePage = () => {
  const { authUser } = useAuthStore();
  const { teacherSchedule, isTeacherLoading, fetchTeacherTimetable } = useTimetableStore();

  const [selectedDayFilter, setSelectedDayFilter] = useState("all"); // "all" or specific day

  useEffect(() => {
    if (authUser?._id) {
      fetchTeacherTimetable(authUser._id);
    }
  }, [authUser, fetchTeacherTimetable]);

  const scheduleByDay = teacherSchedule?.scheduleByDay || {};
  const totalPeriods = teacherSchedule?.totalPeriods || 0;
  const uniqueBatches = teacherSchedule?.uniqueBatches || [];
  const uniqueSubjects = teacherSchedule?.uniqueSubjects || [];
  const periodsCount = teacherSchedule?.periodsCount || 4;
  const periodTimes = teacherSchedule?.periodTimes || [];

  const weekdays = Object.keys(scheduleByDay).length > 0 
    ? Object.keys(scheduleByDay) 
    : DEFAULT_WEEKDAYS;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#11322f] via-[#0d2522] to-[#081816] p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-mint/10 to-transparent pointer-events-none"></div>
        <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-brand-mint via-brand-teal to-transparent rounded-r-full"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="pl-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-brand-mint/80 uppercase tracking-widest">
                Faculty Schedule
              </span>
              <span className="w-1 h-1 rounded-full bg-brand-mint/40"></span>
              <span className="text-[10px] text-white/40">UIA Academics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              My Weekly Timetable
            </h1>
            <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-lg">
              Here is your synchronized weekly schedule with assigned classes and subject periods.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition border border-white/10 flex items-center gap-2 shadow-sm"
            >
              <Printer size={15} />
              <span>Print Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#11322f] border border-gray-100 dark:border-[#0d2522] shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-teal/10 text-brand-teal dark:text-brand-mint">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Total Weekly Periods
            </p>
            <p className="text-2xl font-black text-gray-900 dark:text-white font-oswald mt-0.5">
              {totalPeriods}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#11322f] border border-gray-100 dark:border-[#0d2522] shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Users2 size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Classes Taught
            </p>
            <p className="text-2xl font-black text-gray-900 dark:text-white font-oswald mt-0.5">
              {uniqueBatches.length}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#11322f] border border-gray-100 dark:border-[#0d2522] shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Assigned Subjects
            </p>
            <p className="text-2xl font-black text-gray-900 dark:text-white font-oswald mt-0.5">
              {uniqueSubjects.length}
            </p>
          </div>
        </div>
      </div>

      {/* Timetable Content */}
      {isTeacherLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522]">
          <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-medium">
            Loading your weekly schedule...
          </p>
        </div>
      ) : totalPeriods === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] space-y-3">
          <div className="w-12 h-12 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto">
            <Calendar size={24} />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-gray-200">
            No Timetable Slots Assigned Yet
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Your administrator has not yet scheduled or imported periods for your account. Please check back after the timetable has been imported.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-[#0d2522]/80 border-b border-gray-200/80 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-32">Day</th>
                  {Array.from({ length: periodsCount }).map((_, pIdx) => (
                    <th key={pIdx} className="py-3.5 px-4 text-center">
                      <div>Period {pIdx + 1}</div>
                      {periodTimes[pIdx] && (
                        <div className="text-[10px] font-normal text-gray-400 lowercase">
                          {periodTimes[pIdx]}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs">
                {weekdays.map((day) => {
                  const daySlots = scheduleByDay[day] || [];
                  const slotsByPeriod = {};
                  daySlots.forEach((s) => {
                    slotsByPeriod[s.period] = s;
                  });

                  return (
                    <tr key={day} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition">
                      <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-teal"></span>
                          <span>{day}</span>
                        </div>
                      </td>

                      {Array.from({ length: periodsCount }).map((_, pIdx) => {
                        const slot = slotsByPeriod[pIdx];

                        return (
                          <td key={pIdx} className="p-2.5 text-center align-top">
                            {slot ? (
                              <div className="p-3 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-[#0d2522] dark:to-[#11322f] border border-gray-200/80 dark:border-white/10 border-l-4 border-l-brand-teal text-left shadow-sm hover:shadow transition">
                                <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                                  {slot.subjectName}
                                </p>
                                <p className="text-[11px] font-semibold text-brand-teal dark:text-brand-mint truncate mt-1">
                                  🏫 {slot.batchName}
                                </p>
                                {slot.room && (
                                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                    📍 Room {slot.room}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="h-16 rounded-2xl border border-dashed border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-300 dark:text-gray-600 text-[11px] font-medium">
                                Free
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherTimetablePage;

