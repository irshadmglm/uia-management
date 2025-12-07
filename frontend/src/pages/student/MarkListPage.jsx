import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMarksStore } from "../../store/useMarksStore";
import { useAuthStore } from "../../store/useAuthStore";
import { motion } from "framer-motion";
import { AlertTriangle, Lock, Send, CheckCircle, Clock } from "lucide-react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const MarkListPage = () => {
  const { semesterid } = useParams();
  const { semesters, getSemesters, markList, getMarkList } = useMarksStore();
  const { authUser } = useAuthStore();
  
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    getSemesters();
  }, []);

  useEffect(() => {
    if (authUser?._id && semesterid) {
      getMarkList(authUser._id, semesterid);
    }
  }, [authUser, semesterid]);

  useEffect(() => {
    setSelectedSemester(semesters.find(s => s._id === semesterid));
  }, [semesters, semesterid]);

  const marks = markList?.subjects || [];
  const totalMarks = marks.reduce((sum, s) => sum + (s.mark || 0), 0);
  const maxMarks = marks.reduce((sum, s) => sum + (s.total || 0), 0);
  const percentage = maxMarks ? ((totalMarks / maxMarks) * 100).toFixed(2) : "0.00";
  const isApproved = markList?.isApproved;

  const handleRequestEdit = async () => {
    try {
      await axiosInstance.patch(`/marklist/${markList._id}/request-edit`);
      toast.success("Edit request sent to administration");
    } catch {
      toast.error("Request failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20">
      
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-display font-bold text-slate-800 dark:text-white mb-2">
          {selectedSemester?.name || "Semester Result"}
        </h1>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-500">
          {isApproved ? (
            <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle size={14} /> Official Result</span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-600"><Clock size={14} /> Provisional / Pending Approval</span>
          )}
        </div>
      </div>

      {/* Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Score" value={totalMarks} sub={`/ ${maxMarks}`} />
        <StatCard label="Percentage" value={`${percentage}%`} highlight />
        <StatCard label="Result Status" value={percentage >= 40 ? "PASSED" : "FAILED"} color={percentage >= 40 ? "emerald" : "rose"} />
      </div>

      {/* Marks Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Max Mark</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Obtained</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {marks.map((sub, i) => {
              const passed = sub.mark >= (sub.total * 0.4); // Simplified pass logic
              return (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                    {sub.subject}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">{sub.total}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-white">
                    {sub.mark}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {passed ? "P" : "F"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Footer Action */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Lock size={16} /> Results are locked by administration.
          </div>
          {isApproved && (
            <button 
              onClick={handleRequestEdit}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
            >
              Found an error? Request Edit
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ label, value, sub, highlight, color }) => (
  <div className={`p-6 rounded-2xl border ${highlight ? 'bg-primary-600 text-white border-primary-600 shadow-xl shadow-primary-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
    <p className={`text-sm font-medium mb-1 ${highlight ? 'text-primary-100' : 'text-slate-500'}`}>{label}</p>
    <div className="flex items-baseline gap-2">
      <h3 className={`text-3xl font-display font-bold ${color === 'rose' ? 'text-rose-500' : color === 'emerald' ? 'text-emerald-500' : highlight ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
        {value}
      </h3>
      {sub && <span className="text-sm opacity-60">{sub}</span>}
    </div>
  </div>
);

export default MarkListPage;