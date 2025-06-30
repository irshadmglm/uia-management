import React, { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useStudentStore } from "../../store/studentStore";
import { useMarksStore } from "../../store/useMarksStore";
import Header from "../../components/Header";
import { useAuthStore } from "../../store/useAuthStore";
import { useAchievement } from "../../store/achivemnetStore";
import { useReadingProgress } from "../../store/readingProgressStore";

const BatchStudents = () => {
  const { item: rawItem, batchId } = useParams();
  // ensure consistent spelling
  const item = rawItem === "achievements" ? "achievements" : rawItem;

  const [searchQuery, setSearchQuery] = useState("");
  const { getBatchStudents, batchStudents } = useStudentStore();
  const { getMarkListToapprove, markList } = useMarksStore();
  const { markListCountToApprove, marksCountToApproveByStd } = useMarksStore();
  const { achievementsCountToApprove, achieveCountToApproveByStd } = useAchievement();
  const { progressCountToApprove, progressCountToApproveByStd } = useReadingProgress();
  const { authUser } = useAuthStore();

  const [students, setStudents] = useState([]);
  const [countToApprove, setCountToApprove] = useState([]);

  // Fetch batch students and initial marklist count
  useEffect(() => {
    if (batchId) {
      getBatchStudents(batchId);
      getMarkListToapprove(batchId);
    }
  }, [batchId, getBatchStudents, getMarkListToapprove]);

  // Sync students list when batchStudents or markList changes
  useEffect(() => {
    if (batchStudents?.length) {
      setStudents([...batchStudents]);
    }
  }, [batchStudents, markList]);

  // Fetch counts by student when item or batch changes
  useEffect(() => {
    if (batchId) {
      if (item === "marklist") marksCountToApproveByStd(batchId);
      else if (item === "achievements") achieveCountToApproveByStd(batchId);
      else if (item === "reading-progress") progressCountToApproveByStd(batchId);
    }
  }, [item, batchId, marksCountToApproveByStd, achieveCountToApproveByStd, progressCountToApproveByStd]);

  // Sync countToApprove local state when store values change
  useEffect(() => {
    let arr = [];
    if (item === "marklist") arr = markListCountToApprove;
    else if (item === "achievements") arr = achievementsCountToApprove;
    else if (item === "reading-progress") arr = progressCountToApprove;

    setCountToApprove([...arr]);
  }, [item, markListCountToApprove, achievementsCountToApprove, progressCountToApprove]);

  // Filter students by search query
  const filteredStudents = students.filter((student) =>
    [student.name, String(student.cicNumber)]
      .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-6 pt-24">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white font-oswald ml-2">
            Students' {item}
          </h2>
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white dark:bg-slate-800 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={18} />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-300">
            No students found.
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {filteredStudents.map((student, index) => {
              const badge = countToApprove.find((s) => String(s._id) === String(student._id));
              return (
                <Link
                  key={student._id}
                  to={
                    authUser.role === "admin"
                      ? `/dashboard/admin/${item}/${student._id}`
                      : `/dashboard/teacher/${item}/${student._id}`
                  }
                >
                  <div className="relative bg-white dark:bg-gray-700 rounded-xl shadow-lg dark:shadow-gray-900 p-3 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
                    {badge?.count > 0 && (
                      <div className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
                        {badge.count}
                      </div>
                    )}
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-sky-800 dark:bg-sky-600 text-white flex items-center justify-center font-bold text-sm mr-4">
                        {index + 1}
                      </div>
                      <div className="text-gray-900 dark:text-gray-200 text-sm font-bold">
                        {student.name}
                        <p className="font-normal text-gray-600 dark:text-gray-400 text-sm">
                          <span>CIC:</span> {student.cicNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default BatchStudents;
