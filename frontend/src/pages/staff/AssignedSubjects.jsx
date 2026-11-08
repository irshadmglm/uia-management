import React, { useEffect, useState } from "react";
import { CheckCircle, Loader2, Calendar } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useStaffStore } from "../../store/useStaffStore";
import { MdAdd, MdAddAlert, MdAddCircle, MdAddHomeWork, MdMarkunread } from "react-icons/md";
import { useAuthStore } from "../../store/useAuthStore";

const AssignedSubjects = () => {
  const { assignedSubjects, getAssignedSubjects, isLoading, } = useStaffStore();
  const {authUser} = useAuthStore();
  let { teacherId } = useParams();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (teacherId) {
      setUserId(teacherId);
    } else if (authUser?._id) {
      setUserId(authUser._id);
    }
  }, [teacherId, authUser]);


  useEffect(() => {
    getAssignedSubjects(teacherId);
  }, [getAssignedSubjects]);

  return (
    <>
      
      <div className="dark: dark: p-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-oswald">
            Assigned Subjects
          </h2>
          <Link
            to={authUser?.role === "admin" ? "/dashboard/admin/timetable" : "/dashboard/teacher/timetable"}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal dark:text-brand-mint text-xs font-semibold transition border border-brand-teal/20 shadow-sm"
          >
            <Calendar size={15} />
            <span>View Weekly Timetable</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-8 h-8 text-gray-600 dark:text-white" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {assignedSubjects.map((subject, index) => (
              <div
                key={subject._id || index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md px-5 py-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                         {subject.batchDetails?.name || "N/A"}
                      </p>
                      {userId?.toString() === subject?.subTeacher?.toString() ? (
                          subject?.periodTeacher1 > 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              Period: {subject.periodTeacher1}
                            </p>
                          ) : null
                        ) : (
                          subject?.periodTeacher2 > 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              Period: {subject.periodTeacher2}
                            </p>
                          ) : null
                        )}

                    </div>
                  </div>
               
                  {subject.CEmark && (
                       <a
                       href={subject.batchDetails.CEmarkList}
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="Open internal mark sheet in a new tab"
                       > 
                    <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-amber-500 rounded-full px-3 py-2 shadow-md w-fit">
                       <MdAdd className="w-4 h-4 text-white animate-pulse" />
                        <span className="text-xs font-medium text-white animate-pulse">CE Mark</span>
                    </div>
                    </a>
                    )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AssignedSubjects;
