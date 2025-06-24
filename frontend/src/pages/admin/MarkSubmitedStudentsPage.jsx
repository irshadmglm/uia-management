import React, { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useStudentStore } from "../../store/studentStore";
import { useMarksStore } from "../../store/useMarksStore";
import Header from "../../components/Header";
import { useAuthStore } from "../../store/useAuthStore";

const MarkSubmitedStudentsPage = () => {
  const { batchId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const { getBatchStudents, batchStudents } = useStudentStore();
  const [students, setStudents] = useState([]);
  const { getMarkListToapprove, markList } = useMarksStore();
  const {authUser} = useAuthStore();

  useEffect(() => {
    getBatchStudents(batchId);
    getMarkListToapprove(batchId);
  }, [batchId]);

  useEffect(() => {
    if (batchStudents?.length > 0) {
      setStudents(
        [...batchStudents]
      );
      // setStudents(
      //   batchStudents.filter((s) =>
      //     markList.some((m) => m.studentId === s._id)
      //   )
      // );
    }
  }, [batchStudents, markList]);

  const filteredStudents = students.filter((student) =>
    [student.name, String(student.cicNumber), student.batch]
      .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-6 pt-24">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white font-oswald ml-2">
          Students' Mark List
          </h2>
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow-sm"
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
            {filteredStudents.map((student, index) => (
              <Link
              key={student._id}
              to={
                authUser.role === "admin"
                  ? `/dashboard/admin/marklist/${student._id}`
                  : `/dashboard/teacher/marklist/${student._id}`
              }
            >
                 <div
                key={student._id}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-lg dark:shadow-gray-900 p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              >
                  {/* 🔹 Badge for Pending Approvals or requsted to edit */}
                    {(() => {
                      const studentMarks = markList.filter(
                        (m) =>
                          m.studentId === student._id &&
                          (
                            m.isApproved === false ||
                            m.editingStatus === "send"
                          )
                      );

                      return (
                        studentMarks.length > 0 && (
                          <div className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
                            {studentMarks.length}
                          </div>
                        )
                      );
                    })()}

                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-sky-800 dark:bg-sky-600 text-white flex items-center justify-center font-bold text-lg mr-4">
                    {index + 1}
                  </div>
                  <div className="text-gray-900 dark:text-gray-200 text-lg font-medium font-sans">
                    {student.name}
                    <p><span className="font-normal">CIC:</span> {student.cicNumber}</p>
                  </div>
                </div>
                {/* <div className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                  <p><span className="font-medium">Batch:</span> {student.batchName}</p>
                  <p><span className="font-medium">CIC:</span> {student.cicNumber}</p>
                  <p><span className="font-medium">Semester:</span> {markList.find((m) => m.studentId === student._id)?.semesterId || "N/A"}</p>
                </div>
                 */}
              </div>
            </Link>
           
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MarkSubmitedStudentsPage;
