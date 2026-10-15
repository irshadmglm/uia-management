import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Pencil,
  Trash,
  Search,
  PlusCircleIcon,
  Trash2,
  Undo2,
  Users,
  BadgeCheck,
  Mail,
  Phone,
  LayoutGrid,
  List,
  MapPin,
  Calendar,
  Droplet,
  User,
  X,
  UserCheck,
  ArrowRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  SlidersHorizontal,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useStudentStore } from "../store/studentStore";
import { useAdminStore } from "../store/useAdminMngStore";
import CustomSelect from "./CustomSelect";
import StudentProfileModal from "./StudentProfileModal";

// Modal imported from StudentProfileModal.jsx

const StudentTable = ({ students, inactive, isAlumni }) => {
  const { authUser } = useAuthStore();
  const { deleteStudent, stdStatusChange } = useStudentStore();
  const { batches, getBatches } = useAdminStore();

  useEffect(() => {
    if (batches.length === 0) {
      getBatches();
    }
  }, [batches, getBatches]);

  const [expandedRow, setExpandedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // Defaulting to grid mode as requested
  const [batchFilter, setBatchFilter] = useState("all");

  // Sort state
  const [sortKey, setSortKey] = useState(null);   // 'cic' | 'name' | 'date' | 'batch'
  const [sortDir, setSortDir] = useState("asc");  // 'asc' | 'desc'
  const [showSortPanel, setShowSortPanel] = useState(false);
  const sortPanelRef = useRef(null);

  // Close sort panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (sortPanelRef.current && !sortPanelRef.current.contains(e.target)) {
        setShowSortPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSort = (key, dir) => {
    setSortKey(key);
    setSortDir(dir);
    setShowSortPanel(false);
  };

  const clearSort = () => {
    setSortKey(null);
    setSortDir("asc");
  };

  // Modal state
  const [selectedStudent, setSelectedStudent] = useState(null);

  const toggleDetails = (studentId) => {
    setExpandedRow((prev) => (prev === studentId ? null : studentId));
  };

  const openStudentModal = (student) => {
    setSelectedStudent(student);
  };

  const onDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(id);
    }
  };

  const statusChange = async (id, e) => {
    if (e) e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to ${inactive ? "Restore" : "Delete"} this student?`
      )
    ) {
      await stdStatusChange(id, inactive);
    }
  };

  const activeBatches = useMemo(() => batches.filter(b => b.isActive !== false).map(b => b.name), [batches]);
  const inactiveBatches = useMemo(() => batches.filter(b => b.isActive === false).map(b => b.name), [batches]);

  const uniqueBatches = useMemo(() => {
    const batchNames = students.map((s) => s.batchName).filter(Boolean);
    if (isAlumni) {
      return [...new Set(batchNames)].filter(name => inactiveBatches.includes(name));
    }
    // Only return active batch names that exist in students
    return [...new Set(batchNames)].filter(name => activeBatches.includes(name));
  }, [students, activeBatches, inactiveBatches, isAlumni]);

  const filteredStudents = useMemo(() => {
    let list = students.filter((student) => {
      const matchesSearch = [student.name, student.batchName, String(student.cicNumber), student.phoneNumber, student.parentNumber].some((field) =>
        field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      let matchesBatch = false;
      if (isAlumni) {
        if (batchFilter === "all") {
          matchesBatch = inactiveBatches.includes(student.batchName);
        } else {
          matchesBatch = student.batchName === batchFilter;
        }
      } else {
        if (batchFilter === "all") {
          // Exclude alumni (inactive batches) from regular active students
          matchesBatch = activeBatches.includes(student.batchName) || !student.batchName;
        } else if (batchFilter === "alumni") {
          matchesBatch = inactiveBatches.includes(student.batchName);
        } else {
          matchesBatch = student.batchName === batchFilter;
        }
      }
      return matchesSearch && matchesBatch;
    });

    if (sortKey) {
      list = [...list].sort((a, b) => {
        let valA, valB;
        if (sortKey === "cic") {
          valA = Number(a.cicNumber) || 0;
          valB = Number(b.cicNumber) || 0;
          return sortDir === "asc" ? valA - valB : valB - valA;
        } else if (sortKey === "name") {
          valA = (a.name || "").toLowerCase();
          valB = (b.name || "").toLowerCase();
        } else if (sortKey === "date") {
          valA = new Date(a.createdAt || 0).getTime();
          valB = new Date(b.createdAt || 0).getTime();
          return sortDir === "asc" ? valA - valB : valB - valA;
        } else if (sortKey === "batch") {
          valA = (a.batchName || "").toLowerCase();
          valB = (b.batchName || "").toLowerCase();
        }
        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [students, searchQuery, batchFilter, activeBatches, inactiveBatches, sortKey, sortDir]);

  return (
    <div className="space-y-6 pt-2">
      <StudentProfileModal 
        student={selectedStudent} 
        isOpen={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full px-1">
        <div className="flex gap-2 w-full md:w-auto items-center">
          {isAlumni ? (
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-sm text-white">
                <GraduationCap size={22} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Alumni Directory</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Graduated students from archived cohorts ({filteredStudents.length})</p>
              </div>
            </div>
          ) : authUser.role === "admin" && inactive !== true && (
            <>
              <Link
                to="/dashboard/admin/admission-form"
                className="inline-flex items-center justify-center gap-2 p-3 text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-all shadow-sm flex-1 md:flex-none"
              >
                <PlusCircleIcon size={20} />
              </Link>
              <Link
                to="/dashboard/admin/inactive-std"
                className="inline-flex items-center justify-center gap-2 p-3 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-sm flex-1 md:flex-none"
              >
                <Trash2 size={20} />
              </Link>
            </>
          )}
          
          <div className="flex bg-white dark:bg-[#11322f] rounded-xl shadow-sm border border-gray-100 dark:border-transparent p-1 overflow-hidden ml-auto">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-gray-100 dark:bg-[#0d2522] text-brand-teal dark:text-brand-mint"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-gray-100 dark:bg-[#0d2522] text-brand-teal dark:text-brand-mint"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:flex-1 justify-end">
          <div className="w-full md:max-w-xs">
            <CustomSelect
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="w-full border-0 bg-white dark:bg-[#11322f] shadow-sm rounded-xl py-3 px-4 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-brand-teal"
            >
              <option value="all">{isAlumni ? "All Alumni Batches" : "All Batches"}</option>
              {uniqueBatches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </CustomSelect>
          </div>

          {/* Search + Sort */}
          <div className="flex gap-2 w-full md:max-w-md lg:max-w-lg xl:flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-12 pr-10 py-3 w-full rounded-xl border-0 shadow-sm bg-white dark:bg-[#11322f] text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-teal transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Button */}
            <div className="relative shrink-0" ref={sortPanelRef}>
              <button
                onClick={() => setShowSortPanel((p) => !p)}
                className={`flex items-center justify-center gap-1.5 h-full px-3.5 rounded-xl shadow-sm border transition-all duration-200 ${
                  sortKey
                    ? "bg-brand-teal text-white border-brand-teal"
                    : "bg-white dark:bg-[#11322f] text-gray-500 dark:text-gray-400 border-gray-100 dark:border-transparent hover:text-brand-teal dark:hover:text-brand-mint"
                }`}
                title="Sort students"
              >
                <SlidersHorizontal size={18} />
                {sortKey && <ChevronDown size={14} />}
              </button>

              {/* Sort Dropdown Panel */}
              {showSortPanel && (
                <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white dark:bg-[#11322f] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#0d2522] overflow-hidden animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-[#0d2522] flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sort By</span>
                    {sortKey && (
                      <button
                        onClick={clearSort}
                        className="text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1"
                      >
                        <X size={12} /> Clear
                      </button>
                    )}
                  </div>
                  <div className="p-2 space-y-0.5">
                    {[
                      { key: "cic",   label: "CIC Number",     asc: "Lowest first",   desc: "Highest first" },
                      { key: "name",  label: "Name",           asc: "A → Z",          desc: "Z → A" },
                      { key: "date",  label: "Admission Date", asc: "Oldest first",   desc: "Newest first" },
                      { key: "batch", label: "Batch",          asc: "A → Z",          desc: "Z → A" },
                    ].map(({ key, label, asc, desc }) => (
                      <div key={key}>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase px-2 pt-2 pb-1">{label}</p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleSort(key, "asc")}
                            className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              sortKey === key && sortDir === "asc"
                                ? "bg-brand-teal text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0d2522]"
                            }`}
                          >
                            <ArrowUp size={12} /> {asc}
                          </button>
                          <button
                            onClick={() => handleSort(key, "desc")}
                            className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              sortKey === key && sortDir === "desc"
                                ? "bg-brand-teal text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0d2522]"
                            }`}
                          >
                            <ArrowDown size={12} /> {desc}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-100 dark:border-[#0d2522]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f3f7f6] dark:bg-[#11322f] text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-4 font-semibold">No</th>
                <th className="p-4 font-semibold">Profile</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold hidden md:table-cell">Batch</th>
                <th className="p-4 font-semibold hidden md:table-cell">CIC</th>
                <th className="p-4 font-semibold hidden lg:table-cell">Email</th>
                <th className="p-4 font-semibold hidden lg:table-cell">Phone</th>
                {authUser.role === "admin" && <th className="p-4 font-semibold text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#0d2522] bg-white dark:bg-gray-800/50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, i) => (
                  <React.Fragment key={student._id}>
                    <tr
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-[#11322f]/80 transition duration-200"
                      onClick={() => openStudentModal(student)}
                    >
                      <td className="p-4 text-gray-500 font-medium">{i + 1}</td>
                      <td className="p-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-[#0d2522] shadow-sm">
                          <img
                            src={
                              student.profileImage ||
                              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-15oVSs246BVTRobf0Ye3gECp5_E3-OKUGgAD4N8HZgj8xa-PElzug6S6tW0sdlT1cY&usqp=CAU"
                            }
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-gray-800 dark:text-gray-100">
                        {student.name}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{student.batchName}</span>
                          {isAlumni && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                              Alumni
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        {student.cicNumber}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                        {student.email}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                        {student.phoneNumber}
                      </td>
                      {authUser.role === "admin" && (
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
                            {inactive !== true ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    useAuthStore.getState().impersonate(student._id);
                                  }}
                                  className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-2 rounded-lg transition"
                                  title="Impersonate Student"
                                >
                                  <UserCheck size={18} />
                                </button>
                                <Link
                                  to={`/dashboard/admin/std-edit/${student._id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 p-2 rounded-lg transition"
                                >
                                  <Pencil size={18} />
                                </Link>
                                <button
                                  onClick={(e) => statusChange(student._id, e)}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition"
                                >
                                  <Trash size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => statusChange(student._id, e)}
                                  className="text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 p-2 rounded-lg transition"
                                >
                                  <Undo2 size={18} />
                                </button>
                                <button
                                  onClick={(e) => onDelete(student._id, e)}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition"
                                >
                                  <Trash size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522]">
              No students found.
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student._id}
                onClick={() => openStudentModal(student)}
                className="group bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Card Top Color Strip */}
                <div className={`h-1.5 ${isAlumni ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gradient-to-r from-brand-teal to-sky-500'}`}></div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#0d2522] border border-gray-200 dark:border-[#0d2522]">
                        <img
                          src={student.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-15oVSs246BVTRobf0Ye3gECp5_E3-OKUGgAD4N8HZgj8xa-PElzug6S6tW0sdlT1cY&usqp=CAU"}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 font-mono">
                        #{student.cicNumber}
                      </span>
                    </div>
                  </div>

                  {/* Student Info */}
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-1 group-hover:text-brand-teal transition-colors line-clamp-1" title={student.name}>
                    {student.name}
                  </h3>
                  
                  <div className="space-y-1.5 mb-4 mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <Phone size={12} /> {student.phoneNumber || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 truncate" title={student.email}>
                      <Mail size={12} /> {student.email || "N/A"}
                    </p>
                  </div>

                  {student.batchName && (
                    <div className="mt-auto mb-4 flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-teal dark:text-brand-mint bg-brand-mint/10 px-2 py-0.5 rounded-full border border-brand-mint/20">
                        <Users size={9} /> {student.batchName}
                      </span>
                      {isAlumni && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                          <GraduationCap size={9} /> Alumni
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-[#0d2522] mt-auto">
                    {authUser.role === "admin" && (
                      <>
                        {inactive !== true ? (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); useAuthStore.getState().impersonate(student._id); }}
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-lg transition-all"
                              title="Impersonate"
                            >
                              <UserCheck size={14} />
                            </button>
                            <Link
                              to={`/dashboard/admin/std-edit/${student._id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/10 rounded-lg transition-all"
                            >
                              <Pencil size={14} />
                            </Link>
                            <button
                              onClick={(e) => statusChange(student._id, e)}
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                            >
                              <Trash size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => statusChange(student._id, e)}
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/10 rounded-lg transition-all"
                            >
                              <Undo2 size={13} /> Restore
                            </button>
                            <button
                              onClick={(e) => onDelete(student._id, e)}
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                            >
                              <Trash size={13} /> Delete
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StudentTable;
