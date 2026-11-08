import React, { useState, useEffect, useMemo } from "react";
import { 
  X, Calendar, Download, Printer, UserCheck, AlertTriangle, 
  CheckCircle, ArrowUpRight, TrendingUp, Layers, Award, FileSpreadsheet,
  FileText, Search, Sparkles, Filter, Clock, ChevronDown, Check
} from "lucide-react";
import { useTeacherAttendanceStore } from "../store/useTeacherAttendanceStore";

const TeacherAttendanceReportModal = ({ isOpen, onClose }) => {
  const { monthlySummary, fetchMonthlySummary } = useTeacherAttendanceStore();
  const now = new Date();

  // Mode: "monthly" | "custom"
  const [dateMode, setDateMode] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  // Custom date range
  const todayStr = now.toISOString().split("T")[0];
  const firstDayStr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(firstDayStr);
  const [endDate, setEndDate] = useState(todayStr);

  // Report view tab: "summary" | "detailed" | "substitutions"
  const [activeTab, setActiveTab] = useState("summary");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Fetch report on change
  useEffect(() => {
    if (!isOpen) return;

    if (dateMode === "monthly") {
      fetchMonthlySummary({ year: selectedYear, month: selectedMonth });
    } else {
      fetchMonthlySummary({ startDate, endDate });
    }
  }, [isOpen, dateMode, selectedYear, selectedMonth, startDate, endDate, fetchMonthlySummary]);

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
  const detailedLogs = monthlySummary?.detailedLogs || [];
  const substitutionLogs = monthlySummary?.substitutionLogs || [];

  const timeframeLabel = useMemo(() => {
    if (dateMode === "monthly") {
      const mObj = months.find((m) => m.value === selectedMonth);
      return `${mObj?.label || selectedMonth} ${selectedYear}`;
    }
    return `${startDate} to ${endDate}`;
  }, [dateMode, selectedMonth, selectedYear, startDate, endDate, months]);

  // Filtered views based on search query
  const filteredTeacherStats = useMemo(() => {
    if (!searchQuery.trim()) return teacherStats;
    const q = searchQuery.toLowerCase();
    return teacherStats.filter((t) => t.name.toLowerCase().includes(q));
  }, [teacherStats, searchQuery]);

  const filteredDetailedLogs = useMemo(() => {
    if (!searchQuery.trim()) return detailedLogs;
    const q = searchQuery.toLowerCase();
    return detailedLogs.filter(
      (d) =>
        d.scheduledTeacherName.toLowerCase().includes(q) ||
        d.attendedTeacherName.toLowerCase().includes(q) ||
        d.subjectName.toLowerCase().includes(q) ||
        d.batchName.toLowerCase().includes(q) ||
        d.date.includes(q)
    );
  }, [detailedLogs, searchQuery]);

  const filteredSubstitutions = useMemo(() => {
    if (!searchQuery.trim()) return substitutionLogs;
    const q = searchQuery.toLowerCase();
    return substitutionLogs.filter(
      (s) =>
        s.scheduledTeacherName.toLowerCase().includes(q) ||
        s.attendedTeacherName.toLowerCase().includes(q) ||
        s.subjectName.toLowerCase().includes(q) ||
        s.batchName.toLowerCase().includes(q) ||
        s.date.includes(q)
    );
  }, [substitutionLogs, searchQuery]);

  // Export to Multi-Tab Excel Workbook
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();

      // 1. Teacher Summary Sheet
      const summarySheetData = teacherStats.map((t, idx) => ({
        "Sl No": idx + 1,
        "Teacher Name": t.name,
        "Scheduled Periods": t.scheduledCount,
        "Attended (Regular)": t.presentCount,
        "Absences": t.absentCount,
        "Substituted Away (Missed)": t.substitutesGiven,
        "Proxy Classes Taken": t.substitutesTaken,
        "Net Conducted Classes": t.totalClassesConducted,
        "Attendance Rate": `${t.attendanceRate}%`,
      }));
      const wsSummary = XLSX.utils.json_to_sheet(summarySheetData);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Teacher Summary");

      // 2. Detailed Records Sheet
      if (detailedLogs.length > 0) {
        const detailSheetData = detailedLogs.map((d, idx) => ({
          "Sl No": idx + 1,
          "Date": d.date,
          "Day": d.day,
          "Period": `Period ${d.period}`,
          "Batch / Class": d.batchName,
          "Subject": d.subjectName,
          "Room": d.room || "-",
          "Scheduled Teacher": d.scheduledTeacherName,
          "Attended Teacher": d.attendedTeacherName,
          "Status": d.status?.toUpperCase(),
          "Is Proxy / Substituted": d.isSubstituted ? "YES" : "NO",
          "Remarks": d.remarks || "",
        }));
        const wsDetail = XLSX.utils.json_to_sheet(detailSheetData);
        XLSX.utils.book_append_sheet(wb, wsDetail, "Period Logs");
      }

      // 3. Substitution Log Sheet
      if (substitutionLogs.length > 0) {
        const subSheetData = substitutionLogs.map((s, idx) => ({
          "Sl No": idx + 1,
          "Date": s.date,
          "Day": s.day,
          "Period": `Period ${s.period}`,
          "Batch": s.batchName,
          "Subject": s.subjectName,
          "Scheduled Teacher": s.scheduledTeacherName,
          "Substitute (Proxy) Teacher": s.attendedTeacherName,
          "Remarks": s.remarks || "",
        }));
        const wsSub = XLSX.utils.json_to_sheet(subSheetData);
        XLSX.utils.book_append_sheet(wb, wsSub, "Substitutions Log");
      }

      const cleanLabel = timeframeLabel.replace(/[^a-zA-Z0-9_-]/g, "_");
      XLSX.writeFile(wb, `Teacher_Attendance_Report_${cleanLabel}.xlsx`);
    } catch (err) {
      console.error("Failed to export Excel report:", err);
      alert("Error generating Excel report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Export CSV based on current active tab
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();

      let exportRows = [];
      if (activeTab === "summary") {
        exportRows = teacherStats.map((t, idx) => ({
          "Sl No": idx + 1,
          "Teacher Name": t.name,
          "Scheduled": t.scheduledCount,
          "Attended": t.presentCount,
          "Absent": t.absentCount,
          "Substituted Away": t.substitutesGiven,
          "Proxy Taken": t.substitutesTaken,
          "Total Conducted": t.totalClassesConducted,
          "Attendance Rate": `${t.attendanceRate}%`,
        }));
      } else if (activeTab === "substitutions") {
        exportRows = substitutionLogs.map((s, idx) => ({
          "Sl No": idx + 1,
          "Date": s.date,
          "Day": s.day,
          "Period": s.period,
          "Batch": s.batchName,
          "Subject": s.subjectName,
          "Scheduled Teacher": s.scheduledTeacherName,
          "Proxy Teacher": s.attendedTeacherName,
          "Remarks": s.remarks || "",
        }));
      } else {
        exportRows = detailedLogs.map((d, idx) => ({
          "Sl No": idx + 1,
          "Date": d.date,
          "Day": d.day,
          "Period": d.period,
          "Batch": d.batchName,
          "Subject": d.subjectName,
          "Scheduled Teacher": d.scheduledTeacherName,
          "Attended Teacher": d.attendedTeacherName,
          "Status": d.status,
          "Substituted": d.isSubstituted ? "YES" : "NO",
          "Remarks": d.remarks || "",
        }));
      }

      const ws = XLSX.utils.json_to_sheet(exportRows);
      XLSX.utils.book_append_sheet(wb, ws, "AttendanceData");

      const cleanLabel = timeframeLabel.replace(/[^a-zA-Z0-9_-]/g, "_");
      XLSX.writeFile(wb, `Teacher_Attendance_${activeTab}_${cleanLabel}.csv`, { bookType: "csv" });
    } catch (err) {
      console.error("Failed to export CSV:", err);
      alert("Error generating CSV export.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold shadow-inner">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight">
                  Teacher Attendance & Duty Report
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                  {timeframeLabel}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Period-level audit logs, substitution compliance, and multi-format reporting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Excel Button */}
            <button
              onClick={handleExportExcel}
              disabled={isExporting || teacherStats.length === 0}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              title="Download Full Multi-Sheet Excel Report"
            >
              <Download size={14} />
              <span>Export Excel</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={isExporting || teacherStats.length === 0}
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Export Current View as CSV"
            >
              <FileText size={14} />
              <span className="hidden sm:inline">CSV</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              title="Print Sheet"
            >
              <Printer size={16} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filters & Range Toolbar */}
        <div className="px-5 py-3.5 bg-gray-50/80 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
          {/* Timeframe selector controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-white dark:bg-gray-800 p-0.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold">
              <button
                onClick={() => setDateMode("monthly")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  dateMode === "monthly"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setDateMode("custom")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  dateMode === "custom"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                Date Range
              </button>
            </div>

            {dateMode === "monthly" ? (
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 outline-none"
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
                  className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  {[2024, 2025, 2026, 2027].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium outline-none"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium outline-none"
                />
              </div>
            )}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-60">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search teacher, batch, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* View Mode Tabs Bar */}
        <div className="px-5 pt-3 pb-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4">
          <button
            onClick={() => setActiveTab("summary")}
            className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "summary"
                ? "border-teal-600 text-teal-600 dark:text-teal-400"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
            }`}
          >
            <UserCheck size={14} />
            <span>Teacher Summary ({teacherStats.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("detailed")}
            className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "detailed"
                ? "border-teal-600 text-teal-600 dark:text-teal-400"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
            }`}
          >
            <Layers size={14} />
            <span>Period Records Log ({detailedLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("substitutions")}
            className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "substitutions"
                ? "border-amber-600 text-amber-600 dark:text-amber-400"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
            }`}
          >
            <Sparkles size={14} />
            <span>Substitutions (Proxy) ({substitutionLogs.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* KPI Cards Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                Scheduled Periods
              </span>
              <div className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
                {overview.totalScheduledPeriods}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {monthlySummary?.totalDaysTracked || 0} teaching days tracked
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Attended & Conducted
              </span>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5 flex items-baseline gap-1.5">
                <span>{overview.totalPresentPeriods}</span>
                <span className="text-xs font-normal opacity-80">
                  ({overview.attendanceRate}%)
                </span>
              </div>
              <div className="text-[10px] text-emerald-600/70 mt-0.5">Overall compliance</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
              <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
                Absences Recorded
              </span>
              <div className="text-xl font-black text-red-700 dark:text-red-300 mt-0.5">
                {overview.totalAbsentPeriods}
              </div>
              <div className="text-[10px] text-red-500/70 mt-0.5">Classes missed</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                Proxy / Substitutions
              </span>
              <div className="text-xl font-black text-amber-700 dark:text-amber-300 mt-0.5">
                {overview.totalSubstitutedPeriods}
              </div>
              <div className="text-[10px] text-amber-600/70 mt-0.5">Reassigned duties</div>
            </div>
          </div>

          {/* TAB 1: Teacher Summary Table */}
          {activeTab === "summary" && (
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="py-3 px-3">Teacher Name</th>
                    <th className="py-3 px-3 text-center">Scheduled</th>
                    <th className="py-3 px-3 text-center">Attended</th>
                    <th className="py-3 px-3 text-center">Absent</th>
                    <th className="py-3 px-3 text-center">Substituted Away</th>
                    <th className="py-3 px-3 text-center">Proxy Taken</th>
                    <th className="py-3 px-3 text-center">Net Conducted</th>
                    <th className="py-3 px-3 text-right">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredTeacherStats.map((t, idx) => (
                    <tr key={t.id || idx} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-teal-600/10 text-teal-600 dark:text-teal-400 font-bold text-xs flex items-center justify-center uppercase">
                          {t.name.slice(0, 2)}
                        </div>
                        <span>{t.name}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                        {t.scheduledCount}
                      </td>
                      <td className="py-3 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                        {t.presentCount}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-red-600 dark:text-red-400">
                        {t.absentCount > 0 ? t.absentCount : "-"}
                      </td>
                      <td className="py-3 px-3 text-center text-amber-600 dark:text-amber-400 font-medium">
                        {t.substitutesGiven > 0 ? t.substitutesGiven : "-"}
                      </td>
                      <td className="py-3 px-3 text-center text-blue-600 dark:text-blue-400 font-bold">
                        {t.substitutesTaken > 0 ? `+${t.substitutesTaken}` : "-"}
                      </td>
                      <td className="py-3 px-3 text-center font-black text-gray-900 dark:text-white">
                        {t.totalClassesConducted}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold ${
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
                  {filteredTeacherStats.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-gray-400">
                        No teacher attendance records found for this timeframe.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Detailed Period Records Log */}
          {activeTab === "detailed" && (
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs min-w-[750px]">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-gray-700 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Date & Day</th>
                      <th className="py-2.5 px-3">Period</th>
                      <th className="py-2.5 px-3">Batch</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Scheduled Teacher</th>
                      <th className="py-2.5 px-3">Attended Teacher</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredDetailedLogs.map((d, idx) => (
                      <tr key={d.id || idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="py-2.5 px-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          <div>{d.date}</div>
                          <div className="text-[10px] text-gray-400">{d.day}</div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-teal-700 dark:text-teal-300 whitespace-nowrap">
                          P{d.period}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                          {d.batchName}
                        </td>
                        <td className="py-2.5 px-3 text-gray-700 dark:text-gray-300">
                          {d.subjectName}
                        </td>
                        <td className="py-2.5 px-3 text-gray-600 dark:text-gray-400">
                          {d.scheduledTeacherName}
                        </td>
                        <td className="py-2.5 px-3 font-semibold whitespace-nowrap">
                          {d.isSubstituted ? (
                            <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                              <Sparkles size={11} /> {d.attendedTeacherName} (Proxy)
                            </span>
                          ) : (
                            <span className="text-gray-900 dark:text-white">{d.attendedTeacherName}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {d.status === "present" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                              Attended
                            </span>
                          )}
                          {d.status === "absent" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                              Absent
                            </span>
                          )}
                          {d.status === "unmarked" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-gray-500 italic max-w-[150px] truncate" title={d.remarks}>
                          {d.remarks || "-"}
                        </td>
                      </tr>
                    ))}
                    {filteredDetailedLogs.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-gray-400">
                          No detailed period logs recorded for this timeframe.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Substitutions (Proxy) Log */}
          {activeTab === "substitutions" && (
            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold border-b border-amber-200/50 dark:border-amber-900/40 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Period</th>
                      <th className="py-2.5 px-3">Class / Batch</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Scheduled (Absent)</th>
                      <th className="py-2.5 px-3">Attended by (Proxy)</th>
                      <th className="py-2.5 px-3">Remarks / Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredSubstitutions.map((s, idx) => (
                      <tr key={s.id || idx} className="hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                          {s.date} <span className="text-[10px] text-gray-400 font-normal">({s.day})</span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-amber-700 dark:text-amber-300">
                          Period {s.period}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-gray-200">
                          {s.batchName}
                        </td>
                        <td className="py-2.5 px-3 text-gray-700 dark:text-gray-300">
                          {s.subjectName}
                        </td>
                        <td className="py-2.5 px-3 text-red-700 dark:text-red-400 font-medium">
                          {s.scheduledTeacherName}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <Check size={12} /> {s.attendedTeacherName}
                        </td>
                        <td className="py-2.5 px-3 text-gray-500 italic max-w-[180px] truncate" title={s.remarks}>
                          {s.remarks || "Proxy duty covered"}
                        </td>
                      </tr>
                    ))}
                    {filteredSubstitutions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-gray-400">
                          No substitution / proxy arrangements recorded for this timeframe.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendanceReportModal;
