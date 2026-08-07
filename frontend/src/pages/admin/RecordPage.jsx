import React, { useState, useEffect, useMemo } from "react";
import { Plus, Save, X, Eye, Pencil, Trash2, Folder, FileText, Link as LinkIcon, Database, ArrowLeft } from "lucide-react";
import { useRecordStore } from "../../store/useRecordStore";

const RecordPage = () => {
  const {
    records,
    fetchRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    isLoading,
  } = useRecordStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", folder: "", link: "" });
  const [editingId, setEditingId] = useState(null);
  
  // New Folder State
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditClick = (record) => {
    setFormData({
      name: record.name || "",
      description: record.description || "",
      folder: record.folder || "",
      link: record.link || "",
    });
    setEditingId(record._id);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteRecord(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      await updateRecord(editingId, formData);
    } else {
      await addRecord(formData);
    }
    setFormData({ name: "", description: "", folder: "", link: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", folder: "", link: "" });
    setEditingId(null);
    setShowForm(false);
  };

  // Group records into folders dynamically
  const folderData = useMemo(() => {
    const folders = {};
    records.forEach(record => {
      const folderName = record.folder || "Uncategorized";
      if (!folders[folderName]) {
        folders[folderName] = { name: folderName, count: 0 };
      }
      folders[folderName].count += 1;
    });
    return Object.values(folders);
  }, [records]);

  // Filter records if a folder is selected
  const visibleRecords = useMemo(() => {
    if (!selectedFolder) return [];
    return records.filter(r => (r.folder || "Uncategorized") === selectedFolder);
  }, [records, selectedFolder]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-teal/10 dark:bg-[#11322f] rounded-xl flex items-center justify-center">
          <Database className="text-brand-teal w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-oswald tracking-wide">
          Academic Records
        </h2>
      </div>

      {/* Add / Edit Form Area */}
      <div className="max-w-2xl mx-auto mb-10">
        {!showForm ? (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              // Pre-fill folder if we are currently inside one
              setFormData({ 
                name: "", 
                description: "", 
                folder: selectedFolder && selectedFolder !== "Uncategorized" ? selectedFolder : "", 
                link: "" 
              });
            }}
            className="w-full group flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-[#11322f]/50 hover:bg-brand-teal/5 dark:hover:bg-brand-teal/10 hover:border-brand-teal/50 transition-all duration-300 shadow-sm"
          >
            <div className="p-3 bg-white dark:bg-[#0d2522] rounded-full shadow-sm text-gray-400 group-hover:text-brand-teal group-hover:scale-110 transition-all duration-300">
              <Plus size={24} />
            </div>
            <span className="font-semibold text-gray-600 dark:text-gray-300 group-hover:text-brand-teal transition-colors">
              Add New Record
            </span>
          </button>
        ) : (
          <div className="bg-white dark:bg-[#11322f] rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-[#0d2522] animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="text-brand-teal" size={20} />
                {editingId ? "Edit Record" : "Create New Record"}
              </h3>
              <button onClick={handleCancel} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-[#0d2522] rounded-full">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Name</label>
                  <input
                    autoFocus
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Timetable Software"
                    className="w-full px-4 py-2.5 rounded-xl border-0 bg-gray-50 dark:bg-[#0d2522] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-teal shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Folder</label>
                  <input
                    list="folder"
                    name="folder"
                    value={formData.folder}
                    onChange={handleChange}
                    placeholder="e.g. Academics"
                    className="w-full px-4 py-2.5 rounded-xl border-0 bg-gray-50 dark:bg-[#0d2522] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-teal shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all"
                  />
                  <datalist id="folder">
                    {folderData.map((f, index) => (
                      <option key={index} value={f.name === "Uncategorized" ? "" : f.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Link URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-0 bg-gray-50 dark:bg-[#0d2522] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-teal shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief details about this record..."
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl border-0 bg-gray-50 dark:bg-[#0d2522] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-teal shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#0d2522] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-teal hover:bg-brand-teal/90 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                  {editingId ? "Update Record" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Main View Area */}
      {selectedFolder === null ? (
        // === ROOT FOLDER VIEW ===
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-[#0d2522] pb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Folder className="text-brand-teal" size={20} />
              All Folders
            </h3>
            <span className="text-sm font-semibold text-gray-500 bg-gray-100 dark:bg-[#11322f] px-3 py-1 rounded-lg">
              {folderData.length} {folderData.length === 1 ? 'Folder' : 'Folders'}
            </span>
          </div>

          {folderData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-[#11322f]/30 rounded-3xl border border-dashed border-gray-200 dark:border-[#0d2522]">
              <Folder size={64} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">No folders yet.</p>
              <p className="text-sm opacity-70 mt-1">Create a record to generate a folder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {folderData.map((folder, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedFolder(folder.name)}
                  className="group cursor-pointer bg-white dark:bg-[#11322f] rounded-2xl p-5 border border-gray-100 dark:border-[#0d2522] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 hover:border-brand-teal/30 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
                >
                  {/* Hover Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Folder Icon */}
                  <div className="relative mb-4 mt-2">
                    <Folder 
                      size={56} 
                      className="text-brand-teal drop-shadow-md group-hover:scale-110 transition-transform duration-500 relative z-10" 
                      fill="currentColor"
                      fillOpacity={0.15}
                    />
                    {/* Badge */}
                    <div className="absolute -top-1 -right-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-20 border-2 border-white dark:border-[#11322f]">
                      {folder.count}
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm md:text-base leading-tight line-clamp-2 relative z-10">
                    {folder.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1.5 font-medium relative z-10 group-hover:text-brand-teal/70 transition-colors">
                    View Records →
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // === INSIDE FOLDER VIEW ===
        <div className="animate-slideInRight">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 dark:border-[#0d2522] pb-4">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium">
              <button 
                onClick={() => setSelectedFolder(null)}
                className="hover:text-brand-teal transition-colors flex items-center gap-1.5"
              >
                <Folder size={18} />
                Folders
              </button>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="text-gray-900 dark:text-gray-100 font-bold flex items-center gap-2 bg-gray-100 dark:bg-[#11322f] px-3 py-1.5 rounded-lg shadow-sm">
                <Folder size={16} className="text-brand-teal" fill="currentColor" fillOpacity={0.2} />
                {selectedFolder}
              </span>
            </div>
            
            <button
              onClick={() => setSelectedFolder(null)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#11322f] text-gray-700 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-[#0d2522] shadow-sm hover:bg-gray-50 dark:hover:bg-[#0d2522] hover:text-brand-teal transition-all text-sm font-bold"
            >
              <ArrowLeft size={16} />
              Back to Folders
            </button>
          </div>

          {/* Records Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {visibleRecords.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-[#11322f]/30 rounded-3xl border border-dashed border-gray-200 dark:border-[#0d2522]">
                <FileText size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-medium">This folder is empty.</p>
              </div>
            ) : (
              visibleRecords.map((record, index) => (
                <div
                  key={record._id || index}
                  className="group flex flex-col bg-white dark:bg-[#11322f] rounded-2xl p-5 border border-gray-100 dark:border-[#0d2522] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 hover:border-brand-teal/40 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Top Color Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-teal to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="flex flex-col relative z-10 h-full">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-teal/10 dark:bg-[#0d2522] text-brand-teal flex items-center justify-center relative overflow-hidden group-hover:bg-brand-teal group-hover:text-white transition-colors duration-300">
                           <FileText size={20} />
                        </div>
                        <h2 className="text-[15px] sm:text-[17px] font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">
                          {record.name}
                        </h2>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEditClick(record)}
                          className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                          title="Edit Record"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(record._id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex-1 px-1">
                      {record.description ? (
                        <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                          {record.description}
                        </p>
                      ) : (
                        <p className="text-[13px] text-gray-400 dark:text-gray-600 italic">No description provided.</p>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-[#0d2522]">
                      {record.link ? (
                        <a
                          href={record.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-[#0d2522] text-brand-teal font-bold text-sm hover:bg-brand-teal hover:text-white transition-all duration-300 group/btn"
                        >
                          <Eye size={16} className="group-hover/btn:scale-110 transition-transform" /> 
                          Open Document
                        </a>
                      ) : (
                        <span className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-[#0d2522] text-gray-400 text-sm font-medium border border-transparent">
                          <LinkIcon size={16} /> No Link Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordPage;
