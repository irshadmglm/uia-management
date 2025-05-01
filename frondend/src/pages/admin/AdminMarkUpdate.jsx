import React, { useEffect, useState} from "react";
import Header from "../../components/Header";
import { useMarksStore } from "../../store/useMarksStore";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../store/useAdminMngStore";

const AdminMarkUpdate = () => {
  const {batches, getBatches} = useAdminStore();
  const {countToApprove, getcountToApprove} = useMarksStore()

  useEffect(() => {
    getBatches();
    
  }, [getBatches]); 

useEffect(() => {
    getcountToApprove();
    console.log(countToApprove);
}, [])

  const navigate = useNavigate();
  return (
    <>
      <Header />
      { 
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-6 pt-24">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <h2 className="col-span-full text-2xl font-extrabold text-gray-900 dark:text-white mb-4 ml-8 font-oswald">
              Batches
            </h2>

            {batches.map((batch, index) => (
              <React.Fragment key={batch.id || index}>
               
                                <div className="relative block" onClick={() => navigate(`/dashboard/admin/batches/marklist/${batch._id}`)}>
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg dark:shadow-gray-900 p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer relative">
                    
                    {/* 🔹 Badge for Pending Approvals */}
                    {countToApprove && countToApprove.find((b) => b._id === batch._id)?.count > 0 && (
                    <div className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
                        {countToApprove.find((b) => b._id === batch._id)?.count}
                    </div>
                    )}

                    <div className="flex items-center">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full  bg-sky-800 dark:bg-sky-600 text-white flex items-center justify-center font-bold text-lg mr-4">
                        {index + 1}
                    </div>
                    <div className="text-gray-900 dark:text-gray-200 text-lg font-medium font-sans">
                        {batch.name}
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


export default AdminMarkUpdate