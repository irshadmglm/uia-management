import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useMarksStore } from "../../store/useMarksStore";
import { useAuthStore } from "../../store/useAuthStore";
import { 
  Loader2, MinusCircle, ArrowLeft, Send, Edit3, Plus, 
  CheckCircle2, AlertCircle, Clock, BookOpen, Award, Sparkles, FileSpreadsheet
} from "lucide-react";
import toast from "react-hot-toast";

const MarkListPage = () => {
  const { semesterid } = useParams();
  const navigate = useNavigate();
  const { semesters, getSemesters, markList, addMarkList, getMarkList, isLoading } = useMarksStore();
  const { authUser } = useAuthStore();

  const [selectedSemester, setSelectedSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [requestingEdit, setRequestingEdit] = useState(false);

  // Load semesters & markList
  useEffect(() => {
    getSemesters();
  }, [getSemesters]);

  useEffect(() => {
    if (authUser?._id && semesterid) {
      getMarkList(authUser._id, semesterid);
    }
  }, [authUser?._id, semesterid, getMarkList]);

  // Pick current semester
  useEffect(() => {
    const sem = semesters.find((s) => s._id === semesterid) || null;
    setSelectedSemester(sem);
  }, [semesters, semesterid]);

  // Fetch subjects template
  useEffect(() => {
    if (!selectedSemester) return;
    axiosInstance
      .get(`/mng/subjects/${selectedSemester._id}`)
      .then((res) => setSubjects(res.data))
      .catch(() => toast.error("Error fetching subjects template"));
  }, [selectedSemester]);

  // Initialize marks array
  useEffect(() => {
    if (markList && markList.subjects?.length > 0) {
      setMarks(markList.subjects.map((s) => ({ ...s })));
    } else if (subjects.length > 0) {
      setMarks(
        subjects.map((sub) => ({
          subject: sub.name,
          mark: 0,
          total: sub.mark || 100,
        }))
      );
    }
  }, [markList, subjects]);

  const readOnly = !!markList?.isApproved || markList?.isEditable === false;
  const canSubmitFirstTime = !markList?._id;
  const waitingApproval = markList?._id && !markList.isApproved && markList.editingStatus !== "allow";

  const handleInputChange = (i, field, v) => {
    const next = [...marks];
    next[i][field] = field === "mark" || field === "total" ? +v || 0 : v;
    setMarks(next);
  };

  const handleAddRow = () => {
    setMarks((prev) => [...prev, { subject: "", mark: 0, total: 100 }]);
  };

  const handleRemoveRow = (index) => {
    setMarks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!authUser || !selectedSemester || marks.length === 0) {
      toast.error("Missing required fields");
      return;
    }
    setSubmitting(true);
    try {
      await addMarkList(authUser._id, semesterid, marks);
      toast.success("Marks submitted, awaiting approval");
    } catch {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestEdit = async () => {
    setRequestingEdit(true);
    try {
      await axiosInstance.patch(`/marklist/${markList._id}/request-edit`);
      toast.success("Edit request sent to staff");
    } catch {
      toast.error("Failed to request edit");
    } finally {
      setRequestingEdit(false);
    }
  };

  // Calculations
  const totalMarks = marks.reduce((sum, s) => sum + s.mark, 0);
  const totalMax = marks.reduce((sum, s) => sum + s.total, 0);
  const percent = totalMax ? ((totalMarks / totalMax) * 100).toFixed(2) : "0.00";
  
  const isAliyaSem = selectedSemester?.name?.includes("AL");
  const passThreshold = isAliyaSem ? 0.45 : 0.40;
  const overallStatus = marks.length > 0 && marks.every((s) => s.mark >= passThreshold * s.total) ? "P" : "F";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-10">
      
      {/* Top Header Card */}
      <div className="relative bg-[#0d2522] rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden border border-[#11322f]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#11322f] via-[#0d2522] to-[#071a18]"></div>
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-brand-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-brand-mint/15 rounded-full blur-2xl"></div>
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize:'24px 24px'}}></div>
        <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-gradient-to-b from-brand-mint via-brand-teal to-transparent rounded-r-full"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition-all"
            >
              <ArrowLeft size={14} /> Back to Semesters
            </button>

            {markList?.isApproved ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 size={14} /> Approved Marks
              </span>
            ) : waitingApproval ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                <Clock size={14} /> Pending Staff Approval
              </span>
            ) : markList?.editingStatus === "allow" ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                <Edit3 size={14} /> Edit Access Granted
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 bg-white/10 px-3 py-1 rounded-full">
                <FileSpreadsheet size={14} /> Draft / Entry Mode
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <BookOpen className="text-brand-mint w-8 h-8" />
                {selectedSemester?.name || "Semester Marksheet"}
              </h1>
              <p className="text-white/60 text-xs sm:text-sm mt-1">
                Enter your subject scores and view overall semester performance results.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="text-center px-3 border-r border-white/10">
                <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Percentage</p>
                <p className="text-lg font-black text-brand-mint">{percent}%</p>
              </div>
              <div className="text-center px-3 border-r border-white/10">
                <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Total Marks</p>
                <p className="text-lg font-black text-white">{totalMarks} / {totalMax}</p>
              </div>
              <div className="text-center px-3">
                <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Result</p>
                <p className={`text-lg font-black ${overallStatus === "P" ? "text-emerald-400" : "text-rose-400"}`}>
                  {overallStatus === "P" ? "PASS" : "FAIL"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Banners */}
      {waitingApproval && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 rounded-2xl text-xs sm:text-sm font-semibold">
          <Clock size={18} className="flex-shrink-0 text-amber-500" />
          <span>Your marks submission has been received and is currently awaiting staff approval.</span>
        </div>
      )}

      {markList?.editingStatus === "send" && (
        <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 rounded-2xl text-xs sm:text-sm font-semibold">
          <AlertCircle size={18} className="flex-shrink-0 text-blue-500" />
          <span>Your request to edit marks has been submitted and is waiting for teacher permission.</span>
        </div>
      )}

      {markList?.editingStatus === "allow" && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs sm:text-sm font-semibold">
          <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-500" />
          <span>Edit permission granted! You can now update your subject marks and re-submit.</span>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] shadow-xl overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0d2522] text-white text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Subject Name</th>
                <th className="px-4 py-4 w-36">Obtained Mark</th>
                <th className="px-4 py-4 w-36">Maximum Total</th>
                <th className="px-4 py-4 w-28 text-center">Status</th>
                {!readOnly && <th className="px-4 py-4 w-20 text-center">Action</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-[#0d2522]">
              {marks.length > 0 ? (
                marks.map((row, i) => {
                  const isPass = row.mark >= passThreshold * row.total;
                  const isExceeded = row.mark > row.total;

                  return (
                    <tr 
                      key={i} 
                      className="hover:bg-gray-50/70 dark:hover:bg-[#0d2522]/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-xs text-gray-400">
                        {i + 1}
                      </td>

                      {/* Subject Name Input / Text */}
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={row.subject}
                          onChange={(e) => handleInputChange(i, "subject", e.target.value)}
                          disabled={readOnly}
                          placeholder="Subject Name"
                          className="w-full bg-transparent text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 rounded-lg px-2 py-1 transition-all disabled:cursor-not-allowed"
                          dir="auto"
                        />
                      </td>

                      {/* Obtained Mark Input */}
                      <td className="px-4 py-3">
                        <div className="relative">
                          <input
                            type="number"
                            value={row.mark}
                            onChange={(e) => handleInputChange(i, "mark", e.target.value)}
                            disabled={readOnly}
                            className={`w-full text-sm font-black px-3 py-1.5 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                              isExceeded 
                                ? "bg-rose-500/10 border-rose-500 text-rose-600 focus:ring-rose-500/30" 
                                : "bg-gray-50 dark:bg-[#0d2522] border-gray-200 dark:border-[#071a18] text-gray-900 dark:text-white focus:ring-brand-teal/30 focus:border-brand-teal"
                            } disabled:bg-transparent disabled:border-transparent`}
                          />
                        </div>
                      </td>

                      {/* Maximum Total Input */}
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={row.total}
                          onChange={(e) => handleInputChange(i, "total", e.target.value)}
                          disabled={readOnly}
                          className="w-full text-sm font-semibold px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#0d2522] border border-gray-200 dark:border-[#071a18] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 disabled:bg-transparent disabled:border-transparent transition-all"
                        />
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black tracking-wider ${
                          isPass
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        }`}>
                          {isPass ? "PASS (P)" : "FAIL (F)"}
                        </span>
                      </td>

                      {/* Remove Button */}
                      {!readOnly && (
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleRemoveRow(i)}
                            className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                            title="Remove Subject"
                          >
                            <MinusCircle size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={readOnly ? 5 : 6} className="text-center py-12 text-gray-400 text-xs sm:text-sm">
                    No subjects added for this semester yet. Click <strong>+ Add Subject</strong> to begin.
                  </td>
                </tr>
              )}
            </tbody>

            {/* Table Footer Totals */}
            <tfoot className="bg-[#0d2522] text-white font-bold border-t border-white/10">
              <tr>
                <td className="px-6 py-4 text-xs uppercase tracking-wider text-white/50" colSpan={2}>
                  Total Overall Performance
                </td>
                <td className="px-4 py-4 text-sm font-black text-brand-mint">
                  {totalMarks}
                </td>
                <td className="px-4 py-4 text-sm font-black text-white">
                  {totalMax}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    overallStatus === "P"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  }`}>
                    {overallStatus === "P" ? "PASSED" : "FAILED"}
                  </span>
                </td>
                {!readOnly && <td></td>}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Toolbar */}
        <div className="p-4 sm:p-6 bg-gray-50/50 dark:bg-[#0d2522]/50 border-t border-gray-100 dark:border-[#0d2522] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {!readOnly && (
              <button
                onClick={handleAddRow}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-brand-teal dark:text-brand-mint bg-brand-teal/10 dark:bg-brand-mint/10 hover:bg-brand-teal/20 rounded-xl transition-all border border-brand-teal/20"
              >
                <Plus size={16} /> Add Subject
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Request Edit Button if locked */}
            {markList?.isEditable === false && markList.isApproved && (
              <button
                onClick={handleRequestEdit}
                disabled={requestingEdit}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                {requestingEdit ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Edit3 size={16} />
                )}
                <span>Request Edit Access</span>
              </button>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                isLoading ||
                (!canSubmitFirstTime && waitingApproval) ||
                readOnly
              }
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
                submitting || isLoading || (!canSubmitFirstTime && waitingApproval) || readOnly
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-300 dark:border-gray-700"
                  : "bg-gradient-to-r from-brand-teal to-brand-teal-dark hover:from-brand-teal-dark hover:to-[#071a18] text-white hover:shadow-lg"
              }`}
            >
              {submitting || isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
              <span>
                {canSubmitFirstTime || !markList.isApproved || markList.isEditable
                  ? "Submit Mark List"
                  : markList?.isApproved
                  ? "Marks Approved"
                  : waitingApproval
                  ? "Awaiting Approval"
                  : "Submit Mark List"}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Contextual Status Note */}
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
        {markList?._id
          ? markList.isApproved
            ? "Your marks have been approved by staff and are locked for editing."
            : markList.isEditable === false
            ? "Mark editing is currently locked. Click 'Request Edit Access' if changes are needed."
            : "Your submitted marks are pending approval."
          : "* Please fill in your subject scores and click Submit Mark List."}
      </p>

    </div>
  );
};

export default MarkListPage;
