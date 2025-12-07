import React, { useState, useEffect } from "react";
import { 
  Folder, FileText, Search, Plus, MoreVertical, 
  ExternalLink, Edit3, Trash2, X, Save, File, 
  LayoutGrid, List as ListIcon, FolderOpen 
} from "lucide-react";
import { useRecordStore } from "../../store/useRecordStore";
import Header from "../../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";

const RecordPage = () => {
  const { authUser } = useAuthStore();
  const {
    records,
    fetchRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    isLoading,
  } = useRecordStore();

  const [activeFolder, setActiveFolder] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Extract unique folders
  const folders = ["All", ...new Set(records.map(r => r.folder).filter(Boolean))];

  // Filter logic
  const filteredRecords = records.filter(record => {
    const matchesFolder = activeFolder === "All" || record.folder === activeFolder;
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      await deleteRecord(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark pb-20">
      <Header page="Academic Repository" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* 1. Top Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
              Documents & Records
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage syllabus, circulars, and academic resources.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-slate-100 dark:bg-slate-700 text-primary-600" : "text-slate-400"}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-slate-100 dark:bg-slate-700 text-primary-600" : "text-slate-400"}`}
              >
                <ListIcon size={18} />
              </button>
            </div>

            {/* Add Button (Admin Only) */}
            {authUser?.role === "admin" && (
              <button
                onClick={() => { setEditingRecord(null); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Upload</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Folder Navigation */}
        <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide mb-6">
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap
                ${activeFolder === folder 
                  ? "bg-white dark:bg-slate-800 border-primary-500 text-primary-600 shadow-md ring-1 ring-primary-500/20" 
                  : "bg-slate-100 dark:bg-slate-800/50 border-transparent text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"}
              `}
            >
              {activeFolder === folder ? <FolderOpen size={18} /> : <Folder size={18} />}
              <span className="font-medium text-sm">{folder}</span>
            </button>
          ))}
        </div>

        {/* 3. File Display Area */}
        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <FolderOpen size={32} />
            </div>
            <p>No records found in this folder.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className={
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "flex flex-col gap-3"
            }
          >
            <AnimatePresence>
              {filteredRecords.map((record) => (
                <FileCard 
                  key={record._id} 
                  record={record} 
                  viewMode={viewMode}
                  onEdit={() => handleEdit(record)}
                  onDelete={() => handleDelete(record._id)}
                  isAdmin={authUser?.role === "admin"}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* 4. Add/Edit Modal */}
      {isModalOpen && (
        <RecordModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          initialData={editingRecord}
          folders={folders}
          onSubmit={editingRecord ? updateRecord : addRecord}
        />
      )}
    </div>
  );
};

// --- Sub-Component: File Card ---
const FileCard = ({ record, viewMode, onEdit, onDelete, isAdmin }) => {
  const isGrid = viewMode === "grid";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden
        ${isGrid ? "p-5 flex flex-col h-full" : "p-4 flex items-center justify-between"}
      `}
    >
      {/* Icon & Decor */}
      <div className={`flex items-start gap-4 ${isGrid ? "mb-4" : ""}`}>
        <div className={`shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800 text-blue-600 dark:text-blue-400
          ${isGrid ? "w-14 h-14" : "w-12 h-12"}
        `}>
          <FileText size={isGrid ? 28 : 24} />
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-800 dark:text-white truncate" title={record.name}>
            {record.name}
          </h3>
          {isGrid && (
            <>
              <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-500">
                {record.folder || "Uncategorized"}
              </span>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 h-10">
                {record.description || "No description provided."}
              </p>
            </>
          )}
          {!isGrid && (
             <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-md">
               {record.description} • <span className="font-medium text-slate-400">{record.folder}</span>
             </p>
          )}
        </div>
      </div>

      {/* Actions Footer */}
      <div className={`flex items-center gap-2 ${isGrid ? "mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50" : ""}`}>
        {record.link && (
          <a 
            href={record.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-blue-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors group/link"
          >
            <ExternalLink size={16} className="group-hover/link:text-blue-500" />
            Open
          </a>
        )}
        
        {isAdmin && (
          <div className={`flex gap-1 ${!isGrid && "ml-4"}`}>
            <button onClick={onEdit} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <Edit3 size={18} />
            </button>
            <button onClick={onDelete} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Sub-Component: Modal Form ---
const RecordModal = ({ isOpen, onClose, initialData, onSubmit, folders }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    folder: initialData?.folder || "",
    link: initialData?.link || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if(initialData) await onSubmit(initialData._id, formData);
    else await onSubmit(formData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData ? "Edit File" : "Upload New File"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">File Name</label>
            <div className="relative">
              <File className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="e.g. Exam Schedule 2025"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Folder / Category</label>
            <div className="relative">
              <Folder className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                list="folderOptions"
                value={formData.folder}
                onChange={e => setFormData({...formData, folder: e.target.value})}
                className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="e.g. Syllabus"
              />
              <datalist id="folderOptions">
                {folders.filter(f => f !== "All").map(f => <option key={f} value={f} />)}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link URL</label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                value={formData.link}
                onChange={e => setFormData({...formData, link: e.target.value})}
                className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              placeholder="Add details..."
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all">
              <Save size={18} /> Save Record
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RecordPage;