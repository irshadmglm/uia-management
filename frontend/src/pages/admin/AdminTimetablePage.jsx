import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, Upload, Download, Printer, Trash2, Users, Layers, 
  Search, Clock, BookOpen, CheckCircle, RefreshCw, AlertCircle, UserCheck 
} from "lucide-react";
import { useTimetableStore } from "../../store/useTimetableStore";
import { useStaffStore } from "../../store/useStaffStore";
import { useAdminStore } from "../../store/useAdminMngStore";
import TimetableImportModal from "../../components/TimetableImportModal";

const DEFAULT_WEEKDAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const AdminTimetablePage = () => {
  const { timetable, isLoading, fetchTimetable, importTimetableData, clearTimetable } = useTimetableStore();
  const { teachers, getTeachers } = useStaffStore();
  const { batches, getBatches } = useAdminStore();

  const [viewMode, setViewMode] = useState("master"); // "master" | "batch" | "teacher"
  const [selectedDay, setSelectedDay] = useState("Saturday");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    fetchTimetable();
    getTeachers();
    getBatches();
  }, [fetchTimetable, getTeachers, getBatches]);

  const activeBatches = useMemo(() => batches.filter((b) => b.isActive !== false), [batches]);

  const weekdays = useMemo(() => {
    return timetable?.metadata?.weekdays?.length ? timetable.metadata.weekdays : DEFAULT_WEEKDAYS;
  }, [timetable]);

  const periodsCount = timetable?.metadata?.periodsCount || 4;
  const periodTimes = timetable?.metadata?.periodTimes || [];

  // Set default selections once data loads
  useEffect(() => {
    if (!selectedDay && weekdays.length > 0) {
      setSelectedDay(weekdays[0]);
    }
  }, [weekdays, selectedDay]);

  useEffect(() => {
    if (!selectedBatch && activeBatches.length > 0) {
      setSelectedBatch(activeBatches[0].name);
    }
  }, [activeBatches, selectedBatch]);

  useEffect(() => {
    if (!selectedTeacherId && teachers.length > 0) {
      setSelectedTeacherId(teachers[0]._id);
    }
  }, [teachers, selectedTeacherId]);

  // Normalized slots
  const allSlots = useMemo(() => timetable?.slots || [], [timetable]);

  // Master Grid data for selectedDay: rows = activeBatches, cols = periods
  const masterDayGrid = useMemo(() => {
    const gridData = {};
    activeBatches.forEach((b) => {
      gridData[b.name] = Array.from({ length: periodsCount }, () => null);
    });

    // Populate from timetable.slots
    allSlots.forEach((slot) => {
      if (slot.day === selectedDay && slot.period < periodsCount) {
        if (!gridData[slot.batchName]) {
          gridData[slot.batchName] = Array.from({ length: periodsCount }, () => null);
        }
        gridData[slot.batchName][slot.period] = slot;
      }
    });

    // Fallback: check 2D grid in timetable.grid
    if (timetable?.grid?.[selectedDay]) {
      const dayRow = timetable.grid[selectedDay];
      if (Array.isArray(dayRow)) {
        dayRow.forEach((periodMap, pIdx) => {
          if (periodMap && typeof periodMap === "object") {
            Object.entries(periodMap).forEach(([bName, val]) => {
              if (val && (!gridData[bName] || !gridData[bName][pIdx])) {
                if (!gridData[bName]) {
                  gridData[bName] = Array.from({ length: periodsCount }, () => null);
                }
                gridData[bName][pIdx] = typeof val === "object" ? {
                  subjectName: val.subject || val.subjectName,
                  teacherName: val.teacher || val.teacherName,
                  room: val.room,
                  color: val.color,
                } : {
                  subjectName: "Subject",
                  teacherName: String(val),
                };
              }
            });
          }
        });
      }
    }

    return gridData;
  }, [activeBatches, periodsCount, allSlots, selectedDay, timetable]);

  // Filter master grid by searchQuery
  const filteredBatches = useMemo(() => {
    if (!searchQuery.trim()) return Object.keys(masterDayGrid);
    const q = searchQuery.toLowerCase();

    return Object.keys(masterDayGrid).filter((bName) => {
      if (bName.toLowerCase().includes(q)) return true;
      const slots = masterDayGrid[bName] || [];
      return slots.some(
        (s) =>
          s &&
          (s.subjectName?.toLowerCase().includes(q) ||
            s.teacherName?.toLowerCase().includes(q) ||
            s.room?.toLowerCase().includes(q))
      );
    });
  }, [masterDayGrid, searchQuery]);

  // Single Batch weekly schedule (weekdays x periods)
  const batchWeeklySchedule = useMemo(() => {
    if (!selectedBatch) return {};
    const schedule = {};
    weekdays.forEach((day) => {
      schedule[day] = Array.from({ length: periodsCount }, () => null);
    });

    allSlots.forEach((slot) => {
      if (
        slot.batchName.toLowerCase() === selectedBatch.toLowerCase() &&
        schedule[slot.day] &&
        slot.period < periodsCount
      ) {
        schedule[slot.day][slot.period] = slot;
      }
    });
    return schedule;
  }, [selectedBatch, weekdays, periodsCount, allSlots]);

  // Single Teacher weekly schedule
  const teacherWeeklySchedule = useMemo(() => {
    if (!selectedTeacherId) return { schedule: {}, teacher: null, totalPeriods: 0 };
    const teacher = teachers.find((t) => String(t._id) === String(selectedTeacherId));
    const teacherNameLower = (teacher?.name || "").trim().toLowerCase();

    const schedule = {};
    weekdays.forEach((day) => {
      schedule[day] = Array.from({ length: periodsCount }, () => null);
    });

    let total = 0;
    allSlots.forEach((slot) => {
      const matchId = slot.teacherId && String(slot.teacherId) === String(selectedTeacherId);
      const matchName = slot.teacherName && slot.teacherName.trim().toLowerCase() === teacherNameLower;

      if ((matchId || matchName) && schedule[slot.day] && slot.period < periodsCount) {
        schedule[slot.day][slot.period] = slot;
        total += 1;
      }
    });

    return { schedule, teacher, totalPeriods: total };
  }, [selectedTeacherId, teachers, weekdays, periodsCount, allSlots]);

  // Export Timetable as JSON
  const handleExportJSON = () => {
    const exportPayload = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      metadata: timetable?.metadata || { weekdays, periodsCount, periodTimes },
      slots: allSlots,
      grid: timetable?.grid || {},
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `uia-timetable-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-teal/10 dark:bg-[#11322f] rounded-2xl text-brand-teal dark:text-brand-mint shadow-sm">
            <Calendar size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-oswald tracking-tight">
              Timetable Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Master scheduling, teacher weekly assignments, and timetable import
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <Link
            to="/dashboard/admin/teacher-attendance"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <UserCheck size={16} />
            <span>Mark Attendance</span>
          </Link>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-brand-teal to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <Upload size={16} />
            <span>Import Timetable</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-white dark:bg-[#11322f] hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm active:scale-95 flex items-center gap-1.5"
            title="Export Timetable as JSON"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2.5 bg-white dark:bg-[#11322f] hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 rounded-xl transition shadow-sm active:scale-95"
            title="Print Timetable"
          >
            <Printer size={16} />
          </button>

          {allSlots.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear the entire timetable?")) {
                  clearTimetable();
                }
              }}
              className="p-2.5 bg-white dark:bg-[#11322f] hover:bg-red-50 dark:hover:bg-red-950/30 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-red-500 rounded-xl transition shadow-sm"
              title="Clear Timetable"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:hidden">
        <div className="p-4 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Total Slots
          </p>
          <p className="text-2xl font-black text-gray-900 dark:text-white font-oswald mt-0.5">
            {allSlots.length}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Active Batches
          </p>
          <p className="text-2xl font-black text-brand-teal dark:text-brand-mint font-oswald mt-0.5">
            {activeBatches.length}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Assigned Teachers
          </p>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-oswald mt-0.5">
            {[...new Set(allSlots.map((s) => s.teacherName).filter(Boolean))].length}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Imported Date
          </p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-2 truncate">
            {timetable?.metadata?.importedAt
              ? new Date(timetable.metadata.importedAt).toLocaleDateString()
              : "Manual / Default"}
          </p>
        </div>
      </div>

      {/* View Switcher & Filters */}
      <div className="bg-white dark:bg-[#11322f] p-3 sm:p-4 rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 print:hidden">
        {/* View Mode Pills */}
        <div className="flex items-center bg-gray-100 dark:bg-[#0d2522] p-1 rounded-xl">
          <button
            onClick={() => setViewMode("master")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "master"
                ? "bg-white dark:bg-[#11322f] text-brand-teal dark:text-brand-mint shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Master View
          </button>
          <button
            onClick={() => setViewMode("batch")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "batch"
                ? "bg-white dark:bg-[#11322f] text-brand-teal dark:text-brand-mint shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Class / Batch View
          </button>
          <button
            onClick={() => setViewMode("teacher")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "teacher"
                ? "bg-white dark:bg-[#11322f] text-brand-teal dark:text-brand-mint shadow-sm"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Teacher View
          </button>
        </div>

        {/* Dynamic Controls depending on viewMode */}
        <div className="flex flex-wrap items-center gap-2">
          {viewMode === "master" && (
            <>
              {/* Day Selector */}
              <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
                {weekdays.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                      selectedDay === day
                        ? "bg-brand-teal text-white shadow-sm"
                        : "bg-gray-100 dark:bg-[#0d2522] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subject / teacher..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0d2522] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 w-44 sm:w-56"
                />
              </div>
            </>
          )}

          {viewMode === "batch" && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Class:</span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0d2522] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
              >
                {activeBatches.map((b) => (
                  <option key={b._id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {viewMode === "teacher" && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Teacher:</span>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0d2522] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 max-w-[220px]"
              >
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* MAIN VIEW CONTENT */}
      {viewMode === "master" && (
        <div className="bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-[#0d2522] flex items-center justify-between">
            <h2 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-brand-teal" />
              <span>{selectedDay} Master Schedule</span>
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {filteredBatches.length} Classes scheduled
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-[#0d2522]/80 border-b border-gray-200/80 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <th className="py-3 px-4 w-36">Class / Batch</th>
                  {Array.from({ length: periodsCount }).map((_, pIdx) => (
                    <th key={pIdx} className="py-3 px-4 text-center">
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
                {filteredBatches.map((batchName) => {
                  const slots = masterDayGrid[batchName] || [];
                  return (
                    <tr
                      key={batchName}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition"
                    >
                      <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-brand-teal"></div>
                          <span>{batchName}</span>
                        </div>
                      </td>

                      {Array.from({ length: periodsCount }).map((_, pIdx) => {
                        const slot = slots[pIdx];
                        return (
                          <td key={pIdx} className="p-2 text-center align-top">
                            {slot ? (
                              <div
                                style={slot.color ? { borderLeftColor: slot.color } : {}}
                                className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#0d2522] border border-gray-200/60 dark:border-white/10 border-l-4 border-l-brand-teal text-left shadow-sm hover:shadow transition"
                              >
                                <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                                  {slot.subjectName}
                                </p>
                                <p className="text-[11px] font-medium text-brand-teal dark:text-brand-mint truncate mt-0.5">
                                  {slot.teacherName || "Unassigned"}
                                </p>
                                {slot.room && (
                                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                    📍 {slot.room}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="h-14 rounded-xl border border-dashed border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-300 dark:text-gray-600 text-[10px]">
                                —
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

      {viewMode === "batch" && (
        <div className="bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-[#0d2522] flex items-center justify-between">
            <h2 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Layers size={18} className="text-brand-teal" />
              <span>Weekly Schedule — {selectedBatch}</span>
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Weekly Class Matrix
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-[#0d2522]/80 border-b border-gray-200/80 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <th className="py-3 px-4 w-32">Day</th>
                  {Array.from({ length: periodsCount }).map((_, pIdx) => (
                    <th key={pIdx} className="py-3 px-4 text-center">
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
                  const slots = batchWeeklySchedule[day] || [];
                  return (
                    <tr key={day} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition">
                      <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                        {day}
                      </td>
                      {Array.from({ length: periodsCount }).map((_, pIdx) => {
                        const slot = slots[pIdx];
                        return (
                          <td key={pIdx} className="p-2 text-center align-top">
                            {slot ? (
                              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#0d2522] border border-gray-200/60 dark:border-white/10 border-l-4 border-l-brand-teal text-left shadow-sm">
                                <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                                  {slot.subjectName}
                                </p>
                                <p className="text-[11px] font-medium text-brand-teal dark:text-brand-mint truncate mt-0.5">
                                  👤 {slot.teacherName}
                                </p>
                              </div>
                            ) : (
                              <div className="h-14 rounded-xl border border-dashed border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-300 dark:text-gray-600 text-[10px]">
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

      {viewMode === "teacher" && (
        <div className="bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-[#0d2522] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-teal/10 text-brand-teal dark:text-brand-mint font-bold flex items-center justify-center text-sm">
                {teacherWeeklySchedule.teacher?.name?.slice(0, 2).toUpperCase() || "T"}
              </div>
              <div>
                <h2 className="font-bold text-base text-gray-900 dark:text-white">
                  {teacherWeeklySchedule.teacher?.name || "Teacher"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {teacherWeeklySchedule.totalPeriods} weekly period{teacherWeeklySchedule.totalPeriods !== 1 ? "s" : ""} assigned
                </p>
              </div>
            </div>

            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal dark:text-brand-mint border border-brand-teal/20">
              Weekly Faculty Schedule
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-[#0d2522]/80 border-b border-gray-200/80 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <th className="py-3 px-4 w-32">Day</th>
                  {Array.from({ length: periodsCount }).map((_, pIdx) => (
                    <th key={pIdx} className="py-3 px-4 text-center">
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
                  const slots = teacherWeeklySchedule.schedule[day] || [];
                  return (
                    <tr key={day} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition">
                      <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                        {day}
                      </td>
                      {Array.from({ length: periodsCount }).map((_, pIdx) => {
                        const slot = slots[pIdx];
                        return (
                          <td key={pIdx} className="p-2 text-center align-top">
                            {slot ? (
                              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#0d2522] border border-gray-200/60 dark:border-white/10 border-l-4 border-l-brand-teal text-left shadow-sm">
                                <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                                  {slot.subjectName}
                                </p>
                                <p className="text-[11px] font-medium text-purple-600 dark:text-purple-400 truncate mt-0.5">
                                  🏫 {slot.batchName}
                                </p>
                              </div>
                            ) : (
                              <div className="h-14 rounded-xl border border-dashed border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-300 dark:text-gray-600 text-[10px]">
                                Off
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

      {/* Import Modal */}
      {isImportModalOpen && (
        <TimetableImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          systemTeachers={teachers}
          systemBatches={activeBatches}
          onImportSuccess={importTimetableData}
        />
      )}
    </div>
  );
};

export default AdminTimetablePage;

