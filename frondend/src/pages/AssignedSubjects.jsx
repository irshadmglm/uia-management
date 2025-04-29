import React, { useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import Header from "../components/Header";
import { useStaffStore } from "../store/useStaffStore";
import { MdAdd, MdAddAlert, MdAddCircle, MdAddHomeWork, MdMarkunread } from "react-icons/md";

const AssignedSubjects = () => {
  const { assignedSubjects, getAssignedSubjects, isLoading, } = useStaffStore();

  useEffect(() => {
    getAssignedSubjects();
  }, [getAssignedSubjects]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4 pt-24">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Assigned Subjects
        </h2>

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
                    <div className="w-10 h-10 rounded-full  bg-sky-700 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Batch: {subject.batchDetails?.name || "N/A"}
                      </p>
                    </div>
                  </div>
               
                  {subject.CEmark && (
                       <a
                       href={subject.batchDetails.CEmarkList}
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="Open internal mark sheet in a new tab"
                       > 
                    <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-amber-500 rounded-full px-3 py-2 shadow-md w-fit ">
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
