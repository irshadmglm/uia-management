import React, { useState, useMemo } from "react";
import { 
  X, Search, UserCheck, ArrowRight, RefreshCw, 
  Check, AlertCircle, ShieldAlert, Sparkles, MessageSquare 
} from "lucide-react";

const SubstituteTeacherModal = ({
  isOpen,
  onClose,
  slotData,
  allTeachers = [],
  onConfirmSubstitution,
  onResetOriginal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedTeacherName, setSelectedTeacherName] = useState("");
  const [customTeacherName, setCustomTeacherName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [useCustomName, setUseCustomName] = useState(false);

  // Initialize selection when opened
  React.useEffect(() => {
    if (slotData) {
      setSelectedTeacherId(slotData.attendedTeacherId?._id || slotData.attendedTeacherId || "");
      setSelectedTeacherName(slotData.attendedTeacherName || slotData.scheduledTeacherName || "");
      setCustomTeacherName("");
      setUseCustomName(false);
      setRemarks(slotData.remarks || "");
    }
  }, [slotData, isOpen]);

  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return allTeachers;
    const q = searchQuery.toLowerCase();
    return allTeachers.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.userName?.toLowerCase().includes(q) ||
        t.phoneNumber?.includes(q)
    );
  }, [allTeachers, searchQuery]);

  if (!isOpen || !slotData) return null;

  const scheduledName = slotData.scheduledTeacherName || "No Teacher Assigned";
  const isCurrentlySubstituted = slotData.isSubstituted;

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacherId(teacher._id);
    setSelectedTeacherName(teacher.name);
    setUseCustomName(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = useCustomName ? customTeacherName.trim() : selectedTeacherName.trim();
    if (!finalName) {
      alert("Please select or enter a teacher name.");
      return;
    }

    onConfirmSubstitution({
      recordId: slotData._id,
      attendedTeacherId: useCustomName ? null : selectedTeacherId,
      attendedTeacherName: finalName,
      remarks: remarks.trim(),
    });
    onClose();
  };

  const handleReset = () => {
    onResetOriginal(slotData._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                Assign Substitute / Change Teacher
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Period {slotData.period} • {slotData.batchName} • {slotData.subjectName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scheduled Teacher Banner */}
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="text-xs text-gray-600 dark:text-gray-300">
            <span className="font-medium text-gray-400">Scheduled:</span>{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-100">{scheduledName}</span>
          </div>
          {isCurrentlySubstituted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Currently Substituted
            </span>
          )}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Custom Teacher Toggle */}
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-gray-700 dark:text-gray-300">
              Select Attending Teacher
            </label>
            <button
              type="button"
              onClick={() => setUseCustomName(!useCustomName)}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              {useCustomName ? "Choose from Staff list" : "Enter unlisted/guest teacher"}
            </button>
          </div>

          {useCustomName ? (
            <div>
              <input
                type="text"
                placeholder="Enter guest or external teacher name..."
                value={customTeacherName}
                onChange={(e) => setCustomTeacherName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />
            </div>
          ) : (
            <div className="space-y-2">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search registered teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Teachers List */}
              <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl">
                {filteredTeachers.map((t) => {
                  const isSelected = selectedTeacherId === t._id;
                  const isOriginal = slotData.scheduledTeacherId?._id === t._id || slotData.scheduledTeacherName === t.name;

                  return (
                    <button
                      key={t._id}
                      type="button"
                      onClick={() => handleSelectTeacher(t)}
                      className={`w-full px-3 py-2.5 flex items-center justify-between text-left text-sm transition-colors ${
                        isSelected
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/80 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center font-bold text-xs uppercase">
                          {t.name.slice(0, 2)}
                        </div>
                        <div>
                          <div>{t.name}</div>
                          {t.phoneNumber && (
                            <div className="text-[11px] text-gray-400">{t.phoneNumber}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isOriginal && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                            Scheduled
                          </span>
                        )}
                        {isSelected && <Check size={16} className="text-amber-600 dark:text-amber-400" />}
                      </div>
                    </button>
                  );
                })}
                {filteredTeachers.length === 0 && (
                  <div className="p-4 text-center text-xs text-gray-400">
                    No matching teachers found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Preview Pill */}
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Attended Teacher:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {useCustomName ? customTeacherName || "(None)" : selectedTeacherName || "(None)"}
            </span>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Remarks / Substitution Note (Optional)
            </label>
            <div className="relative">
              <MessageSquare size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., Substituted due to emergency, covered chapter 4..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
            {isCurrentlySubstituted ? (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={13} />
                Restore Original
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
              >
                Save Attendance & Substitute
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubstituteTeacherModal;

