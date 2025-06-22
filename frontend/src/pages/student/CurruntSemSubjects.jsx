import React, { useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import Header from "../../components/Header";
import { MdAdd, MdAddAlert, MdAddCircle, MdAddHomeWork, MdMarkunread } from "react-icons/md";
import { useStudentStore } from "../../store/studentStore";
import { useParams } from "react-router-dom";

const CurruntSemSubjects = () => {
  const {semSubjects, getCurruntSemSubjects, isLoading} = useStudentStore();

  useEffect(() => {
    getCurruntSemSubjects();
  }, [getCurruntSemSubjects]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4 pt-24">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Sem Subjects
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-8 h-8 text-gray-600 dark:text-white" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {semSubjects.map((subject, index) => (
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
                      Teacher: {subject?.subTeacherInfo?.[0]?.name || "Teacher not assigned"}
                      </p>
                      {
                        subject?.subTeacher2Info.length > 0  &&
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                        Teacher 2: {subject?.subTeacher2Info?.[0]?.name || "Teacher not assigned"}
                        </p>
                      }
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        mark: {subject?.mark}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                       CE mark: {subject?.CEmark === true ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
               
                

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CurruntSemSubjects;