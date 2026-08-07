import React, { useEffect, useState } from "react";
import { useMarksStore } from "../../store/useMarksStore";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminStore } from "../../store/useAdminMngStore";
import { useAchievement } from "../../store/achivemnetStore";
import { useReadingProgress } from "../../store/readingProgressStore";
import { Layers } from "lucide-react";

const AdminBatches = () => {
  const { item } = useParams();
  const navigate = useNavigate();

  const { batches, getBatches } = useAdminStore();
  const { markListCountToApprove, marksCountToApproveByBatch } = useMarksStore();
  const { achievementsCountToApprove, achieveCountToApproveByBatch } = useAchievement();
  const { progressCountToApprove, progressCountToApproveByBatch } = useReadingProgress();

  const [countToApprove, setCountToApprove] = useState([]);

  useEffect(() => {
    getBatches();
  }, [getBatches]);

  useEffect(() => {
    if (item === "marklist") {
      marksCountToApproveByBatch();
    } else if (item === "achievements") {
      achieveCountToApproveByBatch();
    } else if (item === "reading-progress") {
      progressCountToApproveByBatch();
    } else {
      console.warn("Unknown item:", item);
    }
  }, [item, marksCountToApproveByBatch, achieveCountToApproveByBatch, progressCountToApproveByBatch]);

  // Whenever the fetched arrays update, mirror them into local state
  useEffect(() => {
    let arr = [];
    if (item === "marklist") {
      arr = markListCountToApprove;
    } else if (item === "achievements") {
      arr = achievementsCountToApprove;
    } else if (item === "reading-progress") {
      arr = progressCountToApprove;
    }
    setCountToApprove([...arr]); // spread to ensure new reference
  }, [item, markListCountToApprove, achievementsCountToApprove, progressCountToApprove]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-teal/10 dark:bg-[#11322f] rounded-xl">
          <Layers className="text-brand-teal w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-oswald tracking-wide">
          Batches
        </h2>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {batches.map((batch, index) => {
          const badge = countToApprove.find((b) => String(b._id) === String(batch._id));
          return (
            <div
              key={batch._id || index}
              onClick={() => navigate(`/dashboard/admin/batches/${item}/${batch._id}`)}
              className="group bg-gradient-to-br from-white to-gray-50 dark:from-[#11322f] dark:to-[#0d2522] rounded-2xl p-5 border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-gray-100 dark:border-[#0d2522] hover:shadow-xl hover:-translate-y-1 hover:border-brand-teal/50 transition-all duration-300 relative flex flex-col cursor-pointer overflow-hidden"
            >
              {/* Left Accent Border */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-teal to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Decorative background element - wrapped to contain the blur */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-teal/5 rounded-full blur-2xl group-hover:bg-brand-teal/15 transition-colors"></div>
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-sky-400/5 rounded-full blur-2xl group-hover:bg-sky-400/10 transition-colors"></div>
                
                {/* Watermark Icon */}
                <Layers className="absolute -bottom-4 -right-4 w-24 h-24 text-gray-100 dark:text-[#16423e] rotate-[-15deg] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 opacity-50" />
              </div>

              {badge?.count > 0 && (
                <div className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white text-xs font-bold shadow-md border-2 border-white dark:border-[#11322f] z-20 animate-pulse">
                  {badge.count}
                </div>
              )}

              <div className="flex items-center justify-between relative z-10 h-full">
                <div className="flex items-center gap-4 flex-1 min-w-0 pr-6">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-white dark:bg-[#0d2522] text-brand-teal font-bold flex items-center justify-center border border-gray-100 dark:border-transparent shadow-sm text-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-brand-teal/20 group-hover:text-brand-teal relative overflow-hidden">
                     {/* Inner icon glow */}
                     <div className="absolute inset-0 bg-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <span className="relative z-10">{index + 1}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Batch Name</span>
                    <div className="text-[15px] sm:text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight group-hover:text-brand-teal transition-colors line-clamp-2">
                      {batch.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBatches;
