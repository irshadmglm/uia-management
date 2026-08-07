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
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useStudentStore } from "../store/studentStore";
import CustomSelect from "./CustomSelect";

// --- Student Detail Modal Component ---
const StudentDetailModal = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#11322f] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-scaleIn border border-gray-100 dark:border-[#0d2522]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-32 bg-gradient-to-r from-brand-teal to-sky-500">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex justify-between items-end -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#11322f] shadow-lg overflow-hidden bg-white">
              <img 
                src={student.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-15oVSs246BVTRobf0Ye3gECp5_E3-OKUGgAD4N8HZgj8xa-PElzug6S6tW0sdlT1cY&usqp=CAU"} 
                alt={student.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 mb-2">
              <div className="px-3 py-1 bg-brand-mint/20 text-brand-teal dark:text-brand-mint rounded-lg text-sm font-semibold shadow-sm border border-brand-mint/30">
                CIC: {student.cicNumber}
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{student.name}</h2>
          <p className="text-brand-teal dark:text-brand-mint font-medium mb-6 flex items-center gap-2">
            <Users size={16} /> {student.batchName}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Contact Info</h3>
              
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
                <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="font-medium">{student.phoneNumber}</p>
                </div>
              </div>

              {student.whatsupNumber && (
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
                  <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
                    <img src="https://cdn-icons-png.flaticon.com/128/5968/5968841.png" alt="WhatsApp" className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">WhatsApp</p>
                    <a href={`https://wa.me/${student.whatsupNumber}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-brand-teal transition-colors">
                      {student.whatsupNumber}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
                <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
                  <Mail size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="font-medium truncate">{student.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Personal Info</h3>
              
              {student.parentName && (
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
                  <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Parent Name</p>
                    <p className="font-medium">{student.parentName}</p>
                  </div>
                </div>
              )}

              {student.place && (
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
                  <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Place / Location</p>
                    <p className="font-medium">{student.place}</p>
                  </div>
                </div>
              )}

              {student.dob && (
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
                  <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p className="font-medium">{new Date(student.dob).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {student.bloodGroup && (
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
                  <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-red-500">
                    <Droplet size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Blood Group</p>
                    <p className="font-medium">{student.bloodGroup}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
      <StudentDetailModal 
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
                className="group bg-white dark:bg-[#11322f] rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] hover:shadow-xl hover:-translate-y-1 border border-gray-100 dark:border-[#0d2522] transition-all duration-300 relative overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Decorative background element */}
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-brand-teal/5 rounded-full blur-2xl group-hover:bg-brand-teal/10 transition-colors"></div>
                
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  {authUser.role === "admin" && (
                    <div className="flex flex-col gap-1.5 bg-white/95 dark:bg-[#0d2522]/95 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-transparent">
                      {inactive !== true ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              useAuthStore.getState().impersonate(student._id);
                            }}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition"
                            title="Impersonate Student"
                          >
                            <UserCheck size={16} />
                          </button>
                          <Link
                            to={`/dashboard/admin/std-edit/${student._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 rounded-lg transition"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={(e) => statusChange(student._id, e)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                          >
                            <Trash size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => statusChange(student._id, e)}
                            className="p-2 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 rounded-lg transition"
                          >
                            <Undo2 size={16} />
                          </button>
                          <button
                            onClick={(e) => onDelete(student._id, e)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                          >
                            <Trash size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center mb-6 mt-2 relative z-10">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-[#0d2522] shadow-lg mb-5 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={
                        student.profileImage ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-15oVSs246BVTRobf0Ye3gECp5_E3-OKUGgAD4N8HZgj8xa-PElzug6S6tW0sdlT1cY&usqp=CAU"
                      }
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-[15px] sm:text-base text-center leading-snug group-hover:text-brand-teal transition-colors px-2">
                    {student.name}
                  </h3>
                  <div className="px-3 py-1 bg-brand-teal/5 dark:bg-[#0d2522] text-brand-teal dark:text-brand-mint text-xs font-bold rounded-full mt-2.5 tracking-wider shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] border border-brand-teal/10 dark:border-transparent">
                    CIC: {student.cicNumber}
                  </div>
                </div>

                <div className="space-y-3 flex-1 mt-1 relative z-10 border-t border-gray-100 dark:border-[#0d2522] pt-4">
                  <div className="flex items-center gap-3 text-[13px] sm:text-sm">
                    <div className="p-2 bg-brand-teal/10 dark:bg-[#0d2522] rounded-xl text-brand-teal">
                      <Users size={14} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{student.batchName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px] sm:text-sm">
                    <div className="p-2 bg-brand-teal/10 dark:bg-[#0d2522] rounded-xl text-brand-teal">
                      <Phone size={14} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 truncate">{student.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px] sm:text-sm">
                    <div className="p-2 bg-brand-teal/10 dark:bg-[#0d2522] rounded-xl text-brand-teal">
                      <Mail size={14} />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 truncate text-xs sm:text-[13px]" title={student.email}>{student.email}</span>
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
