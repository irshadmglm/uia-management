import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMarksStore } from "../../store/useMarksStore";
import Header from "../../components/Header";
import { Loader2, Save, CheckCircle, Check, MinusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import { FiEdit, FiPlus } from "react-icons/fi";
import { axiosInstance } from "../../lib/axios";

const AdminsideMarkListes = () => {
  const { studentId } = useParams();
  const { semesters, getSemesters, markList, addMarkList, getMarkList } = useMarksStore();
  const { authUser } = useAuthStore();

  const [originalData, setOriginalData] = useState({});
  const [marksData, setMarksData] = useState({});
  const [saving, setSaving] = useState({});
  const [approving, setApproving] = useState({});
    const [allowingEdit, setAllowingEdit] = useState(false);
  

  useEffect(() => {
    getSemesters();
    getMarkList(studentId);
  }, []);

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

    next[semId] = {
      ...next[semId],
      subjects,
    };

    return next;
  });
  };

const handleRemoveRow = (semId, index) => {
  setMarksData((prev) => {
    const next = { ...prev };

    const subjects = [...next[semId].subjects];

    subjects.splice(index, 1);

    next[semId] = {
      ...next[semId],
      subjects,
    };

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
    return JSON.stringify(marksData[semId]) !== JSON.stringify(originalData[semId]);
  };

  const handleEdit = async (semId) => {
    setSaving((s) => ({ ...s, [semId]: true }));
    try {
      const ml = marksData[semId];
      await addMarkList(ml.studentId, semId, ml.subjects);
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
  const passPercent = sem.includes("AL") ? 0.45 : 0.40;
  return subjects?.every(s => s.mark >= passPercent * s.total);
};

const percentage = (subjects) => {
  const totalMarks = subjects.reduce((acc, s) => acc + s.mark, 0);
  const totalMax = subjects.reduce((acc, s) => acc + s.total, 0);
  return totalMax ? ((totalMarks / totalMax) * 100).toFixed(2) : "0.00";
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4 pt-24 flex justify-center">
      <Header />
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-8 text-center font-oswald">
         All Semester Mark Lists
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
                              <th className="px-8 py-3 text-xs sm:text-sm">Subject</th>
                              <th className="px-2 py-3 text-xs sm:text-sm">Mark</th>
                              <th className="px-2 py-3 text-xs sm:text-sm">Total</th>
                              <th className="px-1 py-3 text-xs sm:text-sm">Status</th>
                              <th className="px-1 py-3 text-xs sm:text-sm">Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ml.subjects.map((sub, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          >
                            <td className="px-6 py-3 text-xs sm:text-sm">
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
                            <td className="px-3 py-3 text-xs sm:text-sm">
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
                            <td className="px-3 py-3 text-xs sm:text-sm">
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
                            className={`px-3 py-2 text-xs sm:text-sm text-center ${
                              sem.name.includes("AL")
                                ? sub.mark >= 0.45 * sub.total
                                  ? "text-green-600"
                                  : "text-red-600"
                                : sub.mark >= 0.40 * sub.total
                                  ? "text-green-600"
                                  : "text-red-600"
                            } font-bold`}
                          >
                            {sem.name.includes("AL")
                              ? sub.mark >= 0.45 * sub.total
                                ? "P"
                                : "F"
                              : sub.mark >= 0.40 * sub.total
                                ? "P"
                                : "F"}
                          </td>
                          <td className="text-xs sm:text-sm px-3 py-2  text-center">
                                          <button
                                            onClick={() => handleRemoveRow(sem._id, idx)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Remove"
                                          >
                                            <MinusCircle size={18} />
                                          </button>
                                        </td>
                          
                          </tr>
                        ))}
                      </tbody>
                     <tfoot className="bg-gray-200 dark:bg-gray-700 font-bold">
                        <tr>
                          <td className="px-6 py-3 text-xs sm:text-sm">{percentage(ml.subjects)}%</td>
                          <td className="px-3 py-3 text-xs sm:text-sm">{ml?.subjects?.reduce((acc, s) => acc + s.mark, 0)}</td>
                          <td className="px-3 py-3 text-xs sm:text-sm">{ml?.subjects?.reduce((acc, s) => acc + s.total, 0)}</td>
                          <td className="px-3 py-3 text-xs sm:text-sm text-center">{isPass(ml.subjects, sem.name) ? "P" : "F"}</td>
                          <td className="px-3 py-3 text-xs sm:text-sm"></td>
                        </tr>
                      </tfoot>


                    </table>
                  </div>
                 
                  <div className="flex justify-end gap-4">
                     <button
                          onClick={()=> handleAddRow(sem._id)}
                          className="flex items-center gap-2 px-5 py-2 bg-sky-700 hover:bg-indigo-700 text-white rounded-lg shadow"
                          >
                        <FiPlus className="" size={18} />
                      </button>
                      
                      {ml?.editingStatus === "send" && (
                                <button
                                  onClick={()=> handleAllowEdit(ml._id)}
                                  disabled={allowingEdit}
                                  title="Click to request permission to edit this item"
                                  className="flex items-center gap-2 px-5  bg-sky-700 hover:bg-indigo-700 text-white rounded-lg shadow"
                                >
                                  {allowingEdit ? (
                                    <Loader2 className="animate-spin" />
                                  ) : (
                                    // <FiEdit size={18} />
                                  <span className="text-[10px] sm:text-sm">Edit Requested</span>
                                  )}
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
