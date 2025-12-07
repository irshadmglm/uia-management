import React, { useState, useEffect } from "react";
import { 
  Users, BookOpen, Calendar, Search, 
  CheckCircle2, X, ChevronRight, UserCheck, 
  Layers, AlertCircle, Sparkles, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "../../store/useAdminMngStore";
import { useStudentStore } from "../../store/studentStore";
import { axiosInstance } from "../../lib/axios";
import Header from "../../components/Header";
import toast from "react-hot-toast";
import TimetableAssignment from "./TimetableAsigment"; // We will update this file next

// --- Constants ---
const TABS = [
  { id: "subjects", label: "Subject Allocation", icon: BookOpen, color: "blue" },
  { id: "artSubjects", label: "Art Subjects", icon: Sparkles, color: "purple" },
  { id: "classTeacher", label: "Class Mentors", icon: Users, color: "emerald" },
  { id: "currentSemester", label: "Semester Setup", icon: Calendar, color: "amber" },
  { id: "classLeader", label: "Class Leaders", icon: UserCheck, color: "rose" },
  { id: "timeTable", label: "Timetable", icon: Layers, color: "slate" },
];

// --- Helper Components ---

const ResourceSidebar = ({ title, items, selectedItem, onItemSelect, searchPlaceholder = "Search..." }) => {
  const [query, setQuery] = useState("");
  
  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col h-[600px] shadow-lg sticky top-6">
      <div className="p-5 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white mb-3">{title}</h3>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder={searchPlaceholder} 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredItems.map(item => (
          <button
            key={item._id}
            onClick={() => onItemSelect(item)}
            className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all duration-200 group
              ${selectedItem?._id === item._id 
                ? "bg-primary-600 text-white shadow-md transform scale-[1.02]" 
                : "hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}
          >
            <span className="font-medium text-sm truncate">{item.name}</span>
            {selectedItem?._id === item._id && <CheckCircle2 size={16} />}
          </button>
        ))}
        {filteredItems.length === 0 && (
          <p className="text-center text-xs text-slate-400 mt-4">No items found</p>
        )}
      </div>
    </div>
  );
};

const TargetCard = ({ title, subtitle, assignedTo, onAssign, isActive, secondaryAssignedTo }) => {
  return (
    <motion.button
      layout
      whileTap={{ scale: 0.98 }}
      onClick={onAssign}
      className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col gap-3 group
        ${isActive 
          ? "border-primary-400 bg-primary-50 dark:bg-primary-900/10 cursor-pointer ring-2 ring-primary-200 dark:ring-primary-900/30" 
          : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
        }
      `}
    >
      <div className="flex justify-between items-start w-full">
        <div>
          <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {isActive && (
          <span className="bg-primary-600 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm animate-pulse">
            ASSIGN
          </span>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700/50 w-full">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Current</p>
        <div className="flex items-center gap-2">
          {assignedTo ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
              <UserCheck size={12} /> {assignedTo}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 text-xs font-medium">
              <AlertCircle size={12} /> Unassigned
            </span>
          )}
          
          {secondaryAssignedTo && (
             <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
             <UserCheck size={12} /> {secondaryAssignedTo}
           </span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

// --- Allocator Views ---

const AllocatorView = ({ 
  resourceTitle, 
  resources, 
  targets, 
  onAssign, 
  targetLabelKey = "name",
  targetSubKey = "batchName",
  assignKey = "assignedName"
}) => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [filter, setFilter] = useState("");

  const filteredTargets = targets.filter(t => 
    t[targetLabelKey].toLowerCase().includes(filter.toLowerCase()) || 
    (t[targetSubKey] && t[targetSubKey].toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Left: Source Pool */}
      <ResourceSidebar 
        title={resourceTitle} 
        items={resources} 
        selectedItem={selectedResource} 
        onItemSelect={setSelectedResource}
      />

      {/* Right: Target Grid */}
      <div className="flex-1 w-full">
        {/* Toolbar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${selectedResource ? "bg-primary-100 text-primary-600" : "bg-slate-100 text-slate-400"}`}>
              {selectedResource ? <CheckCircle2 size={20} /> : <Filter size={20} />}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Currently Selected</p>
              <p className="font-bold text-slate-800 dark:text-white">
                {selectedResource ? selectedResource.name : "Select from sidebar..."}
              </p>
            </div>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              placeholder="Filter targets..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTargets.map((target) => (
            <TargetCard
              key={target._id}
              title={target[targetLabelKey]}
              subtitle={target[targetSubKey]}
              assignedTo={target[assignKey]}
              secondaryAssignedTo={target.assignedName2}
              isActive={!!selectedResource}
              onAssign={() => {
                if(!selectedResource) return toast.error(`Please select a ${resourceTitle.toLowerCase().slice(0, -1)} first.`);
                onAssign(target._id, selectedResource._id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Specialized Assignments ---

const ClassLeaderAllocator = ({ batches, students }) => {
  // Since leaders are batch-specific, we can't use the generic allocator easily.
  // We'll use a batch-focused card view with an inline selector.
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    const map = {};
    batches.forEach(b => {
      map[b._id] = { leader1: b.classLeader, leader2: b.classLeader2 };
    });
    setAssignments(map);
  }, [batches]);

  const handleAssign = async (batchId, studentId, isSecond = false) => {
    try {
      await axiosInstance.post("/mng/asign-class-leader", {
        classId: batchId,
        studentId,
        second: isSecond
      });
      toast.success("Leader assigned successfully");
      setAssignments(prev => ({
        ...prev,
        [batchId]: {
          ...prev[batchId],
          [isSecond ? 'leader2' : 'leader1']: studentId
        }
      }));
    } catch (error) {
      toast.error("Failed to assign leader");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {batches.map(batch => {
        const batchStudents = students.filter(s => s.batchId === batch._id);
        const current = assignments[batch._id] || {};

        return (
          <div key={batch._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
            <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Layers size={18} className="text-primary-500" /> {batch.name}
            </h4>
            
            <div className="space-y-4">
              {/* Leader 1 */}
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Class Leader 1</label>
                <select 
                  className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary-500"
                  value={current.leader1 || ""}
                  onChange={(e) => handleAssign(batch._id, e.target.value)}
                >
                  <option value="">Select Leader...</option>
                  {batchStudents.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>

              {/* Leader 2 */}
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Class Leader 2</label>
                <select 
                  className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary-500"
                  value={current.leader2 || ""}
                  onChange={(e) => handleAssign(batch._id, e.target.value, true)}
                >
                  <option value="">Select Leader...</option>
                  {batchStudents.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Main Page Component ---

const AssignDutiesPage = () => {
  const [activeTab, setActiveTab] = useState("subjects");
  const [loading, setLoading] = useState(true);
  
  // Stores
  const { 
    getBatches, getTeachers, getSemesters, getArtSems, getSubjects, getArtSubjects,
    batches, teachers, semesters, artSems, subjects, artSubjects 
  } = useAdminStore();
  const { students, getStudents } = useStudentStore();

  // Local State for Mapped Data
  const [mappedSubjects, setMappedSubjects] = useState([]);
  const [mappedArtSubjects, setMappedArtSubjects] = useState([]);
  const [mappedBatches, setMappedBatches] = useState([]);

  // Initial Fetch
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        getBatches(), getTeachers(), getSemesters(), getArtSems(), getStudents()
      ]);
      // Note: fetching all subjects requires iterating semesters usually, 
      // but for simplicity in this demo we assume store handles it or we fetch on demand.
      // We will simulate fetching subjects for the first active batch/semester for now 
      // or rely on what's available.
      setLoading(false);
    };
    init();
  }, []);

  // Fetch Subjects when tab changes (Optimization)
  useEffect(() => {
    const fetchSubs = async () => {
      if (activeTab === "subjects") {
        // In a real app, you might want to fetch all or paginate. 
        // Here we'll fetch subjects for all semesters.
        for (const s of semesters) await getSubjects(s._id);
      }
      if (activeTab === "artSubjects") {
        for (const s of artSems) await getArtSubjects(s._id);
      }
    };
    fetchSubs();
  }, [activeTab, semesters, artSems]);

  // Data Mapping for UI
  useEffect(() => {
    // Map Subjects
    const mapSub = (list) => list.map(sub => ({
      ...sub,
      assignedName: teachers.find(t => t._id === sub.subTeacher)?.name,
      assignedName2: teachers.find(t => t._id === sub.subTeacher2)?.name,
      batchName: batches.find(b => 
        b.currentSemester === sub.semester || b.currentArtSemester === sub.artSemester
      )?.name || "Unknown Batch"
    }));
    setMappedSubjects(mapSub(subjects));
    setMappedArtSubjects(mapSub(artSubjects));

    // Map Batches
    setMappedBatches(batches.map(b => ({
      ...b,
      assignedName: activeTab === "classTeacher" 
        ? teachers.find(t => t._id === b.classTeacher)?.name 
        : activeTab === "currentSemester"
          ? semesters.find(s => s._id === b.currentSemester)?.name
          : null
    })));
  }, [subjects, artSubjects, batches, teachers, semesters, activeTab]);


  // Assignment Handlers
  const handleAssignSubject = async (subjectId, teacherId) => {
    try {
      await axiosInstance.post("/mng/asign-subteacher", { subjectId, teacherId });
      toast.success("Subject assigned!");
      // Optimistic Update
      const updateList = (list) => list.map(s => s._id === subjectId ? {...s, subTeacher: teacherId} : s);
      if (activeTab === "subjects") setMappedSubjects(prev => updateList(prev));
      else setMappedArtSubjects(prev => updateList(prev));
      // Re-fetch to sync names
      getTeachers(); 
    } catch (e) { toast.error("Failed to assign"); }
  };

  const handleAssignMentor = async (classId, teacherId) => {
    try {
      await axiosInstance.post("/mng/asign-teacher", { classId, teacherId });
      toast.success("Mentor assigned!");
      setMappedBatches(prev => prev.map(b => b._id === classId ? {...b, classTeacher: teacherId} : b));
      getBatches(); // Sync names
    } catch (e) { toast.error("Failed to assign"); }
  };

  const handleAssignSemester = async (classId, semesterId) => {
    try {
      await axiosInstance.post("/mng/asign-semester", { classId, semesterId });
      toast.success("Semester assigned!");
      setMappedBatches(prev => prev.map(b => b._id === classId ? {...b, currentSemester: semesterId} : b));
      getBatches();
    } catch (e) { toast.error("Failed to assign"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark pb-20 transition-colors">
      <Header page="Duty Allocation" />
      
      <div className="max-w-[1600px] mx-auto px-4 mt-8">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border-2
                ${activeTab === tab.id 
                  ? `bg-${tab.color}-600 border-${tab.color}-600 text-white shadow-lg shadow-${tab.color}-500/30` 
                  : "bg-white dark:bg-slate-800 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary-500"></span></div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "subjects" && (
                <AllocatorView 
                  resourceTitle="Faculty Directory"
                  resources={teachers}
                  targets={mappedSubjects}
                  onAssign={handleAssignSubject}
                  targetLabelKey="name"
                  targetSubKey="batchName"
                />
              )}

              {activeTab === "artSubjects" && (
                <AllocatorView 
                  resourceTitle="Faculty Directory"
                  resources={teachers}
                  targets={mappedArtSubjects}
                  onAssign={(subId, tId) => handleAssignSubject(subId, tId)} // Art flag handled in API or store usually
                  targetLabelKey="name"
                  targetSubKey="batchName"
                />
              )}

              {activeTab === "classTeacher" && (
                <AllocatorView 
                  resourceTitle="Available Mentors"
                  resources={teachers}
                  targets={mappedBatches}
                  onAssign={handleAssignMentor}
                  targetLabelKey="name"
                  targetSubKey="currentSemester" // Hack to show sem as subtitle if needed
                />
              )}

              {activeTab === "currentSemester" && (
                <AllocatorView 
                  resourceTitle="Semester List"
                  resources={semesters}
                  targets={mappedBatches}
                  onAssign={handleAssignSemester}
                  targetLabelKey="name"
                  targetSubKey="classTeacher"
                />
              )}

              {activeTab === "classLeader" && (
                <ClassLeaderAllocator batches={batches} students={students} />
              )}

              {activeTab === "timeTable" && (
                <TimetableAssignment />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default AssignDutiesPage;