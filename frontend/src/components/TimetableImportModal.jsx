import React, { useState, useMemo } from "react";
import { 
  X, Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, 
  Users, Layers, Sparkles, Loader2, RefreshCw, Check, Pencil, 
  Search, ShieldCheck, AlertTriangle, Eye, RotateCcw, ChevronDown, BookOpen
} from "lucide-react";

/**
 * Fuzzy / case-insensitive string similarity helper with match details
 */
const findBestTeacherMatch = (importedName, systemTeachers) => {
  if (!importedName || !systemTeachers?.length) return null;
  const raw = importedName.trim().toLowerCase();
  const cleanImported = raw.replace(/^(usthad|mr\.|mrs\.|dr\.|prof\.)\s*/i, "").trim();

  // 1. Exact match
  const exact = systemTeachers.find(
    (t) => t.name.trim().toLowerCase() === raw
  );
  if (exact) return { teacherId: exact._id, type: "exact", teacher: exact };

  // 2. Clean name match (without titles like Usthad/Mr)
  const cleanMatch = systemTeachers.find((t) => {
    const cleanSystem = t.name.trim().toLowerCase().replace(/^(usthad|mr\.|mrs\.|dr\.|prof\.)\s*/i, "").trim();
    return cleanSystem === cleanImported;
  });
  if (cleanMatch) return { teacherId: cleanMatch._id, type: "title_cleaned", teacher: cleanMatch };

  // 3. Substring match
  const partial = systemTeachers.find((t) => {
    const sys = t.name.trim().toLowerCase();
    return sys.includes(cleanImported) || cleanImported.includes(sys);
  });
  if (partial) return { teacherId: partial._id, type: "partial", teacher: partial };

  return null;
};

const findBestBatchMatch = (importedName, systemBatches) => {
  if (!importedName || !systemBatches?.length) return null;
  const clean = importedName.trim().toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ");

  const exact = systemBatches.find(
    (b) => b.name.trim().toLowerCase() === importedName.trim().toLowerCase()
  );
  if (exact) return exact._id;

  const partial = systemBatches.find((b) => {
    const sys = b.name.trim().toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ");
    return sys === clean || sys.includes(clean) || clean.includes(sys);
  });
  if (partial) return partial._id;

  return null;
};

const TimetableImportModal = ({
  isOpen,
  onClose,
  systemTeachers = [],
  systemBatches = [],
  onImportSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(1); // 1: Upload, 2: Verify & Edit Mapping
  const [jsonText, setJsonText] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mappings
  const [teacherMappings, setTeacherMappings] = useState({}); // { [importedName]: staffId }
  const [batchMappings, setBatchMappings] = useState({});     // { [importedClassName]: batchId }

  // Verification State: tracks which teachers have been confirmed by user
  const [verifiedTeachers, setVerifiedTeachers] = useState({}); // { [importedName]: boolean }
  
  // Inline editing row identifier
  const [editingTeacherKey, setEditingTeacherKey] = useState(null);
  const [teacherFilter, setTeacherFilter] = useState("all"); // "all" | "unverified" | "verified"
  const [teacherSearch, setTeacherSearch] = useState("");

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setJsonText(content);
        parseTimetableJSON(content);
      }
    };
    reader.readAsText(file);
  };

  const parseTimetableJSON = (rawText) => {
    setParseError(null);
    try {
      const parsed = JSON.parse(rawText);

      let slots = [];
      let metadata = parsed.metadata || {};
      let title = parsed.title || metadata.title || "Imported Timetable";

      if (Array.isArray(parsed.schedule)) {
        slots = parsed.schedule;
      } else if (Array.isArray(parsed.slots)) {
        slots = parsed.slots;
      } else if (Array.isArray(parsed)) {
        slots = parsed;
      } else if (parsed.grid && typeof parsed.grid === "object") {
        Object.entries(parsed.grid).forEach(([day, periods]) => {
          if (Array.isArray(periods)) {
            periods.forEach((row, periodIndex) => {
              if (row && typeof row === "object") {
                Object.entries(row).forEach(([batchName, slotInfo]) => {
                  if (slotInfo) {
                    slots.push({
                      day,
                      period: periodIndex,
                      class_name: batchName,
                      subject_name: typeof slotInfo === "object" ? slotInfo.subject || slotInfo.subjectName : "Subject",
                      teacher_name: typeof slotInfo === "object" ? slotInfo.teacher || slotInfo.teacherName : String(slotInfo),
                    });
                  }
                });
              }
            });
          }
        });
      }

      if (slots.length === 0) {
        throw new Error("No timetable slots could be found in the provided JSON.");
      }

      // Collect rich teacher and batch stats
      const teacherStats = {};
      const batchStats = {};

      slots.forEach((s) => {
        const tName = (s.teacher_name || s.teacher_id || "Unassigned").trim();
        const bName = (s.class_name || s.class_id || s.batchName || "Class").trim();
        const subName = (s.subject_name || s.subject_id || "").trim();

        if (tName && tName !== "Unassigned") {
          if (!teacherStats[tName]) {
            teacherStats[tName] = {
              name: tName,
              count: 0,
              subjects: new Set(),
              batches: new Set(),
            };
          }
          teacherStats[tName].count += 1;
          if (subName) teacherStats[tName].subjects.add(subName);
          if (bName) teacherStats[tName].batches.add(bName);
        }

        if (bName) {
          if (!batchStats[bName]) {
            batchStats[bName] = { name: bName, count: 0, subjects: new Set() };
          }
          batchStats[bName].count += 1;
          if (subName) batchStats[bName].subjects.add(subName);
        }
      });

      // Auto-match teachers with confidence indicators
      const initialTeacherMappings = {};
      const initialVerified = {};
      const teacherDetails = [];

      Object.values(teacherStats).forEach((t) => {
        const match = findBestTeacherMatch(t.name, systemTeachers);
        if (match) {
          initialTeacherMappings[t.name] = String(match.teacherId);
          // Auto-verify exact matches for convenience, flag partials for review
          if (match.type === "exact") {
            initialVerified[t.name] = true;
          }
        }
        teacherDetails.push({
          name: t.name,
          count: t.count,
          subjects: Array.from(t.subjects),
          batches: Array.from(t.batches),
          matchType: match?.type || null,
        });
      });

      // Auto-match batches
      const initialBatchMappings = {};
      Object.values(batchStats).forEach((b) => {
        const match = findBestBatchMatch(b.name, systemBatches);
        if (match) {
          initialBatchMappings[b.name] = String(match);
        }
      });

      setTeacherMappings(initialTeacherMappings);
      setVerifiedTeachers(initialVerified);
      setBatchMappings(initialBatchMappings);

      setParsedData({
        title,
        metadata,
        slots,
        uniqueTeachers: teacherDetails,
        uniqueBatches: Object.values(batchStats).map((b) => ({
          name: b.name,
          count: b.count,
          subjects: Array.from(b.subjects),
        })),
      });

      setActiveStep(2);
    } catch (err) {
      console.error("Parse error:", err);
      setParseError(err.message || "Invalid JSON format. Please check the file.");
    }
  };

  const handleTeacherMappingChange = (importedName, staffId) => {
    setTeacherMappings((prev) => ({
      ...prev,
      [importedName]: staffId || null,
    }));
    // When manually selecting or re-assigning, mark as verified
    if (staffId) {
      setVerifiedTeachers((prev) => ({
        ...prev,
        [importedName]: true,
      }));
    } else {
      setVerifiedTeachers((prev) => ({
        ...prev,
        [importedName]: false,
      }));
    }
  };

  const toggleTeacherVerification = (importedName) => {
    setVerifiedTeachers((prev) => ({
      ...prev,
      [importedName]: !prev[importedName],
    }));
  };

  const verifyAllTeachers = () => {
    const all = {};
    parsedData?.uniqueTeachers?.forEach((t) => {
      if (teacherMappings[t.name]) {
        all[t.name] = true;
      }
    });
    setVerifiedTeachers(all);
  };

  const handleBatchMappingChange = (importedClassName, batchId) => {
    setBatchMappings((prev) => ({
      ...prev,
      [importedClassName]: batchId || null,
    }));
  };

  const handleConfirmImport = async () => {
    if (!parsedData?.slots?.length) return;
    setIsSubmitting(true);
    try {
      await onImportSuccess({
        slots: parsedData.slots,
        teacherMappings,
        batchMappings,
        metadata: parsedData.metadata,
        title: parsedData.title,
      });
      onClose();
    } catch (err) {
      console.error("Import failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered teachers for verification list
  const filteredTeachers = useMemo(() => {
    if (!parsedData?.uniqueTeachers) return [];
    return parsedData.uniqueTeachers.filter((t) => {
      const isVerified = Boolean(verifiedTeachers[t.name]);
      const matchesFilter =
        teacherFilter === "all" ||
        (teacherFilter === "verified" && isVerified) ||
        (teacherFilter === "unverified" && !isVerified);

      if (!matchesFilter) return false;

      if (!teacherSearch.trim()) return true;
      const q = teacherSearch.toLowerCase();
      const mappedTeacher = systemTeachers.find((st) => String(st._id) === String(teacherMappings[t.name]));
      return (
        t.name.toLowerCase().includes(q) ||
        mappedTeacher?.name?.toLowerCase().includes(q) ||
        t.subjects.some((s) => s.toLowerCase().includes(q)) ||
        t.batches.some((b) => b.toLowerCase().includes(q))
      );
    });
  }, [parsedData, verifiedTeachers, teacherFilter, teacherSearch, teacherMappings, systemTeachers]);

  const totalTeachersCount = parsedData?.uniqueTeachers?.length || 0;
  const verifiedCount = Object.keys(verifiedTeachers).filter(
    (k) => verifiedTeachers[k] && teacherMappings[k]
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#11322f] w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-100 dark:border-[#0d2522] overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-[#0d2522] flex items-center justify-between bg-gray-50/50 dark:bg-[#0d2522]/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-teal/10 text-brand-teal dark:text-brand-mint">
              <Upload size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-oswald">
                Import Timetable & Verify Teachers
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Confirm auto-synced teacher mappings, edit assignments, and connect weekly schedules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex border-b border-gray-100 dark:border-[#0d2522] text-xs font-semibold">
          <button
            onClick={() => setActiveStep(1)}
            className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center gap-2 ${
              activeStep === 1
                ? "border-brand-teal text-brand-teal dark:text-brand-mint bg-brand-teal/5"
                : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-brand-teal/20 text-brand-teal dark:text-brand-mint flex items-center justify-center text-[11px] font-bold">
              1
            </span>
            Upload / Paste Timetable JSON
          </button>
          <button
            disabled={!parsedData}
            onClick={() => parsedData && setActiveStep(2)}
            className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center gap-2 ${
              activeStep === 2
                ? "border-brand-teal text-brand-teal dark:text-brand-mint bg-brand-teal/5"
                : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-40"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-brand-teal/20 text-brand-teal dark:text-brand-mint flex items-center justify-center text-[11px] font-bold">
              2
            </span>
            Verify Teachers & Classes ({verifiedCount}/{totalTeachersCount} Confirmed)
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-slim">
          {activeStep === 1 && (
            <div className="space-y-6">
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-8 text-center hover:border-brand-teal dark:hover:border-brand-mint transition-colors bg-gray-50/50 dark:bg-[#0d2522]/30 flex flex-col items-center justify-center group">
                <div className="w-16 h-16 rounded-2xl bg-brand-teal/10 dark:bg-white/5 flex items-center justify-center text-brand-teal dark:text-brand-mint mb-4 group-hover:scale-110 transition-transform">
                  <FileText size={32} />
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Choose Timetable Export File
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-4">
                  Upload the <code className="text-brand-teal dark:text-brand-mint font-semibold">timetable-export-*.json</code> file exported from the Timetable Generator project.
                </p>
                <label className="cursor-pointer px-4 py-2 bg-brand-teal text-white rounded-xl text-xs font-semibold hover:bg-brand-teal/90 transition shadow-sm active:scale-95 inline-flex items-center gap-2">
                  <Upload size={14} />
                  Browse JSON File
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Or Paste JSON */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Or Paste Export JSON
                </label>
                <textarea
                  rows={6}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder={`{\n  "schedule": [\n    {\n      "day": "Saturday",\n      "period": 0,\n      "class_name": "Batch 15",\n      "subject_name": "Fiqh",\n      "teacher_name": "Usthad Irshad"\n    }\n  ]\n}`}
                  className="w-full font-mono text-xs p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2522] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                />
              </div>

              {parseError && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs border border-red-200 dark:border-red-800/40">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!jsonText.trim()}
                  onClick={() => parseTimetableJSON(jsonText)}
                  className="px-5 py-2.5 bg-brand-teal text-white rounded-xl text-sm font-semibold hover:bg-brand-teal/90 transition disabled:opacity-40 flex items-center gap-2 shadow-sm"
                >
                  Verify Teachers & Sync
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {activeStep === 2 && parsedData && (
            <div className="space-y-6">
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-brand-teal/10 dark:bg-white/5 border border-brand-teal/20 text-center">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Periods
                  </p>
                  <p className="text-2xl font-black text-brand-teal dark:text-brand-mint font-oswald mt-0.5">
                    {parsedData.slots.length}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-brand-teal/10 dark:bg-white/5 border border-brand-teal/20 text-center">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Teachers
                  </p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white font-oswald mt-0.5">
                    {totalTeachersCount}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 text-center">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Confirmed
                  </p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-oswald mt-0.5">
                    {verifiedCount} / {totalTeachersCount}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-brand-teal/10 dark:bg-white/5 border border-brand-teal/20 text-center">
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Classes
                  </p>
                  <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-oswald mt-0.5">
                    {parsedData.uniqueBatches.length}
                  </p>
                </div>
              </div>

              {/* Teacher Verification Box */}
              <div className="bg-white dark:bg-[#0d2522] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-sm">
                {/* Section Header with Actions & Search */}
                <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-gray-200/60 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                        Verify Teacher Auto-Sync & Assignments
                      </h4>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Verify each teacher's auto-matched faculty account or click <span className="font-semibold text-brand-teal dark:text-brand-mint">Edit</span> to change.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Filter Tabs */}
                    <div className="flex items-center bg-gray-200/70 dark:bg-white/10 p-0.5 rounded-xl text-[11px] font-semibold">
                      <button
                        onClick={() => setTeacherFilter("all")}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          teacherFilter === "all"
                            ? "bg-white dark:bg-[#11322f] text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        All ({totalTeachersCount})
                      </button>
                      <button
                        onClick={() => setTeacherFilter("unverified")}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          teacherFilter === "unverified"
                            ? "bg-white dark:bg-[#11322f] text-amber-600 shadow-sm"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        Review ({totalTeachersCount - verifiedCount})
                      </button>
                      <button
                        onClick={() => setTeacherFilter("verified")}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          teacherFilter === "verified"
                            ? "bg-white dark:bg-[#11322f] text-emerald-600 shadow-sm"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        Confirmed ({verifiedCount})
                      </button>
                    </div>

                    {/* Verify All Button */}
                    <button
                      type="button"
                      onClick={verifyAllTeachers}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Check size={14} />
                      Verify All Auto-Matches
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="px-4 py-2.5 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
                  <Search size={14} className="text-gray-400" />
                  <input
                    type="text"
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    placeholder="Search by teacher name, subject, or class..."
                    className="w-full text-xs bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
                  />
                  {teacherSearch && (
                    <button
                      onClick={() => setTeacherSearch("")}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Teacher List */}
                <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-80 overflow-y-auto scrollbar-slim">
                  {filteredTeachers.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-500">
                      No teachers found matching your filter.
                    </div>
                  ) : (
                    filteredTeachers.map((t) => {
                      const mappedStaffId = teacherMappings[t.name];
                      const mappedStaff = systemTeachers.find((st) => String(st._id) === String(mappedStaffId));
                      const isVerified = Boolean(verifiedTeachers[t.name]);
                      const isEditing = editingTeacherKey === t.name;

                      return (
                        <div
                          key={t.name}
                          className={`p-4 transition flex flex-col gap-3 ${
                            isVerified
                              ? "bg-emerald-50/20 dark:bg-emerald-950/10"
                              : mappedStaff
                              ? "bg-amber-50/20 dark:bg-amber-950/10"
                              : "hover:bg-gray-50/50 dark:hover:bg-white/5"
                          }`}
                        >
                          {/* Row Top */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Left: Teacher Details */}
                            <div className="flex items-start gap-3">
                              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                                isVerified
                                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                                  : mappedStaff
                                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                                  : "bg-gray-100 dark:bg-white/10 text-gray-500"
                              }`}>
                                {t.name.slice(0, 2).toUpperCase()}
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                                    {t.name}
                                  </span>

                                  {/* Status Badges */}
                                  {isVerified ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                                      <CheckCircle2 size={11} />
                                      Confirmed
                                    </span>
                                  ) : mappedStaff ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                                      <AlertTriangle size={11} />
                                      Auto-Matched (Verify)
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                                      Unmapped
                                    </span>
                                  )}

                                  <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                    • {t.count} weekly periods
                                  </span>
                                </div>

                                {/* Subjects & Classes tags */}
                                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                  {t.subjects.slice(0, 3).map((sub) => (
                                    <span
                                      key={sub}
                                      className="text-[10px] font-medium bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md"
                                    >
                                      📖 {sub}
                                    </span>
                                  ))}
                                  {t.subjects.length > 3 && (
                                    <span className="text-[10px] text-gray-400">
                                      +{t.subjects.length - 3} more
                                    </span>
                                  )}
                                  <span className="text-[11px] text-gray-300 dark:text-gray-600">|</span>
                                  {t.batches.map((batch) => (
                                    <span
                                      key={batch}
                                      className="text-[10px] font-medium bg-brand-teal/5 text-brand-teal dark:text-brand-mint px-2 py-0.5 rounded-md"
                                    >
                                      🏫 {batch}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Right: Assigned Target + Actions */}
                            <div className="flex items-center gap-2 self-start sm:self-center ml-12 sm:ml-0">
                              {mappedStaff ? (
                                <div className="text-right hidden md:block">
                                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                    {mappedStaff.name}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    {mappedStaff.userName ? `@${mappedStaff.userName}` : "Staff Member"}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400 italic hidden md:block">
                                  No system teacher selected
                                </span>
                              )}

                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => setEditingTeacherKey(isEditing ? null : t.name)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1 ${
                                  isEditing
                                    ? "bg-brand-teal text-white border-brand-teal"
                                    : "bg-white dark:bg-[#11322f] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 border-gray-200 dark:border-white/10"
                                }`}
                                title="Edit mapping"
                              >
                                <Pencil size={13} />
                                <span>{isEditing ? "Close" : "Edit"}</span>
                              </button>

                              {/* Verification Toggle */}
                              {mappedStaff && (
                                <button
                                  type="button"
                                  onClick={() => toggleTeacherVerification(t.name)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-sm ${
                                    isVerified
                                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                      : "bg-amber-500 hover:bg-amber-600 text-white"
                                  }`}
                                  title={isVerified ? "Click to unconfirm" : "Click to confirm this match"}
                                >
                                  <Check size={13} />
                                  <span>{isVerified ? "Confirmed" : "Confirm"}</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Inline Edit Panel (Appears when user clicks Edit) */}
                          {isEditing && (
                            <div className="mt-2 p-3.5 bg-white dark:bg-[#11322f] rounded-xl border border-brand-teal/30 dark:border-brand-mint/30 shadow-sm animate-fadeIn">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex-1">
                                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    Select Faculty Account for "{t.name}":
                                  </label>
                                  <select
                                    value={mappedStaffId || ""}
                                    onChange={(e) => handleTeacherMappingChange(t.name, e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0d2522] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 font-medium"
                                  >
                                    <option value="">-- Leave as Unmapped (Keep External Name) --</option>
                                    {systemTeachers.map((st) => (
                                      <option key={st._id} value={st._id}>
                                        {st.name} {st.userName ? `(@${st.userName})` : ""}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-end pt-4">
                                  {mappedStaffId && (
                                    <button
                                      type="button"
                                      onClick={() => handleTeacherMappingChange(t.name, "")}
                                      className="px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
                                    >
                                      Clear Match
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingTeacherKey(null);
                                      if (mappedStaffId) {
                                        setVerifiedTeachers((p) => ({ ...p, [t.name]: true }));
                                      }
                                    }}
                                    className="px-4 py-2 bg-brand-teal text-white text-xs font-semibold rounded-xl hover:bg-brand-teal/90 transition shadow-sm"
                                  >
                                    Done
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Batch Mapping Section */}
              <div className="bg-white dark:bg-[#0d2522] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 bg-gray-50 dark:bg-white/5 border-b border-gray-200/60 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-brand-teal dark:text-brand-mint" />
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      Classes / Batches Mapping ({parsedData.uniqueBatches.length})
                    </h4>
                  </div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-56 overflow-y-auto">
                  {parsedData.uniqueBatches.map(({ name, count, subjects }) => {
                    const mappedId = batchMappings[name];
                    const mappedBatch = systemBatches.find((b) => String(b._id) === String(mappedId));

                    return (
                      <div
                        key={name}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-xs text-gray-800 dark:text-gray-200">
                            {name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            ({count} periods scheduled)
                          </span>
                          {mappedBatch && (
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                              ✓ Matched to {mappedBatch.name}
                            </span>
                          )}
                        </div>

                        <div className="w-full sm:w-64">
                          <select
                            value={mappedId || ""}
                            onChange={(e) => handleBatchMappingChange(name, e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#11322f] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 font-medium"
                          >
                            <option value="">-- Match by Name --</option>
                            {systemBatches.map((b) => (
                              <option key={b._id} value={b._id}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Confirmation Bar */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    verifiedCount === totalTeachersCount && totalTeachersCount > 0
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                  }`}>
                    {verifiedCount === totalTeachersCount && totalTeachersCount > 0 ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <AlertTriangle size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {verifiedCount === totalTeachersCount && totalTeachersCount > 0
                        ? "All teachers confirmed!"
                        : `${totalTeachersCount - verifiedCount} teacher${totalTeachersCount - verifiedCount > 1 ? "s" : ""} pending review`}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Confirmed teachers will have their weekly timetables synchronized immediately.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleConfirmImport}
                    className="px-6 py-2.5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Importing & Syncing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        Confirm & Import Timetable
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableImportModal;
