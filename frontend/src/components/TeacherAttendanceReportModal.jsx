import React, { useState, useEffect } from "react";
import { 
  X, Calendar, Download, Printer, UserCheck, AlertTriangle, 
  CheckCircle, ArrowUpRight, TrendingUp, Layers, Award 
} from "lucide-react";
import { useTeacherAttendanceStore } from "../store/useTeacherAttendanceStore";

const TeacherAttendanceReportModal = ({ isOpen, onClose }) => {
  const { monthlySummary, fetchMonthlySummary } = useTeacherAttendanceStore();
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  useEffect(() => {
    if (isOpen) {
      fetchMonthlySummary(selectedYear, selectedMonth);
    }
  }, [isOpen, selectedYear, selectedMonth, fetchMonthlySummary]);

  if (!isOpen) return null;

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const overview = monthlySummary?.overview || {
    totalScheduledPeriods: 0,
    totalPresentPeriods: 0,
    totalAbsentPeriods: 0,
    totalSubstitutedPeriods: 0,
    attendanceRate: 0,
  };

  const teacherStats = monthlySummary?.teacherStats || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                Monthly Teacher Attendance & Substitution Report
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Period-level compliance, substitution tracking, and duty summaries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1.5 transition-colors"
            >
              <Printer size={14} />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Month Selector Bar */}
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
              <Calendar size={14} />
              Period:
            </span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-gray-500">
            {monthlySummary?.totalDaysTracked || 0} active teaching days recorded
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                Scheduled Periods
              </span>
              <div className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
                {overview.totalScheduledPeriods}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Attended & Conducted
              </span>
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-0.5 flex items-baseline gap-1.5">
                <span>{overview.totalPresentPeriods}</span>
                <span className="text-xs font-normal opacity-80">
                  ({overview.attendanceRate}%)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
              <span className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                Absences Recorded
              </span>
              <div className="text-xl font-bold text-red-700 dark:text-red-300 mt-0.5">
                {overview.totalAbsentPeriods}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Proxy / Substitutions
              </span>
              <div className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-0.5">
                {overview.totalSubstitutedPeriods}
              </div>
            </div>
          </div>

          {/* Teacher Breakdown Table */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-2.5 px-3">Teacher</th>
                  <th className="py-2.5 px-3 text-center">Scheduled</th>
                  <th className="py-2.5 px-3 text-center">Attended</th>
                  <th className="py-2.5 px-3 text-center">Absent</th>
                  <th className="py-2.5 px-3 text-center">Substituted Away</th>
                  <th className="py-2.5 px-3 text-center">Substitutes Taken (Proxy)</th>
                  <th className="py-2.5 px-3 text-right">Attendance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {teacherStats.map((t, idx) => (
                  <tr key={t.id || idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-white">
                      {t.name}
                    </td>
                    <td className="py-2.5 px-3 text-center text-gray-600 dark:text-gray-300">
                      {t.scheduledCount}
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-medium">
                      {t.presentCount}
                    </td>
                    <td className="py-2.5 px-3 text-center text-red-600 dark:text-red-400 font-medium">
                      {t.absentCount > 0 ? t.absentCount : "-"}
                    </td>
                    <td className="py-2.5 px-3 text-center text-amber-600 dark:text-amber-400">
                      {t.substitutesGiven > 0 ? t.substitutesGiven : "-"}
                    </td>
                    <td className="py-2.5 px-3 text-center text-blue-600 dark:text-blue-400 font-medium">
                      {t.substitutesTaken > 0 ? `+${t.substitutesTaken}` : "-"}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-bold ${
                        t.attendanceRate >= 90
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : t.attendanceRate >= 75
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                      }`}>
                        {t.attendanceRate}%
                      </span>
                    </td>
                  </tr>
                ))}
                {teacherStats.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No teacher attendance records found for this month.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendanceReportModal;

