import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useParams } from "react-router-dom";
import { useMarksStore } from "../../store/useMarksStore";
import Header from "../../components/Header";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader2, MinusCircle } from "lucide-react";
import { FiSend, FiLock, FiEdit, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

const MarkListPage = () => {
  const { semesterid } = useParams();
  const { semesters, getSemesters, markList, addMarkList, getMarkList, isLoading } =
    useMarksStore();
  const { authUser } = useAuthStore();

  const [selectedSemester, setSelectedSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [requestingEdit, setRequestingEdit] = useState(false);

  // Load semesters & markList
  useEffect(() => {
    getSemesters();
  }, []);

  useEffect(() => {
    if (authUser?._id && semesterid) {
      getMarkList(authUser._id, semesterid);
    }
  }, [authUser?._id, semesterid]);

  // Pick the current semester
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
      .catch(() => toast.error("Error fetching subjects"));
  }, [selectedSemester]);

  // Initialize marks array: either existing markList or blank subjects
  useEffect(() => {
    if (markList && markList.subjects?.length > 0) {
      setMarks(markList.subjects.map((s) => ({ ...s })));
    } else if (subjects.length > 0) {
      setMarks(
        subjects.map((sub) => ({
          subject: sub.name,
          mark: 0,
          total: sub.mark,
        }))
      );
    }
  }, [markList, subjects]);

  const readOnly = !!markList?.isApproved || markList?.isEditable === false;
  const canSubmitFirstTime = !markList?._id;
  const waitingApproval = markList?._id && !markList.isApproved && markList.editingStatus !== "allow"

  const handleInputChange = (i, field, v) => {
    const next = [...marks];
    next[i][field] = field === "mark" || field === "total" ? +v || 0 : v;
    setMarks(next);
  };

  const handleAddRow = () => {
    console.log("marks", ...marks);
    
    setMarks((prev) => [...prev, { subject: "", mark: 0, total: 100 }]);
  };

const handleRemoveRow = (index) => {
  setMarks((prev) => prev.filter((row, i) => i !== index));
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

  // Totals for footer
  const totalMarks = marks.reduce((sum, s) => sum + s.mark, 0);
  const totalMax = marks.reduce((sum, s) => sum + s.total, 0);
  const percent = totalMax ? ((totalMarks / totalMax) * 100).toFixed(2) : "0.00";
  let overallStatus;
  if(selectedSemester?.name?.includes("AL")){
      overallStatus = marks.every((s) => s.mark >= 0.45 * s.total) ? "P" : "F";
  }else{
     overallStatus = marks.every((s) => s.mark >= 0.40 * s.total) ? "P" : "F";
  }
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-3 pt-24 flex justify-center">
      <Header />
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4 text-center font-oswald">
          {selectedSemester?.name || "Select a semester"}
        </h2>

        {waitingApproval && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            Waiting for staff approval…
          </div>
        )}
        {markList.editingStatus === "send" && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          Your request to edit marks is pending approval...
      </div>
        )}
        {markList.editingStatus === "allow" && (
         <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
         You can now edit marks.
       </div>
        )}


        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse ">
            <thead className="rounded-lg">
              <tr className="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 text-white ">
                <th className="px-8 py-3 text-xs sm:text-sm">Subject</th>
                <th className="px-2 py-3 text-xs sm:text-sm">Mark</th>
                <th className="px-2 py-3 text-xs sm:text-sm">Total</th>
                <th className="px-1 py-3 text-xs sm:text-sm">Status</th>
                {(!markList.isApproved || markList.editingStatus === "allow") && (
                    <th className="px-1 py-3 text-xs sm:text-sm">Remove</th>
                  )}

              </tr>
            </thead>
            <tbody>
              {marks.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.subject}
                      onChange={(e) => handleInputChange(i, "subject", e.target.value)}
                      disabled={readOnly}
                      className="w-full bg-transparent text-gray-900 dark:text-gray-200 focus:outline-none text-xs sm:text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.mark}
                      onChange={(e) => handleInputChange(i, "mark", e.target.value)}
                      disabled={readOnly}
                      className={`text-xs sm:text-sm w-full bg-transparent focus:outline-none text-gray-900 dark:text-gray-200 ${
                        row.mark > row.total ? "text-red-600 font-bold" : "text-gray-900"
                      }`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.total}
                      onChange={(e) => handleInputChange(i, "total", e.target.value)}
                      disabled={readOnly}
                      className="text-xs sm:text-sm w-full bg-transparent focus:outline-none text-gray-900 dark:text-gray-200"
                    />
                  </td>
                <td
                className={`text-xs sm:text-sm px-3 py-2 text-center ${
                  selectedSemester?.name?.includes("AL")
                    ? row.mark >= 0.45 * row.total
                      ? "text-green-600"
                      : "text-red-600"
                    : row.mark >= 0.40 * row.total
                      ? "text-green-600"
                      : "text-red-600"
                } font-bold`}
              >
                {selectedSemester?.name?.includes("AL")
                  ? row.mark >= 0.45 * row.total
                    ? "P"
                    : "F"
                  : row.mark >= 0.40 * row.total
                    ? "P"
                    : "F"}
              </td>

              <td className="text-xs sm:text-sm px-3 py-2 text-center">
                <button
                  onClick={() => handleRemoveRow(i)}
                  className="text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <MinusCircle size={18} />
                </button>
              </td>




                </tr>
              ))}
            </tbody>
            {/* Table footer with totals */}
            <tfoot className="bg-gray-200 dark:bg-gray-700 font-bold">
              <tr>
                <td className="px-6 py-3 text-xs sm:text-sm">{percent}%</td>
                <td className="px-3 py-3 text-xs sm:text-sm">{totalMarks}</td>
                <td className="px-3 py-3 text-xs sm:text-sm">{totalMax}</td>
                <td className="px-3 py-3 text-center text-xs sm:text-sm">{overallStatus}</td>
                <td className="px-3 py-3 text-xs sm:text-sm"></td>
              </tr>
            </tfoot>
          </table>

          {/* Add Subject */}
          {!readOnly && (
            <button
              onClick={handleAddRow}
              className="mt-4 flex items-center text-violet-800 dark:text-violet-400 hover:underline focus:outline-none"
            >
              <FiPlus className="mr-2" size={18} /> Add Subject
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          {/* Request Edit if locked */}
          {markList?.isEditable === false && markList.isApproved && (
            <button
              onClick={handleRequestEdit}
              disabled={requestingEdit}
              className="flex bg-gradient-to-r from-sky-600 to-sky-700 text-white px-4 py-2 rounded-lg text-sm transition hover:from-sky-700 hover:to-sky-800"
            >
              {requestingEdit ? (
                <Loader2 className="animate-spin" />
              ) : (
                <FiEdit size={18} />
              )}
              <span>Request Edit</span>
            </button>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={
              submitting ||
              isLoading ||
              (!canSubmitFirstTime && waitingApproval) ||
              readOnly
            }
            className={`flex items-center gap-2 px-5 py-2 rounded-lg shadow transition
              ${
                submitting || isLoading || (!canSubmitFirstTime && waitingApproval) || readOnly
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-600 to-sky-700 text-white px-4 py-2 rounded-lg text-sm transition hover:from-sky-700 hover:to-sky-800"
              }`}
          >
            {submitting || isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <FiSend size={18} />
            )}
            <span>
              {canSubmitFirstTime || !markList.isApproved || markList.isEditable
                ? "Submit"
                : markList?.isApproved
                ? "Approved"
                : waitingApproval
                ? "Waiting…"
                : "Submit"}
            </span>
          </button>
        </div>

        {/* Contextual footer text */}
        <p className="text-gray-600 dark:text-gray-400 text-center mt-4">
          {markList?._id
            ? markList.isApproved
              ? "Your marks have been approved."
              : markList.isEditable === false
              ? "You cannot edit until staff grants access."
              : "Your marks are pending approval."
            : "* No marks yet — please fill in and submit."}
        </p>
      </div>
    </div>
  );
};

export default MarkListPage;
