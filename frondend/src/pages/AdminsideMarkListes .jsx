import React, { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../lib/axios";
import { useParams } from "react-router-dom";
import { useMarksStore } from "../store/useMarksStore";
import Header from "../components/Header";
import { Loader2, Save, CheckCircle, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { FiEdit } from "react-icons/fi";

const AdminsideMarkListes = () => {
  const { studentId } = useParams();
  const { semesters, getSemesters, markList, addMarkList, getMarkList } = useMarksStore();
  const { authUser } = useAuthStore();

  // original fetched data for diffing
  const [originalData, setOriginalData] = useState({});
  const [marksData, setMarksData] = useState({});
  const [saving, setSaving] = useState({});
  const [approving, setApproving] = useState({});
    const [allowingEdit, setAllowingEdit] = useState(false);
  

  useEffect(() => {
    getSemesters();
    getMarkList(studentId);
  }, []);

  // build local state when fetched
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

  // detect if any change in a semester
  const isDirty = (semId) => {
    return JSON.stringify(marksData[semId]) !== JSON.stringify(originalData[semId]);
  };

  const handleEdit = async (semId) => {
    setSaving((s) => ({ ...s, [semId]: true }));
    try {
      const ml = marksData[semId];
      await addMarkList(ml.studentId, semId, ml.subjects);
      toast.success("Marks updated successfully!");
      // reset original to new
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4 pt-24 flex justify-center">
      <Header />
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-8 text-center font-oswald">
          Admin Panel - All Semester Mark Lists
        </h2>

        {semesters.map((sem) => {
          const ml = marksData[sem._id];
          return (
            <div
              key={sem._id}
              className="mb-12 p-3 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl shadow-xl transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-6 text-sky-800 dark:text-blue-300">
                {sem.name}
              </h3>

              {ml?.subjects?.length > 0 ? (
                <>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-md">
                      <thead>
                        <tr className="bg-slate-500 dark:bg-gray-700 text-gray-200 dark:text-white">
                          <th className="px-6 py-3 text-lg">Subject</th>
                          <th className="px-3 py-3 text-lg">Mark</th>
                          <th className="px-3 py-3 text-lg">Total</th>
                          <th className="px-3 py-3 text-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ml.subjects.map((sub, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          >
                            <td className="px-6 py-3">
                              <input
                                type="text"
                                value={sub.subject}
                                onChange={(e) =>
                                  handleInputChange(sem._id, idx, "subject", e.target.value)
                                }
                                placeholder="Subject"
                                className="w-full bg-transparent text-gray-900 dark:text-gray-200 font-medium focus:outline-none"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="number"
                                value={sub.mark}
                                onChange={(e) =>
                                  handleInputChange(sem._id, idx, "mark", e.target.value)
                                }
                                placeholder="Mark"
                                className={`w-full bg-transparent dark:text-gray-200 font-medium focus:outline-none ${
                                  sub.mark > sub.total
                                    ? "text-red-600 font-bold"
                                    : "text-gray-900"
                                }`}
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="number"
                                value={sub.total}
                                onChange={(e) =>
                                  handleInputChange(sem._id, idx, "total", e.target.value)
                                }
                                placeholder="Total"
                                className="w-full bg-transparent text-gray-900 dark:text-gray-200 font-medium focus:outline-none"
                              />
                            </td>
                            <td
                              className={`px-3 py-3 text-center ${
                                sub.mark >= (0.3 * sub.total)
                                  ? "text-green-600 font-bold"
                                  : "text-red-600 font-bold"
                              }`}
                            >
                              {sub.mark >= (0.3 * sub.total) ? "P" : "F"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-4">
                      {ml?.editingStatus === "send" && (
                                <button
                                  onClick={()=> handleAllowEdit(ml._id)}
                                  disabled={allowingEdit}
                                  className="flex items-center gap-2 px-5 py-2 bg-sky-700 hover:bg-indigo-700 text-white rounded-lg shadow"
                                >
                                  {allowingEdit ? (
                                    <Loader2 className="animate-spin" />
                                  ) : (
                                    <FiEdit size={18} />
                                  )}
                                  <span>Allow Edit</span>
                                </button>
                              )}
                    <button
                      onClick={() => handleEdit(sem._id)}
                      disabled={!isDirty(sem._id) || saving[sem._id]}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition
                        ${
                          isDirty(sem._id)
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {saving[sem._id] ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Save size={18} />
                      )}
                      {/* visually hidden text for a11y */}
                      <span className="sr-only">Save</span>
                    </button>

                    <button
                      onClick={() => handleApprove(ml._id, sem._id)}
                      disabled={ml.isApproved || approving[sem._id]}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition
                        ${
                          ml.isApproved
                            ? "bg-gray-400 cursor-not-allowed text-gray-200"
                            : "bg-sky-600 hover:bg-sky-400 text-white"
                        }`}
                    >
                      {approving[sem._id] ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : ml.isApproved ? (
                        <CheckCircle size={18} />
                      ) : (
                        <Check size={18} />
                      )}
                      <span className="sr-only">
                        {ml.isApproved ? "Approved" : "Approve"}
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No marks available for this semester.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminsideMarkListes;
