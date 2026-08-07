import React, { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Link as LinkIcon, Check, X } from "lucide-react";
import { useAdminStore } from "../../store/useAdminMngStore";

const IRMarkAdmin = () => {
  const { batches, getBatches, addBatchIRmarklink } = useAdminStore();
  const [irMarklistLink, setIrMarklistLink] = useState("");
  const [editingBatchId, setEditingBatchId] = useState(null);

  useEffect(() => {
    getBatches();
  }, [getBatches]);

  const handleSubmit = async (batchId) => {
    const isValidLink = irMarklistLink.includes("https://docs.google.com/spreadsheets");
    if (!isValidLink) return alert("Please enter a valid Google Sheets link.");

    try {
      await addBatchIRmarklink(irMarklistLink, batchId);
      await getBatches();
      setEditingBatchId(null);
      setIrMarklistLink("");
    } catch (err) {
      console.error("Failed to update IR link", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-teal/10 dark:bg-[#11322f] rounded-xl">
          <LinkIcon className="text-brand-teal w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-oswald tracking-wide">
          IR Mark Lists
        </h2>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {batches.map((batch, index) => (
          <div
            key={batch._id || index}
            className={`group bg-white dark:bg-[#11322f] rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col ${
              editingBatchId === batch._id 
                ? "shadow-lg border-brand-teal/50 dark:border-brand-teal/50 ring-4 ring-brand-teal/10" 
                : "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-gray-100 dark:border-[#0d2522] hover:shadow-xl hover:-translate-y-1 hover:border-brand-teal/30"
            }`}
          >
            {/* Decorative background element */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-teal/5 rounded-full blur-2xl group-hover:bg-brand-teal/10 transition-colors pointer-events-none"></div>

            <div className="flex items-start justify-between mb-2 relative z-10">
              <div className="flex items-start gap-3 flex-1 min-w-0 pr-2">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-50 dark:bg-[#0d2522] text-brand-teal font-bold flex items-center justify-center border border-gray-100 dark:border-transparent shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                  {index + 1}
                </div>
                <div className="text-[15px] sm:text-base font-semibold text-gray-800 dark:text-gray-100 leading-snug mt-1">
                  {batch.name}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 bg-white/80 dark:bg-[#11322f]/80 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-gray-50 dark:border-[#0d2522]">
                {!batch?.IRmarkList ? (
                  <button
                    onClick={() => {
                      setEditingBatchId(batch._id);
                      setIrMarklistLink("");
                    }}
                    className="p-1.5 rounded-lg text-brand-teal hover:bg-brand-teal/10 transition-colors"
                    title="Add Link"
                  >
                    <Plus size={16} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingBatchId(batch._id);
                        setIrMarklistLink(batch.IRmarkList || "");
                      }}
                      className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                      title="Edit Link"
                    >
                      <Pencil size={16} />
                    </button>
                    <a
                      href={batch.IRmarkList}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
                      title="View Sheet"
                    >
                      <Eye size={16} />
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Input Field Area */}
            {editingBatchId === batch._id ? (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#0d2522] animate-fadeIn relative z-10">
                <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">Google Sheet URL</label>
                <input
                  type="text"
                  value={irMarklistLink}
                  onChange={(e) => setIrMarklistLink(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/..."
                  className="w-full bg-gray-50 dark:bg-[#0d2522] border-0 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-teal placeholder-gray-400 dark:placeholder-gray-600 mb-4 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingBatchId(null);
                      setIrMarklistLink("");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#0d2522] rounded-lg transition-colors"
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    onClick={() => handleSubmit(batch._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-lg transition-colors shadow-sm"
                  >
                    <Check size={14} /> Save Link
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-auto pt-4 relative z-10 flex">
                {batch?.IRmarkList ? (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/20 uppercase tracking-wide">
                    <Check size={12} strokeWidth={3} /> Link Active
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#0d2522] px-2.5 py-1 rounded-md border border-gray-100 dark:border-transparent uppercase tracking-wide">
                    <X size={12} strokeWidth={3} /> No Link
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IRMarkAdmin;
