import { useState } from "react";
import {
  Pencil, Trash2, Search, Plus, Filter,
  MoreVertical, Phone, Mail, UserX, UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useStudentStore } from "../store/studentStore";
import { motion, AnimatePresence } from "framer-motion";

const StudentTable = ({ students, inactive }) => {
  const { authUser } = useAuthStore();
  const { deleteStudent, stdStatusChange } = useStudentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);

  // Filter Logic
  const filteredStudents = students.filter((student) =>
    [student.name, student.batchName, String(student.cicNumber)].some((field) =>
      field?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Status Toggle Handler
  const handleStatusChange = async (id) => {
    if (window.confirm(`Are you sure you want to ${inactive ? "Restore" : "Deactivate"} this student?`)) {
      await stdStatusChange(id, inactive);
      setActiveMenu(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this student?")) {
      await deleteStudent(id);
      setActiveMenu(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Toolbar Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search students by name, batch, or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Actions */}
        {authUser.role === "admin" && !inactive && (
          <Link
            to="/dashboard/admin/admission-form"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-lg shadow-primary-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Student</span>
          </Link>
        )}
      </div>

      {/* 2. Data Grid (Desktop) & Cards (Mobile) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-4">Student</div>
          <div className="col-span-2">Batch</div>
          <div className="col-span-2">Contact</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-900 mb-4">
                <Filter size={24} />
              </div>
              <p>No students found matching your search.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group relative md:grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  {/* Mobile Card View Layout */}
                  <div className="flex md:hidden items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={student.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{student.name}</h3>
                      <p className="text-xs text-slate-500">CIC: {student.cicNumber}</p>
                    </div>
                  </div>

                  {/* Desktop Columns */}
                  <div className="hidden md:block col-span-1 text-center font-mono text-slate-400 text-sm">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>

                  <div className="col-span-4 hidden md:flex items-center gap-3">
                    <img
                      src={student.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                      className="w-9 h-9 rounded-full object-cover bg-slate-100"
                      alt=""
                    />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{student.name}</p>
                      <p className="text-xs text-slate-500">ID: {student.cicNumber}</p>
                    </div>
                  </div>

                  <div className="col-span-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="md:hidden font-semibold mr-2">Batch:</span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-900/30">
                      {student.batchName}
                    </span>
                  </div>

                  <div className="col-span-2 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Phone size={12} /> {student.phoneNumber}
                    </div>
                    {/* <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
                      <Mail size={12} /> {student.email || "No Email"}
                    </div> */}
                  </div>

                  <div className="col-span-2 mt-2 md:mt-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${inactive 
                      ? "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/20 dark:border-rose-900/30 dark:text-rose-300"
                      : "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-900/30 dark:text-emerald-300"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${inactive ? "bg-rose-500" : "bg-emerald-500"}`}></span>
                      {inactive ? "Inactive" : "Active"}
                    </span>
                  </div>

                  {/* Actions (Desktop: Hover | Mobile: Always visible) */}
                  <div className="col-span-1 flex justify-end relative">
                    {authUser.role === "admin" && (
                      <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/dashboard/admin/std-edit/${student._id}`}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        
                        <button
                          onClick={() => handleStatusChange(student._id)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title={inactive ? "Restore" : "Deactivate"}
                        >
                          {inactive ? <UserCheck size={16} /> : <UserX size={16} />}
                        </button>

                        <button
                          onClick={() => handleDelete(student._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Permanently"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTable;