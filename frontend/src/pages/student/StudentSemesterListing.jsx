import React, { useEffect, useState } from "react";
import { useMarksStore } from "../../store/useMarksStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, BookOpen, Award, ArrowRight, 
  Sparkles, FileText, CheckCircle2, ChevronRight, Layers
} from "lucide-react";

const StudentSemesterListing = () => {
  const { semesters, getSemesters, isLoading } = useMarksStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    getSemesters();
  }, [getSemesters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 },
    },
  };

  // Group semesters
  const thamheediyyaList = semesters.slice(0, 4);
  const aliyaList = semesters.slice(4);

  const renderSemesterGrid = (items, startIndex = 0, categoryName = "") => (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((semester, idx) => {
        const semesterNumber = startIndex + idx + 1;
        const displayNum = idx + 1;

        return (
          <motion.div
            key={semester._id || idx}
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group cursor-pointer"
            onClick={() => navigate(`/dashboard/student/semester/${semester._id}`)}
          >
            <div className="relative bg-white dark:bg-[#11322f] p-5 rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-xl hover:border-brand-teal/40 dark:hover:border-brand-mint/40 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full">
              
              {/* Subtle top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-teal via-brand-mint to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#11322f] to-[#0d2522] text-brand-mint border border-brand-teal/30 flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                  {displayNum}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-mint/10 text-brand-teal dark:text-brand-mint border border-brand-mint/20">
                  {categoryName}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight group-hover:text-brand-teal dark:group-hover:text-brand-mint transition-colors">
                  {semester.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <FileText size={13} className="text-gray-400" />
                  View Mark List & Grades
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 dark:border-[#0d2522] flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-300 group-hover:text-brand-teal dark:group-hover:text-brand-mint transition-colors">
                <span>Access Results</span>
                <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-[#0d2522] flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-all">
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fadeIn pb-8">
      
      {/* Page Header */}
      <div className="relative bg-[#0d2522] rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden border border-[#11322f]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#11322f] via-[#0d2522] to-[#071a18]"></div>
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-brand-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-brand-mint/15 rounded-full blur-2xl"></div>
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize:'24px 24px'}}></div>
        <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-gradient-to-b from-brand-mint via-brand-teal to-transparent rounded-r-full"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="pl-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-brand-mint/90 uppercase tracking-[0.2em] bg-brand-mint/10 px-2.5 py-1 rounded-full border border-brand-mint/20">
                Academic Evaluation
              </span>
              <span className="text-[10px] font-semibold text-white/50 bg-white/10 px-2.5 py-1 rounded-full">
                Semester Results
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight flex items-center gap-3">
              <GraduationCap className="text-brand-mint w-8 h-8 sm:w-10 sm:h-10" />
              Semester Exam Mark Lists
            </h1>
            <p className="text-white/60 text-xs sm:text-sm max-w-xl leading-relaxed">
              Select your academic semester below to inspect detailed subject scores, grades, and semester performance records.
            </p>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-brand-mint/10 border border-brand-mint/20 flex-shrink-0">
            <Layers className="w-10 h-10 text-brand-mint" />
            <span className="text-[9px] text-brand-mint/80 font-bold uppercase tracking-wider mt-1">
              {semesters.length} Semesters
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#0d2522] pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "all"
              ? "bg-[#11322f] text-white shadow-md"
              : "bg-white dark:bg-[#11322f]/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          All Semesters ({semesters.length})
        </button>
        <button
          onClick={() => setActiveTab("thamheediyya")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "thamheediyya"
              ? "bg-[#11322f] text-white shadow-md"
              : "bg-white dark:bg-[#11322f]/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Thamheediyya ({thamheediyyaList.length})
        </button>
        <button
          onClick={() => setActiveTab("aliya")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "aliya"
              ? "bg-[#11322f] text-white shadow-md"
              : "bg-white dark:bg-[#11322f]/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Aliya ({aliyaList.length})
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-36 bg-gray-200 dark:bg-[#11322f] rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Thamheediyya Section */}
          {(activeTab === "all" || activeTab === "thamheediyya") && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-teal/10 text-brand-teal dark:text-brand-mint">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Thamheediyya
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Foundation academic semesters (Semesters 1 - 4)
                  </p>
                </div>
              </div>

              {renderSemesterGrid(thamheediyyaList, 0, "Thamheediyya")}
            </div>
          )}

          {/* Aliya Section */}
          {(activeTab === "all" || activeTab === "aliya") && aliyaList.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Award size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Aliya
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Advanced higher academic semesters (Semesters 5+)
                  </p>
                </div>
              </div>

              {renderSemesterGrid(aliyaList, 4, "Aliya")}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default StudentSemesterListing;
