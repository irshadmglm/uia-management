import React, { useState, useEffect } from "react";
import { useAdminStore } from "../../store/useAdminMngStore";
import { useStaffStore } from "../../store/useStaffStore";
import { 
  FiPlus, FiEdit2, FiTrash2, FiSave, FiX, 
  FiLayers, FiBook, FiUsers, FiCalendar, FiSearch 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

// --- Sub-Components Definitions (Moved to top for clarity) ---

const StatusBadge = ({ isAssigned }) => (
  <span
    className={`ml-2 px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full ${
      isAssigned
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    }`}
  >
    {isAssigned ? "Active" : "Pending"}
  </span>
);

const AssignmentCard = ({ 
  name, 
  isAssigned, 
  assignedName, 
  isEditing, 
  toggleEdit, 
  children,
  icon: Icon = FiCalendar
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden group hover:shadow-md transition-all">
    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
      <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
        {name}
        <StatusBadge isAssigned={isAssigned} />
      </h3>
      <button
        onClick={toggleEdit}
        className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        {isEditing ? <FiX /> : <FiEdit2 />}
      </button>
    </div>

    <div className="p-5">
      {isEditing ? (
        children
      ) : (
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
            isAssigned 
              ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400" 
              : "bg-slate-100 text-slate-400 dark:bg-slate-800"
          }`}>
            <Icon />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Current Semester</p>
            <p className="font-bold text-slate-800 dark:text-white text-lg">
              {assignedName || "Not assigned"}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);

const SemesterAssignment = ({ batches, semesters, tab, art = false }) => {
  const [batchAssignments, setBatchAssignments] = useState({});
  const [editMode, setEditMode] = useState({});

  useEffect(() => {
    const modified = {};
    for (const cl of batches) {
      if (art) {
        modified[cl._id] = cl.currentArtSemester || "";
      } else {
        modified[cl._id] = cl.currentSemester || "";
      }
    }
    setBatchAssignments(modified);
  }, [batches, tab, art]);

  const handleSemesterSelect = async (classId, semesterId) => {
    try {
      // Optimistic update
      setBatchAssignments((prev) => ({ ...prev, [classId]: semesterId }));
      
      // API Call
      await axiosInstance.post("/mng/asign-semester", {
        classId,
        semesterId,
        art
      });

      toast.success("Semester assigned successfully!");
      setEditMode((prev) => ({ ...prev, [classId]: false }));
    } catch (error) {
      toast.error("Failed to update semester.");
      console.error(error);
    }
  };

  const toggleEditMode = (batchId) => {
    setEditMode((prev) => ({ ...prev, [batchId]: !prev[batchId] }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {batches.map((batch) => {
        const semesterId = batchAssignments[batch._id];
        const semester = semesters.find((s) => s._id === semesterId);
        const isEditing = editMode[batch._id];

        return (
          <AssignmentCard
            key={batch._id}
            name={batch.name}
            isAssigned={!!semester}
            assignedName={semester?.name}
            isEditing={isEditing}
            toggleEdit={() => toggleEditMode(batch._id)}
          >
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Assign {art ? "Art " : ""}Semester
              </label>
              <select
                value={batchAssignments[batch._id] || ""}
                onChange={(e) => handleSemesterSelect(batch._id, e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-white"
              >
                <option value="">Select Semester...</option>
                {semesters.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </AssignmentCard>
        );
      })}
    </div>
  );
};

// --- Main Page Component ---

const ManagementPage = () => {
  const { 
    getBatches, getSemesters, getTeachers, getArtSems,
    batches, semesters, teachers, artSems, 
    updateSemester, updateBatch, updateSelectedTab, updateArtSem,
    deleteBatch, deleteSemester, deleteArtSems 
  } = useAdminStore();
  const { deleteTeacher } = useStaffStore();
  
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("selectedTab") || "batches");
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Edit/Add States
  const [showAdd, setShowAdd] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  
  const navigate = useNavigate();

  // Persist Tab
  useEffect(() => {
    localStorage.setItem("selectedTab", activeTab);
  }, [activeTab]);

  // Initial Data Fetch
  useEffect(() => {
    const load = async () => {
      await Promise.all([getBatches(), getSemesters(), getArtSems(), getTeachers()]);
    };
    load();
  }, []);

  // Sync Items with Tab
  useEffect(() => {
    const dataMap = {
      "batches": batches,
      "current Semester": semesters, // Logic for Assignment Component handled separately
      "semester Subjects": semesters,
      "arts Subjects": artSems,
      "teachers": teachers
    };
    // For assignment tabs, we don't need to populate 'items' array
    if (!["current Semester", "current Art Sems"].includes(activeTab)) {
      setItems(dataMap[activeTab] || []);
    }
    setShowAdd(false);
    setEditId(null);
  }, [activeTab, batches, semesters, artSems, teachers]);

  const handleAdd = async () => {
    if (!newItemName.trim()) return toast.error("Name is required");
    try {
      await updateSelectedTab(activeTab, newItemName);
      setNewItemName("");
      setShowAdd(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This action is irreversible.")) return;
    
    if (activeTab === "batches") await deleteBatch(id);
    else if (activeTab === "semester Subjects") await deleteSemester(id);
    else if (activeTab === "arts Subjects") await deleteArtSems(id);
    else if (activeTab === "teachers") await deleteTeacher(id);
  };

  const handleUpdate = async (id) => {
    if (activeTab === "batches") await updateBatch(id, editName);
    else if (activeTab === "semester Subjects") await updateSemester(id, editName);
    else if (activeTab === "arts Subjects") await updateArtSem(id, editName);
    
    setEditId(null);
  };

  // Tab Configuration
  const TABS = [
    { id: "batches", label: "Batches", icon: FiLayers },
    { id: "current Semester", label: "Assign Semesters", icon: FiCalendar }, 
    { id: "current Art Sems", label: "Assign Art Sems", icon: FiCalendar }, 
    { id: "semester Subjects", label: "Subjects", icon: FiBook },
    { id: "arts Subjects", label: "Art Subjects", icon: FiBook },
    { id: "teachers", label: "Teachers", icon: FiUsers },
  ];

  // Logic to render specialized assignment components vs the generic list
  const isGenericList = !["current Semester", "current Art Sems"].includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark pb-20">
      <Header page="Management" />
      
      <div className="max-w-6xl mx-auto px-4 mt-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white">
              Academic Setup
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Configure batch structures and curriculum.
            </p>
          </div>

          {isGenericList && (
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                ${activeTab === tab.id 
                  ? "bg-primary-600 text-white shadow-md" 
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400"}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* --- DYNAMIC CONTENT --- */}
        
        {/* 1. Specialized Assignment Components */}
        {activeTab === "current Semester" && (
          <SemesterAssignment batches={batches} semesters={semesters} tab={activeTab} />
        )}
        
        {activeTab === "current Art Sems" && (
          <SemesterAssignment batches={batches} semesters={artSems} tab={activeTab} art={true} />
        )}

        {/* 2. Generic List View (Batches, Subjects, Teachers) */}
        {isGenericList && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Add New Card */}
            <motion.div 
              layout
              className={`p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors bg-slate-50/50 dark:bg-slate-800/50 min-h-[140px]
                ${showAdd ? "bg-white dark:bg-slate-800 border-solid border-slate-200" : ""}`}
              onClick={() => !showAdd && setShowAdd(true)}
            >
              {showAdd ? (
                activeTab === "teachers" ? (
                  navigate("/dashboard/admin/signup")
                ) : (
                  <div className="w-full space-y-3" onClick={e => e.stopPropagation()}>
                    <input 
                      autoFocus
                      placeholder={`New ${activeTab.replace(/s$/, "")}...`}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-white"
                      value={newItemName}
                      onChange={e => setNewItemName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setShowAdd(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><FiX /></button>
                      <button onClick={handleAdd} className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-500/30"><FiSave /></button>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center text-slate-400 group">
                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <FiPlus size={24} className="text-primary-500" />
                  </div>
                  <span className="font-medium text-sm">Add New {activeTab === "teachers" ? "Staff" : "Item"}</span>
                </div>
              )}
            </motion.div>

            {/* List Items */}
            <AnimatePresence>
              {items
                .filter(item => (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
                .map((item, idx) => (
                  <motion.div
                    key={item._id || idx}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 group hover:shadow-lg hover:border-primary-200 dark:hover:border-slate-600 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-display font-bold text-slate-500">
                          {idx + 1}
                        </div>
                        
                        {editId === item._id ? (
                          <input 
                            autoFocus
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-primary-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-white"
                          />
                        ) : (
                          <div className="flex-1 min-w-0">
                            <h3 
                              onClick={() => {
                                // Smart Navigation based on Item Type
                                if (activeTab === "batches") navigate(`/dashboard/admin/attendance/${item._id}`);
                                else if (activeTab === "semester Subjects") navigate(`/dashboard/admin/semester/${item._id}`);
                                else if (activeTab === "arts Subjects") navigate(`/dashboard/admin/arts/${item._id}`);
                                else if (activeTab === "teachers") navigate(`/dashboard/admin/teacher-subjects/${item._id}`);
                              }}
                              className="font-bold text-slate-800 dark:text-white cursor-pointer hover:text-primary-600 transition-colors truncate"
                            >
                              {item.name}
                            </h3>
                            {item.userName && <p className="text-xs text-slate-400">@{item.userName}</p>}
                          </div>
                        )}
                      </div>

                      {/* Hover Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        {editId === item._id ? (
                          <button onClick={() => handleUpdate(item._id)} className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"><FiSave /></button>
                        ) : (
                          <button 
                            onClick={() => { 
                              if (activeTab === "teachers") navigate(`/dashboard/admin/staff-edit/${item._id}`);
                              else { setEditId(item._id); setEditName(item.name); }
                            }} 
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          >
                            <FiEdit2 size={16} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"><FiTrash2 size={16} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementPage;