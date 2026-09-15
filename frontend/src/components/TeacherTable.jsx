import React, { useState } from "react";
import {
  Pencil,
  Trash,
  Search,
  PlusCircleIcon,
  Phone,
  LayoutGrid,
  List,
  Mail,
  UserCheck,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useStaffStore } from "../store/useStaffStore";
import TeacherProfileModal from "./TeacherProfileModal";
import ConfirmPopup from "./ConfirmPopup";

const TeacherTable = ({ teachers }) => {
  const { authUser } = useAuthStore();
  const { deleteTeacher } = useStaffStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const filteredTeachers = teachers?.filter((teacher) => {
    return [teacher.name, teacher.userName, teacher.phoneNumber].some((field) =>
      field?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  const handleDeleteClick = (teacher, e) => {
    e.stopPropagation();
    setTeacherToDelete(teacher);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (teacherToDelete) {
      await deleteTeacher(teacherToDelete._id);
      setShowConfirm(false);
      setTeacherToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <TeacherProfileModal 
        teacher={selectedTeacher} 
        isOpen={!!selectedTeacher} 
        onClose={() => setSelectedTeacher(null)} 
      />

      <ConfirmPopup
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        message={teacherToDelete ? `Are you sure you want to delete ${teacherToDelete.name}?` : ""}
        variant="danger"
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full px-1">
        <div className="flex gap-2 w-full md:w-auto">
          {authUser.role === "admin" && (
            <Link
              to="/dashboard/admin/signup"
              className="inline-flex items-center justify-center gap-2 p-3 text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-all shadow-sm flex-1 md:flex-none"
            >
              <PlusCircleIcon size={20} />
            </Link>
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
          <div className="relative w-full md:max-w-md lg:max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teachers..."
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
                <th className="p-4 font-semibold hidden md:table-cell">Role</th>
                <th className="p-4 font-semibold hidden lg:table-cell">Email / Username</th>
                <th className="p-4 font-semibold hidden lg:table-cell">Phone</th>
                {authUser.role === "admin" && <th className="p-4 font-semibold text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#0d2522] bg-white dark:bg-gray-800/50">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No teachers found.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher, i) => (
                  <tr
                    key={teacher._id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-[#11322f]/80 transition duration-200"
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    <td className="p-4 text-gray-500 font-medium">{i + 1}</td>
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-[#0d2522] shadow-sm">
                        <img
                          src={
                            teacher.profileImage ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-15oVSs246BVTRobf0Ye3gECp5_E3-OKUGgAD4N8HZgj8xa-PElzug6S6tW0sdlT1cY&usqp=CAU"
                          }
                          alt={teacher.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-100">
                      {teacher.name}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 capitalize border border-blue-100 dark:border-blue-800/30">
                        {teacher.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                      {teacher.userName}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                      {teacher.phoneNumber || "N/A"}
                    </td>
                    {authUser.role === "admin" && (
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/dashboard/admin/staff-edit/${teacher._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 p-2 rounded-lg transition"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            onClick={(e) => handleDeleteClick(teacher, e)}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522]">
              No teachers found.
            </div>
          ) : (
            filteredTeachers.map((teacher) => (
              <div
                key={teacher._id}
                className="group relative bg-white dark:bg-[#11322f] rounded-[24px] border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                onClick={() => setSelectedTeacher(teacher)}
              >
                {/* Banner Header */}
                <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                  {/* Actions overlay */}
                  <div className="absolute top-3 right-3 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl p-1">
                    {authUser.role === "admin" && (
                      <>
                        <Link
                          to={`/dashboard/admin/staff-edit/${teacher._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-white hover:bg-white/20 rounded-lg transition"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={(e) => handleDeleteClick(teacher, e)}
                          className="p-1.5 text-white hover:bg-white/20 rounded-lg transition text-rose-100 hover:text-white"
                        >
                          <Trash size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Avatar */}
                <div className="px-6 relative flex justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-white dark:border-[#11322f] shadow-md -mt-10 bg-white overflow-hidden relative z-10">
                    <img
                      src={
                        teacher.profileImage ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-15oVSs246BVTRobf0Ye3gECp5_E3-OKUGgAD4N8HZgj8xa-PElzug6S6tW0sdlT1cY&usqp=CAU"
                      }
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-3 text-center flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1" title={teacher.name}>
                    {teacher.name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold rounded-full mb-4 mx-auto border border-indigo-100 dark:border-indigo-800/30 uppercase tracking-wider">
                    {teacher.role}
                  </span>

                  <div className="space-y-2.5 mt-auto text-left border-t border-gray-50 dark:border-[#0d2522] pt-4">
                    <div className="flex items-center gap-3 text-[13px]">
                      <div className="p-1.5 bg-gray-50 dark:bg-[#0d2522] rounded-lg text-gray-400">
                        <Mail size={14} />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 font-medium truncate">{teacher.userName}</span>
                    </div>
                    {teacher.phoneNumber && (
                      <div className="flex items-center gap-3 text-[13px]">
                        <div className="p-1.5 bg-gray-50 dark:bg-[#0d2522] rounded-lg text-gray-400">
                          <Phone size={14} />
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 truncate">{teacher.phoneNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    className="mt-5 w-full py-2.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white dark:bg-indigo-900/20 dark:hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold transition-all border border-indigo-100 dark:border-transparent flex items-center justify-center gap-2 group/btn"
                  >
                    View Profile <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherTable;
