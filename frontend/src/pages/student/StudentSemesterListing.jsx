import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useMarksStore } from "../../store/useMarksStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const StudentSemesterListing = () => {
  const { semesters, getSemesters } = useMarksStore();
  const navigate = useNavigate();

  useEffect(() => {
    getSemesters();
  }, [getSemesters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-6 pt-24">
        <motion.div
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
         
          <motion.h1
                 className="col-span-full text-2xl font-extrabold text-gray-900 dark:text-white mt-6 ml-8 mb-4 font-oswald"
                 style={{ fontFamily: 'Poppins, sans-serif' }}
                 initial={{ opacity: 0, y: 100 }}
                 animate={{ opacity: 1, y: 0, transition: { duration: 1.1 } }}
                 >
                   Thamheediyya
               </motion.h1>

          {semesters.map((semester, index) => (
            <React.Fragment key={semester._id || index}>
              {index === 4 && (
                 <motion.h1
                 className="col-span-full text-2xl font-extrabold text-gray-900 dark:text-white mt-6 ml-8 mb-4 font-oswald"
                 style={{ fontFamily: 'Poppins, sans-serif' }}
                 initial={{ opacity: 0, y: 100 }}
                 animate={{ opacity: 1, y: 0, transition: { duration: 1.1 } }}
                 >
                   Aliya
               </motion.h1>
              
              )}

              <motion.div
                className="col-span-1"
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div
                  className="bg-white dark:bg-gray-700 rounded-xl shadow-lg dark:shadow-gray-900 p-6 cursor-pointer transition transform hover:-translate-y-2 hover:shadow-2xl"
                  onClick={() =>
                    navigate(`/dashboard/student/semester/${semester._id}`)
                  }
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-sky-800 dark:bg-sky-600 text-white flex items-center justify-center font-bold text-lg mr-4">
                      {index > 3 ? index - 3 : index + 1}
                    </div>
                    <div className="text-gray-900 dark:text-gray-200 text-lg font-medium font-sans">
                      {semester.name}
                    </div>
                  </div>
                </div>
              </motion.div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default StudentSemesterListing;
