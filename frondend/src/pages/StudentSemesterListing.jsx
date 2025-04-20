import React, { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import { useMarksStore } from "../store/useMarksStore";
import MarkListPage from "./MarkListPage";
import { useNavigate } from "react-router-dom";

const StudentSemesterListing = () => {
  const { semesters, getSemesters } = useMarksStore();
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    getSemesters();
  }, [getSemesters]); 

  
 
  const navigate = useNavigate();
  return (
    <>
      <Header />
      { 
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-6 pt-24">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <h2 className="col-span-full text-2xl font-extrabold text-gray-900 dark:text-white mb-4 ml-8 font-oswald">
              Thamheadia
            </h2>

            {semesters.map((semester, index) => (
              <React.Fragment key={semester.id || index}>
                {index === 4 && (
                  <h2 className="col-span-full text-2xl font-extrabold text-gray-900 dark:text-white mt-6 ml-8 mb-4 font-oswald">
                    Aliya
                  </h2>
                )}
                <div className="block" onClick={() => navigate(`/dashboard/student/semester/${semester._id}`)}>
                  <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg dark:shadow-gray-900 p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full  bg-sky-800 dark:bg-sky-600 text-white flex items-center justify-center font-bold text-lg mr-4">
                        {index > 3 ? index - 3 : index + 1}
                      </div>
                      <div className="text-gray-900 dark:text-gray-200 text-lg font-medium font-sans">
                        {semester.name}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      }
    </>
  );
};

export default StudentSemesterListing;
