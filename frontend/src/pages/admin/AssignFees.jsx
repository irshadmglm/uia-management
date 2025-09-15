import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useStudentStore } from "../../store/studentStore";
import { useAdminStore } from "../../store/useAdminMngStore";
import { use } from "react";
import { useFeeStore } from "../../store/feesSrore";

const AssignFees = () => {
  const { batchStudents, getBatchStudents } = useStudentStore();
  const { batches, getBatches } = useAdminStore();
  const { assignFees } = useFeeStore()

  const [selectedBatch, setSelectedBatch] = useState(""); // ✅ start empty
  const [fees, setFees] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await getBatches();
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getBatches]);

  useEffect(() => {
    if (batches.length > 0 && !selectedBatch) {
      const defaultBatch = batches.find((b) => b.isActive) || batches[0];
      setSelectedBatch(defaultBatch?._id || "");
    }
  }, [batches, selectedBatch]);

  useEffect(() => {
    if (selectedBatch) {
      getBatchStudents(selectedBatch);
      fetchFees(selectedBatch);
    }
  }, [selectedBatch, getBatchStudents]);

  const fetchFees = async (batchId) => {
    try {
      const { data } = await axiosInstance.get(`/fees/${batchId}`);
      setFees(data.fees || {});
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  const handleFeeChange = (studentId, value) => {
    setFees((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await assignFees(batchId, fees)
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-sky-800 dark:text-blue-300">
        Assign Fees
      </h2>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <label className="font-semibold text-gray-700 dark:text-gray-200">
          Select Batch:
        </label>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none"
        >
          <option value=""> Select Batch</option>
          {batches.map((batch) => (
            <option key={batch._id} value={batch._id}>
              {batch.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : batchStudents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg shadow">
            <thead>
              <tr className="bg-slate-500 dark:bg-gray-700 text-white">
                <th className="px-6 py-3 text-left">Student Name</th>
                <th className="px-6 py-3 text-left">Assign Fee</th>
              </tr>
            </thead>
            <tbody>
              {batchStudents.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="px-6 py-3">{student.name}</td>
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      min={0}
                      value={fees[student._id] || ""}
                      onChange={(e) =>
                        handleFeeChange(student._id, e.target.value)
                      }
                      placeholder="Enter fee"
                      className="w-32 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-sky-700 hover:bg-indigo-700 text-white rounded-lg shadow font-semibold flex items-center gap-2"
            >
              {saving && <Loader2 className="animate-spin" size={18} />}
              Save Fees
            </button>
          </div>
        </div>
      ) : selectedBatch ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No students found for this batch.
        </div>
      ) : null}
    </div>
  );
};

export default AssignFees;
