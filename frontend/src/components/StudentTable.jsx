import React, { useState, useMemo } from "react";
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
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useStudentStore } from "../store/studentStore";
import CustomSelect from "./CustomSelect";
import StudentProfileModal from "./StudentProfileModal";

// Modal imported from StudentProfileModal.jsx

const StudentTable = ({ students, inactive }) => {
  const { authUser } = useAuthStore();
  const { deleteStudent, stdStatusChange } = useStudentStore();

  const [expandedRow, setExpandedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // Defaulting to grid mode as requested
  const [batchFilter, setBatchFilter] = useState("all");
  
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

  const uniqueBatches = useMemo(() => {
    const batches = students.map((s) => s.batchName).filter(Boolean);
    return [...new Set(batches)];
  }, [students]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = [student.name, student.batchName, String(student.cicNumber)].some((field) =>
      field?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesBatch = batchFilter === "all" || student.batchName === batchFilter;
    return matchesSearch && matchesBatch;
  });

  return (
    <div className="space-y-6 pt-2">
      <StudentProfileModal 
        student={selectedStudent} 
        isOpen={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full px-1">
        <div className="flex gap-2 w-full md:w-auto">
          {authUser.role === "admin" && inactive !== true && (
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
              <option value="all">All Batches</option>
              {uniqueBatches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </CustomSelect>
          </div>
          <div className="relative w-full md:max-w-md lg:max-w-lg xl:flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-12 pr-10 py-3 w-full rounded-xl border-0 shadow-sm bg-white dark:bg-[#11322f] text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-teal transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                        {student.batchName}
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
                <div className="h-1.5 bg-gradient-to-r from-brand-teal to-sky-500"></div>

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
                    <div className="mt-auto mb-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-teal dark:text-brand-mint bg-brand-mint/10 px-2 py-0.5 rounded-full border border-brand-mint/20">
                        <Users size={9} /> {student.batchName}
                      </span>
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
