import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMarksStore } from "../../store/useMarksStore";
import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../lib/axios";
import { Loader2, Save, CheckCircle, Lock, Unlock, AlertCircle, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const AdminsideMarkListes = () => {
  const { studentId } = useParams();
  const { semesters, getSemesters, markList, addMarkList, getMarkList } = useMarksStore();
  const [marksData, setMarksData] = useState({});
  const [saving, setSaving] = useState({});
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    getSemesters();
    getMarkList(studentId);
  }, []);

  useEffect(() => {
    const allMarks = {};
    for (const sem of semesters) {
      const ml = markList.find((m) => m.semesterId === sem._id) || { subjects: [], isApproved: false };
      allMarks[sem._id] = { ...ml, subjects: ml.subjects.map(s => ({ ...s })) };
    }
    setMarksData(allMarks);
    setOriginalData(JSON.parse(JSON.stringify(allMarks)));
  }, [semesters, markList]);

  // --- Logic Helpers ---
  const isPass = (mark, total, semName) => {
    const threshold = semName?.includes("AL") ? 0.45 : 0.40;
    return mark >= total * threshold;
  };

  const getSemesterSummary = (subjects, semName) => {
    const totalMarks = subjects.reduce((acc, s) => acc + (parseFloat(s.mark) || 0), 0);
    const totalMax = subjects.reduce((acc, s) => acc + (parseFloat(s.total) || 0), 0);
    const percentage = totalMax ? ((totalMarks / totalMax) * 100).toFixed(2) : "0.00";
    const allPassed = subjects.every(s => isPass(s.mark, s.total, semName));
    return { totalMarks, totalMax, percentage, allPassed };
  };

  const handleInputChange = (semId, idx, field, val) => {
    setMarksData((prev) => {
      const next = { ...prev };
      const sub = next[semId].subjects[idx];
      sub[field] = field === "subject" ? val : parseFloat(val) || 0;
      return { ...next };
    });
  };

  const handleSave = async (semId) => {
    setSaving(s => ({ ...s, [semId]: true }));
    try {
      await addMarkList(studentId, semId, marksData[semId].subjects);
      setOriginalData(prev => ({ ...prev, [semId]: JSON.parse(JSON.stringify(marksData[semId])) }));
      toast.success("Marks saved successfully");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(s => ({ ...s, [semId]: false }));
    }
  };

  const handleApprove = async (mlId, semId) => {
    if (!mlId) return toast.error("Please save marks first");
    try {
      await axiosInstance.patch(`/marklist/${mlId}/status`, { status: true });
      setMarksData(prev => ({ ...prev, [semId]: { ...prev[semId], isApproved: true } }));
      toast.success("Approved successfully");
    } catch {
      toast.error("Approval failed");
    }
  };

  // --- UI Components ---
  
  return (
    <div className="pt-6 pb-20 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">
          Manage Results
        </h1>
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg text-sm font-medium">
          Student ID: {studentId}
        </div>
      </div>

      {semesters.map((sem) => {
        const data = marksData[sem._id];
        const isDirty = JSON.stringify(data) !== JSON.stringify(originalData[sem._id]);
        const summary = data?.subjects ? getSemesterSummary(data.subjects, sem.name) : { totalMarks: 0 };

        return (
          <motion.div 
            key={sem._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Header Toolbar */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                {sem.name}
                {data?.isApproved && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle size={12} /> Approved
                  </span>
                )}
              </h2>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSave(sem._id)}
                  disabled={!isDirty || saving[sem._id]}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${isDirty 
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700"}`}
                >
                  {saving[sem._id] ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Changes
                </button>

                {!data?.isApproved && data?._id && (
                  <button
                    onClick={() => handleApprove(data._id, sem._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                )}
              </div>
            </div>

            {/* Data Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium">
                    <th className="px-6 py-3 w-12 text-center">#</th>
                    <th className="px-6 py-3 w-1/2">Subject</th>
                    <th className="px-6 py-3 w-32 text-center">Mark Scored</th>
                    <th className="px-6 py-3 w-32 text-center">Max Mark</th>
                    <th className="px-6 py-3 w-24 text-center">Result</th>
                    <th className="px-6 py-3 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {data?.subjects?.map((sub, idx) => {
                    const passed = isPass(sub.mark, sub.total, sem.name);
                    return (
                      <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            value={sub.subject}
                            onChange={(e) => handleInputChange(sem._id, idx, "subject", e.target.value)}
                            className="w-full bg-transparent border-none outline-none font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 focus:ring-0"
                            placeholder="Subject Name"
                          />
                        </td>
                        <td className="px-6 py-3 text-center">
                          <input
                            type="number"
                            value={sub.mark}
                            onChange={(e) => handleInputChange(sem._id, idx, "mark", e.target.value)}
                            className={`w-20 text-center bg-slate-100 dark:bg-slate-900 border-none rounded-lg py-1.5 font-bold focus:ring-2 focus:ring-primary-500 transition-all ${
                              sub.mark > sub.total ? "text-rose-500 ring-2 ring-rose-500/20" : "text-slate-800 dark:text-white"
                            }`}
                          />
                        </td>
                        <td className="px-6 py-3 text-center">
                          <input
                            type="number"
                            value={sub.total}
                            onChange={(e) => handleInputChange(sem._id, idx, "total", e.target.value)}
                            className="w-20 text-center bg-transparent border-b border-slate-200 dark:border-slate-600 py-1 text-slate-500 focus:border-primary-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                            passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                          }`}>
                            {passed ? "PASS" : "FAIL"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <button 
                            onClick={() => {
                              const newSubjects = [...data.subjects];
                              newSubjects.splice(idx, 1);
                              setMarksData(prev => ({ ...prev, [sem._id]: { ...prev[sem._id], subjects: newSubjects } }));
                            }}
                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* Add Row Button */}
                  <tr>
                    <td colSpan="6" className="px-6 py-3">
                      <button
                        onClick={() => {
                          const newSubjects = [...(data?.subjects || []), { subject: "", mark: 0, total: 100 }];
                          setMarksData(prev => ({ ...prev, [sem._id]: { ...prev[sem._id], subjects: newSubjects } }));
                        }}
                        className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <Plus size={16} /> Add Subject
                      </button>
                    </td>
                  </tr>
                </tbody>
                
                {/* Summary Footer */}
                <tfoot className="bg-slate-50 dark:bg-slate-800 border-t-2 border-slate-200 dark:border-slate-700">
                  <tr>
                    <td colSpan="2" className="px-6 py-4 font-bold text-right text-slate-600 dark:text-slate-300">
                      SEMESTER TOTALS:
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-lg text-slate-800 dark:text-white">
                      {summary.totalMarks}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500">
                      / {summary.totalMax}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`text-sm font-bold ${summary.allPassed ? "text-emerald-600" : "text-rose-600"}`}>
                        {summary.percentage}%
                      </div>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AdminsideMarkListes;