import React, { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useStaffStore } from "../../store/useStaffStore";
import TeacherTable from "../../components/TeacherTable";

const TeacherList = () => {
  const { getTeachers, teachers, isLoading } = useStaffStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        await getTeachers();
      } catch (err) {
        setError("Failed to fetch teachers. Please try again.");
      }
    };
    fetchTeachers();
  }, [getTeachers]);

  return (
    <div className="flex flex-col items-center text-gray-900 dark:text-white w-full">
      {isLoading ? (
        <div className="mt-10 text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-teal mt-2 mx-auto"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center mt-10">
          <AlertCircle className="text-red-500 dark:text-red-400" size={48} />
          <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 dark:hover:bg-red-700 transition"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      ) : (
        <div className="w-full">
          <TeacherTable teachers={teachers} />
        </div>
      )}
    </div>
  );
};

export default TeacherList;
