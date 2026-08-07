import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMarksStore } from "../../store/useMarksStore";

import { Loader2, Save, CheckCircle, Check, MinusCircle, X, GraduationCap, FileText, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import { FiEdit, FiPlus } from "react-icons/fi";
import { axiosInstance } from "../../lib/axios";

// --- Mark List Modal Component ---
const MarkListModal = ({ 
  semester, 
  isOpen, 
  onClose, 
  ml, 
  handleInputChange, 
  handleAddRow, 
  handleRemoveRow, 
  percentage, 
  isPass, 
  allowingEdit, 
  handleAllowEdit, 
  handleEdit, 
  isDirty, 
  saving, 
  handleApprove, 
  approving 
}) => {
  if (!isOpen || !semester) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#11322f] w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all animate-scaleIn border border-gray-100 dark:border-[#0d2522]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#0d2522] bg-gray-50/50 dark:bg-black/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-teal/10 dark:bg-[#0d2522] rounded-lg text-brand-teal">
              <FileText size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {semester.name} Mark List
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#0d2522] rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 dark:bg-transparent">
          {ml?.subjects?.length > 0 ? (
            <div className="bg-white dark:bg-[#0d2522]/50 rounded-2xl border border-gray-100 dark:border-[#0d2522] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#f3f7f6] dark:bg-[#11322f] text-gray-600 dark:text-gray-300">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Subject</th>
                      <th className="px-4 py-4 font-semibold w-32">Mark</th>
                      <th className="px-4 py-4 font-semibold w-32">Total</th>
                      <th className="px-4 py-4 font-semibold w-24 text-center">Status</th>
                      <th className="px-4 py-4 font-semibold w-20 text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#0d2522]">
                    {ml.subjects.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-[#11322f]/50 transition-colors">
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            value={sub.subject}
                            onChange={(e) => handleInputChange(semester._id, idx, "subject", e.target.value)}
                            placeholder="Subject Name"
                            className="w-full bg-transparent border border-transparent focus:border-brand-teal/30 hover:border-gray-200 dark:hover:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={sub.mark}
                            onChange={(e) => handleInputChange(semester._id, idx, "mark", e.target.value)}
                            placeholder="0"
                            className={`w-full bg-transparent border border-transparent focus:border-brand-teal/30 hover:border-gray-200 dark:hover:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all font-medium ${
                              sub.mark > sub.total ? "text-red-600 dark:text-red-400 font-bold" : "text-gray-900 dark:text-gray-100"
                            }`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={sub.total}
                            onChange={(e) => handleInputChange(semester._id, idx, "total", e.target.value)}
                            placeholder="100"
                            className="w-full bg-transparent border border-transparent focus:border-brand-teal/30 hover:border-gray-200 dark:hover:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          {(() => {
                            const isPassMark = semester.name.includes("AL")
                              ? sub.mark >= 0.45 * sub.total
                              : sub.mark >= 0.40 * sub.total;
                            
                            return (
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                                isPassMark 
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}>
                                {isPassMark ? "P" : "F"}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleRemoveRow(semester._id, idx)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Remove Subject"
                          >
                            <MinusCircle size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#f3f7f6] dark:bg-[#11322f] border-t-2 border-gray-200 dark:border-[#0d2522]">
                    <tr>
                      <td className="px-6 py-4 font-bold text-brand-teal dark:text-brand-mint">
                        {percentage(ml.subjects)}%
                      </td>
                      <td className="px-7 py-4 font-bold text-gray-900 dark:text-white">
                        {ml?.subjects?.reduce((acc, s) => acc + s.mark, 0)}
                      </td>
                      <td className="px-7 py-4 font-bold text-gray-900 dark:text-white">
                        {ml?.subjects?.reduce((acc, s) => acc + s.total, 0)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          isPass(ml.subjects, semester.name) 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" 
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800"
                        }`}>
                          {isPass(ml.subjects, semester.name) ? "Passed" : "Failed"}
                        </span>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#0d2522]/30 rounded-2xl border border-gray-100 dark:border-transparent border-dashed">
              <FileText size={48} className="mb-4 text-gray-300 dark:text-gray-600" strokeWidth={1} />
              <p>No marks have been recorded for this semester yet.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-[#0d2522] bg-gray-50/50 dark:bg-black/20 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => handleAddRow(semester._id)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0d2522] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#0d2522] hover:border-brand-teal hover:text-brand-teal rounded-xl shadow-sm transition-all text-sm font-semibold"
          >
            <FiPlus size={16} /> Add Subject
          </button>
          
          <div className="flex flex-wrap items-center gap-3">
            {ml?.editingStatus === "send" && (
              <button
                onClick={() => handleAllowEdit(ml._id)}
                disabled={allowingEdit}
                title="Click to request permission to edit this item"
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm transition-all text-sm font-semibold"
              >
                {allowingEdit ? <Loader2 className="animate-spin" size={16} /> : <span className="text-xs sm:text-sm">Edit Requested</span>}
              </button>
            )}

            <button
              onClick={() => handleEdit(semester._id)}
              disabled={!isDirty(semester._id) || saving[semester._id]}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl shadow-sm transition-all text-sm font-semibold
                ${isDirty(semester._id)
                  ? "bg-brand-teal hover:bg-brand-teal/90 text-white"
                  : "bg-gray-100 dark:bg-[#0d2522] text-gray-400 dark:text-gray-600 cursor-not-allowed"
                }`}
            >
              {saving[semester._id] ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save Changes
            </button>

            <button
              onClick={() => handleApprove(ml._id, semester._id)}
              disabled={ml.isApproved || approving[semester._id]}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl shadow-sm transition-all text-sm font-semibold
                ${ml.isApproved
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800/30 cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-600 text-white"
                }`}
            >
              {approving[semester._id] ? (
                <Loader2 className="animate-spin" size={16} />
              ) : ml.isApproved ? (
                <CheckCircle size={16} />
              ) : (
                <Check size={16} />
              )}
              {ml.isApproved ? "Approved" : "Approve Marks"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminsideMarkListes = () => {
  const { studentId } = useParams();
  const { semesters, getSemesters, markList, addMarkList, getMarkList } = useMarksStore();
  const { authUser } = useAuthStore();

  const [originalData, setOriginalData] = useState({});
  const [marksData, setMarksData] = useState({});
  const [saving, setSaving] = useState({});
  const [approving, setApproving] = useState({});
  const [allowingEdit, setAllowingEdit] = useState(false);
  
  // Modal state
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    getSemesters();
    getMarkList(studentId);
  }, [getSemesters, getMarkList, studentId]);

  useEffect(() => {
    const allMarks = {};
    for (const sem of semesters) {
      const ml = markList.find((m) => m.semesterId === sem._id) || { subjects: [], isApproved: false, _id: null };
      allMarks[sem._id] = { ...ml, subjects: ml.subjects.map(s => ({ ...s })) };
    }
    
    setMarksData(allMarks);
    setOriginalData(JSON.parse(JSON.stringify(allMarks)));
  }, [semesters, markList]);

  const handleInputChange = (semId, idx, field, val) => {
    setMarksData((prev) => {
      const next = { ...prev };
      const sub = next[semId].subjects[idx];
      sub[field] = field === "mark" || field === "total" ? parseFloat(val) || 0 : val;
      return next;
    });
  };

  const handleAddRow = (semId) => {
    setMarksData((prev) => {
      const next = { ...prev };
      const subjects = [...next[semId].subjects];
      subjects.push({ subject: "", mark: 0, total: 100 })
      next[semId] = { ...next[semId], subjects };
      return next;
    });
  };

  const handleRemoveRow = (semId, index) => {
    setMarksData((prev) => {
      const next = { ...prev };
      const subjects = [...next[semId].subjects];
      subjects.splice(index, 1);
      next[semId] = { ...next[semId], subjects };
      return next;
    });
  };

  const handleAllowEdit = async (markListId) => {
    setAllowingEdit(true);
    try {
      await axiosInstance.patch(`/marklist/${markListId}/allow-edit`);
      toast.success("Editing access allowed to student");
    } catch {
      toast.error("Failed to request edit");
    } finally {
      setAllowingEdit(false);
    }
  };

  const isDirty = (semId) => {
    if (!marksData[semId] || !originalData[semId]) return false;
    return JSON.stringify(marksData[semId]) !== JSON.stringify(originalData[semId]);
  };

  const handleEdit = async (semId) => {
    setSaving((s) => ({ ...s, [semId]: true }));
    try {
      const ml = marksData[semId];
      await addMarkList(studentId, semId, ml.subjects); // Fixed missing studentId in actual ML object previously
      toast.success("Marks updated successfully!");
      setOriginalData((o) => ({ ...o, [semId]: JSON.parse(JSON.stringify(marksData[semId])) }));
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving((s) => ({ ...s, [semId]: false }));
    }
  };

  const handleApprove = async (mlId, semId) => {
    setApproving((s) => ({ ...s, [semId]: true }));
    try {
      await axiosInstance.patch(`/marklist/${mlId}/status`, { status: true });
      setMarksData((prev) => ({
        ...prev,
        [semId]: { ...prev[semId], isApproved: true }
      }));
      toast.success("Mark list approved!");
    } catch {
      toast.error("Failed to approve");
    } finally {
      setApproving((s) => ({ ...s, [semId]: false }));
    }
  };

  const isPass = (subjects, sem) => {
    if (!subjects || subjects.length === 0) return false;
    const passPercent = sem.includes("AL") ? 0.45 : 0.40;
    return subjects.every(s => s.mark >= passPercent * s.total);
  };

  const percentage = (subjects) => {
    if (!subjects || subjects.length === 0) return "0.00";
    const totalMarks = subjects.reduce((acc, s) => acc + s.mark, 0);
    const totalMax = subjects.reduce((acc, s) => acc + s.total, 0);
    return totalMax ? ((totalMarks / totalMax) * 100).toFixed(2) : "0.00";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Modal */}
      <MarkListModal 
        semester={selectedSemester}
        isOpen={!!selectedSemester}
        onClose={() => setSelectedSemester(null)}
        ml={selectedSemester ? marksData[selectedSemester._id] : null}
        handleInputChange={handleInputChange}
        handleAddRow={handleAddRow}
        handleRemoveRow={handleRemoveRow}
        percentage={percentage}
        isPass={isPass}
        allowingEdit={allowingEdit}
        handleAllowEdit={handleAllowEdit}
        handleEdit={handleEdit}
        isDirty={isDirty}
        saving={saving}
        handleApprove={handleApprove}
        approving={approving}
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-teal/10 dark:bg-[#11322f] rounded-xl">
          <GraduationCap className="text-brand-teal w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-oswald tracking-wide">
          Student Mark Lists
        </h2>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {semesters.map((sem, index) => {
          const ml = marksData[sem._id];
          const hasMarks = ml?.subjects?.length > 0;
          
          return (
            <div
              key={sem._id}
              onClick={() => setSelectedSemester(sem)}
              className="group bg-white dark:bg-[#11322f] rounded-2xl p-5 border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-gray-100 dark:border-[#0d2522] hover:shadow-xl hover:-translate-y-1 hover:border-brand-teal/30 transition-all duration-300 relative overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Decorative background */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-teal/5 rounded-full blur-2xl group-hover:bg-brand-teal/10 transition-colors"></div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {ml?.isApproved ? (
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
                    <CheckCircle size={10} strokeWidth={3} /> Approved
                  </div>
                ) : hasMarks ? (
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md border border-amber-100 dark:border-amber-800/30 shadow-sm">
                    <FileText size={10} strokeWidth={3} /> Pending
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col relative z-10 h-full">
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-[#0d2522] text-brand-teal font-bold flex items-center justify-center border border-gray-100 dark:border-transparent shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] text-lg mb-4 transition-transform group-hover:scale-105">
                  {index + 1}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-teal transition-colors line-clamp-1">
                  {sem.name}
                </h3>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {hasMarks ? `${ml.subjects.length} Subjects` : "No marks added"}
                  </span>
                  <div className="p-1.5 bg-gray-50 dark:bg-[#0d2522] rounded-lg text-gray-400 group-hover:text-brand-teal group-hover:bg-brand-teal/10 transition-colors">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminsideMarkListes;
