import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import StudentTable from "../../components/StudentTable";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useStudentStore } from "../../store/studentStore";

const InactiveStdList = () => {
  const { getInactiveStudents, studentsInactive, isLoading } = useStudentStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        await getInactiveStudents();
      } catch (err) {
        setError("Failed to fetch Books. Please try again.");
      }
    };
    fetchStudents();
  }, []);



  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header user={true} />

      {isLoading ? (
        <div className="mt-10 text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-500"></div>
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
        <StudentTable students={studentsInactive} inactive={true} />
      )}

    </div>
  );
};


export default InactiveStdList;