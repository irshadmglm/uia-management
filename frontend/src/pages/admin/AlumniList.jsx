import React, { useEffect, useState } from "react";
import StudentTable from "../../components/StudentTable";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useStudentStore } from "../../store/studentStore";

const AlumniList = () => {
  const { getStudents, students, isLoading } = useStudentStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        await getStudents();
      } catch (err) {
        setError("Failed to fetch alumni students. Please try again.");
      }
    };
    fetchStudents();
  }, [getStudents]);

  return (
    <div className="flex flex-col items-center text-gray-900 dark:text-white">
      {isLoading ? (
        <div className="mt-10 text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading alumni students...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-teal mt-3"></div>
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
          <StudentTable students={students} isAlumni={true} />
        </div>
      )}
    </div>
  );
};

export default AlumniList;
