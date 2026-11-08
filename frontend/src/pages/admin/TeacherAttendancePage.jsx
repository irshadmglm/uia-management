import React, { useEffect, useState, useMemo } from "react";
import { 
  Calendar, CheckCircle2, XCircle, AlertCircle, RefreshCw, 
  UserCheck, Users, Search, Clock, BookOpen, Layers, Printer, 
  BarChart2, ChevronLeft, ChevronRight, Sparkles, Filter, Check, 
  ShieldAlert, Edit3, MessageSquare, ArrowRight, CheckCheck, Undo2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTeacherAttendanceStore } from "../../store/useTeacherAttendanceStore";
import { useStaffStore } from "../../store/useStaffStore";
import { useTimetableStore } from "../../store/useTimetableStore";
import SubstituteTeacherModal from "../../components/SubstituteTeacherModal";
import TeacherAttendanceReportModal from "../../components/TeacherAttendanceReportModal";

const TeacherAttendancePage = () => {
  const { 
    currentDate, attendance, dayName, isLoading, isSaving,
    fetchAttendance, updateSlot, bulkMark, setCurrentDate 
  } = useTeacherAttendanceStore();

  const { teachers, getTeachers } = useStaffStore();
  const { timetable, fetchTimetable } = useTimetableStore();

  // Local UI State
  const [viewMode, setViewMode] = useState("period"); // "period" | "batch" | "teacher"
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "unmarked" | "present" | "absent" | "substituted"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlotForSub, setSelectedSlotForSub] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    fetchAttendance(currentDate);
    getTeachers();
    fetchTimetable();
  }, [fetchAttendance, getTeachers, fetchTimetable, currentDate]);

  const records = useMemo(() => attendance?.records || [], [attendance]);
  const summary = attendance?.summary || {
    totalSlots: records.length,
    presentCount: records.filter((r) => r.status === "present").length,
    absentCount: records.filter((r) => r.status === "absent").length,
    substitutedCount: records.filter((r) => r.isSubstituted).length,
    unmarkedCount: records.filter((r) => r.status === "unmarked").length,
  };

  // Date Navigation Helpers
  const shiftDate = (days) => {
    const [y, m, d] = currentDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);
    const newY = dateObj.getFullYear();
    const newM = String(dateObj.getMonth() + 1).padStart(2, "0");
    const newD = String(dateObj.getDate()).padStart(2, "0");
    setCurrentDate(`${newY}-${newM}-${newD}`);
  };

  const setToday = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setCurrentDate(`${y}-${m}-${day}`);
  };

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Status Filter
      if (filterStatus === "present" && r.status !== "present") return false;
      if (filterStatus === "absent" && r.status !== "absent") return false;
      if (filterStatus === "substituted" && !r.isSubstituted) return false;
      if (filterStatus === "unmarked" && r.status !== "unmarked") return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const sched = (r.scheduledTeacherName || "").toLowerCase();
        const att = (r.attendedTeacherName || "").toLowerCase();
        const subj = (r.subjectName || "").toLowerCase();
        const batch = (r.batchName || "").toLowerCase();
        return sched.includes(q) || att.includes(q) || subj.includes(q) || batch.includes(q);
      }
      return true;
    });
  }, [records, filterStatus, searchQuery]);

  // Groupings for Different View Modes
  const groupedByPeriod = useMemo(() => {
    const map = {};
    filteredRecords.forEach((r) => {
      if (!map[r.period]) map[r.period] = [];
      map[r.period].push(r);
    });
    return Object.entries(map).sort(([pA], [pB]) => Number(pA) - Number(pB));
  }, [filteredRecords]);

  const groupedByBatch = useMemo(() => {
    const map = {};
    filteredRecords.forEach((r) => {
      const b = r.batchName || "Unassigned Batch";
      if (!map[b]) map[b] = [];
      map[b].push(r);
    });
    return Object.entries(map).sort(([bA], [bB]) => bA.localeCompare(bB));
  }, [filteredRecords]);

  const groupedByTeacher = useMemo(() => {
    const map = {};
    filteredRecords.forEach((r) => {
      const tName = r.attendedTeacherName || r.scheduledTeacherName || "Unassigned Teacher";
      if (!map[tName]) map[tName] = [];
      map[tName].push(r);
    });
    return Object.entries(map).sort(([tA], [tB]) => tA.localeCompare(tB));
  }, [filteredRecords]);

  // Attendance Status Toggles
  const handleSetStatus = (recordId, newStatus) => {
    updateSlot({ recordId, status: newStatus });
  };

  const handleOpenSubstituteModal = (record) => {
    setSelectedSlotForSub(record);
  };

  const handleConfirmSubstitution = ({ recordId, attendedTeacherId, attendedTeacherName, remarks }) => {
    updateSlot({
      recordId,
      attendedTeacherId,
      attendedTeacherName,
      remarks,
      status: "present", // Auto-mark present when substitute is confirmed
    });
  };

  const handleResetOriginalTeacher = (recordId) => {
    const target = records.find((r) => r._id === recordId);
    if (!target) return;
    updateSlot({
      recordId,
      attendedTeacherId: target.scheduledTeacherId?._id || target.scheduledTeacherId || null,
      attendedTeacherName: target.scheduledTeacherName || "",
      remarks: "",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Date Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title & Day Badge */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold shadow-inner">
              <UserCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Teacher Attendance
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                  {dayName || "Active Day"}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Period-wise attendance tracking, substitution (proxy) management & duty registers
              </p>
            </div>
          </div>

          {/* Date Selector & Jump Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 border border-gray-200 dark:border-gray-600">
              <button
                onClick={() => shiftDate(-1)}
                className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
                title="Previous Day"
              >
                <ChevronLeft size={16} />
              </button>

              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="bg-transparent px-2 py-1 text-xs font-semibold text-gray-900 dark:text-white outline-none cursor-pointer"
              />

              <button
                onClick={() => shiftDate(1)}
                className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
                title="Next Day"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              onClick={setToday}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
            >
              Today
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <BarChart2 size={14} />
              Monthly Report
            </button>

            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
              title="Print Daily Sheet"
            >
              <Printer size={16} />
            </button>

            <Link
              to="/dashboard/admin/timetable"
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/20 flex items-center gap-1.5 transition-colors"
            >
              <Calendar size={14} />
              Timetable
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Periods */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Periods</span>
            <Clock size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {summary.totalSlots}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">Scheduled for {dayName}</div>
        </div>

        {/* Present (Attended) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Attended</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
            {summary.presentCount}
          </div>
          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
            {summary.totalSlots > 0 ? Math.round((summary.presentCount / summary.totalSlots) * 100) : 0}% attendance rate
          </div>
        </div>

        {/* Absent */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-red-200 dark:border-red-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">Absent</span>
            <XCircle size={16} className="text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">
            {summary.absentCount}
          </div>
          <div className="text-[11px] text-red-500/80 mt-0.5">Uncovered periods</div>
        </div>

        {/* Substitutions (Proxy) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-amber-200 dark:border-amber-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Substituted (Proxy)</span>
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
            {summary.substitutedCount}
          </div>
          <div className="text-[11px] text-amber-600/80 mt-0.5">Reassigned / proxy taken</div>
        </div>

        {/* Unmarked / Pending */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Pending</span>
            <AlertCircle size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-1">
            {summary.unmarkedCount}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">Awaiting check-in</div>
        </div>
      </div>

      {/* Control Bar: Bulk Actions & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Quick Bulk Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => bulkMark("mark_all_present")}
              disabled={isSaving || records.length === 0}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <CheckCheck size={15} />
              Mark All Scheduled as Attended
            </button>

            <button
              onClick={() => bulkMark("mark_all_absent")}
              disabled={isSaving || records.length === 0}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-900/30 transition-colors"
            >
              Mark All Absent
            </button>

            <button
              onClick={() => bulkMark("reset_defaults")}
              disabled={isSaving || records.length === 0}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 flex items-center gap-1.5 transition-colors"
              title="Reset to timetable defaults"
            >
              <Undo2 size={13} />
              Reset Defaults
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl text-xs font-medium self-start md:self-auto">
            <button
              onClick={() => setViewMode("period")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "period"
                  ? "bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-300 font-bold shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              By Period
            </button>
            <button
              onClick={() => setViewMode("batch")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "batch"
                  ? "bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-300 font-bold shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              By Batch
            </button>
            <button
              onClick={() => setViewMode("teacher")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "teacher"
                  ? "bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-300 font-bold shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              By Teacher
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700/60">
          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterStatus === "all"
                  ? "bg-teal-700 text-white"
                  : "bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              All ({records.length})
            </button>

            <button
              onClick={() => setFilterStatus("unmarked")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterStatus === "unmarked"
                  ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              Unmarked ({summary.unmarkedCount})
            </button>

            <button
              onClick={() => setFilterStatus("present")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterStatus === "present"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              Attended ({summary.presentCount})
            </button>

            <button
              onClick={() => setFilterStatus("absent")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterStatus === "absent"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              Absent ({summary.absentCount})
            </button>

            <button
              onClick={() => setFilterStatus("substituted")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterStatus === "substituted"
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              Proxy / Substituted ({summary.substitutedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search teacher, batch, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="p-16 text-center text-gray-400 flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-teal-600" />
          <span className="text-sm font-medium">Loading attendance schedule...</span>
        </div>
      ) : records.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
            <Calendar size={28} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              No Classes Scheduled for {dayName}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
              Either this day is a holiday/weekend, or no timetable slots are configured for {dayName}.
            </p>
          </div>
          <Link
            to="/dashboard/admin/timetable"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
          >
            Open Timetable Hub
          </Link>
        </div>
      ) : (
        /* Period Slots Display */
        <div className="space-y-6">
          {viewMode === "period" && (
            <div className="space-y-6">
              {groupedByPeriod.map(([periodNum, periodSlots]) => (
                <div 
                  key={periodNum}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Period Header */}
                  <div className="px-5 py-3.5 bg-gray-50/80 dark:bg-gray-700/40 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                        P{periodNum}
                      </span>
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                          Period {periodNum}
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          {periodSlots.length} concurrent classes
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => bulkMark("mark_period_present", periodNum)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 transition-colors"
                    >
                      Mark All P{periodNum} Attended
                    </button>
                  </div>

                  {/* Cards Grid */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {periodSlots.map((slot) => (
                      <AttendanceSlotCard
                        key={slot._id}
                        slot={slot}
                        onSetStatus={handleSetStatus}
                        onOpenSubstitute={handleOpenSubstituteModal}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === "batch" && (
            <div className="space-y-6">
              {groupedByBatch.map(([batchName, batchSlots]) => (
                <div 
                  key={batchName}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="px-5 py-3.5 bg-gray-50/80 dark:bg-gray-700/40 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center">
                        <Layers size={16} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                          {batchName}
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          {batchSlots.length} periods today
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {batchSlots.map((slot) => (
                      <AttendanceSlotCard
                        key={slot._id}
                        slot={slot}
                        onSetStatus={handleSetStatus}
                        onOpenSubstitute={handleOpenSubstituteModal}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === "teacher" && (
            <div className="space-y-6">
              {groupedByTeacher.map(([teacherName, teacherSlots]) => (
                <div 
                  key={teacherName}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="px-5 py-3.5 bg-gray-50/80 dark:bg-gray-700/40 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-600 font-extrabold text-xs flex items-center justify-center uppercase">
                        {teacherName.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                          {teacherName}
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          {teacherSlots.length} class periods assigned / taken today
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {teacherSlots.map((slot) => (
                      <AttendanceSlotCard
                        key={slot._id}
                        slot={slot}
                        onSetStatus={handleSetStatus}
                        onOpenSubstitute={handleOpenSubstituteModal}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Substitute Teacher Selection Modal */}
      {selectedSlotForSub && (
        <SubstituteTeacherModal
          isOpen={Boolean(selectedSlotForSub)}
          onClose={() => setSelectedSlotForSub(null)}
          slotData={selectedSlotForSub}
          allTeachers={teachers}
          onConfirmSubstitution={handleConfirmSubstitution}
          onResetOriginal={handleResetOriginalTeacher}
        />
      )}

      {/* Monthly Report Modal */}
      {isReportModalOpen && (
        <TeacherAttendanceReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
};

/**
 * Individual Period Slot Card Component
 */
const AttendanceSlotCard = ({ slot, onSetStatus, onOpenSubstitute }) => {
  const isPresent = slot.status === "present";
  const isAbsent = slot.status === "absent";
  const isSubstituted = slot.isSubstituted;
  const isUnmarked = slot.status === "unmarked";

  return (
    <div 
      className={`rounded-2xl border p-4 transition-all duration-200 relative flex flex-col justify-between ${
        isPresent
          ? "bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40"
          : isAbsent
          ? "bg-red-50/20 dark:bg-red-950/10 border-red-200 dark:border-red-900/40"
          : isSubstituted
          ? "bg-amber-50/20 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/40"
          : "bg-gray-50/40 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700"
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-teal-600/10 text-teal-700 dark:text-teal-300">
              P{slot.period}
            </span>
            <span className="font-bold text-xs text-gray-900 dark:text-white">
              {slot.batchName}
            </span>
          </div>

          {/* Status Badge */}
          {isPresent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
              <Check size={11} /> Attended
            </span>
          )}
          {isAbsent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
              <XCircle size={11} /> Absent
            </span>
          )}
          {isUnmarked && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              Pending
            </span>
          )}
        </div>

        {/* Subject */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200 mb-2">
          <BookOpen size={14} className="text-teal-600 dark:text-teal-400" />
          <span>{slot.subjectName}</span>
          {slot.room && (
            <span className="text-[11px] font-normal text-gray-400">({slot.room})</span>
          )}
        </div>

        {/* Teacher Details */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 mb-3 space-y-1">
          {isSubstituted ? (
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles size={12} />
                  Attended by (Proxy):
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold">
                  Substitute
                </span>
              </div>
              <div className="font-bold text-sm text-gray-900 dark:text-white mt-0.5">
                {slot.attendedTeacherName}
              </div>
              <div className="text-[11px] text-gray-400">
                Scheduled: {slot.scheduledTeacherName || "Unassigned"}
              </div>
            </div>
          ) : (
            <div>
              <span className="text-[11px] text-gray-400 font-medium">Scheduled Teacher:</span>
              <div className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                <UserCheck size={14} className="text-gray-500" />
                <span>{slot.scheduledTeacherName || "No Teacher Assigned"}</span>
              </div>
            </div>
          )}

          {/* Remarks display if present */}
          {slot.remarks && (
            <div className="pt-1 border-t border-gray-100 dark:border-gray-700/60 text-[11px] text-gray-500 italic flex items-center gap-1">
              <MessageSquare size={11} className="text-gray-400" />
              <span>{slot.remarks}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="pt-1 flex items-center gap-1.5">
        {/* Present Toggle */}
        <button
          type="button"
          onClick={() => onSetStatus(slot._id, isPresent ? "unmarked" : "present")}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            isPresent
              ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
          }`}
        >
          <Check size={13} />
          Attended
        </button>

        {/* Absent Toggle */}
        <button
          type="button"
          onClick={() => onSetStatus(slot._id, isAbsent ? "unmarked" : "absent")}
          className={`py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            isAbsent
              ? "bg-red-600 text-white shadow-sm ring-2 ring-red-500/30"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          }`}
          title="Mark Teacher Absent"
        >
          <XCircle size={13} />
          Absent
        </button>

        {/* Change Teacher / Proxy */}
        <button
          type="button"
          onClick={() => onOpenSubstitute(slot)}
          className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            isSubstituted
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-300"
          }`}
          title="Change Attended Teacher (Proxy)"
        >
          <Edit3 size={13} />
          Proxy
        </button>
      </div>
    </div>
  );
};

export default TeacherAttendancePage;

