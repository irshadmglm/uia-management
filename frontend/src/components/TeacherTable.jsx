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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              useAuthStore.getState().impersonate(teacher._id);
                            }}
                            className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-2 rounded-lg transition"
                            title="Impersonate Teacher"
                          >
                            <UserCheck size={18} />
                          </button>
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
                onClick={() => setSelectedTeacher(teacher)}
                className="group bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Card Top Color Strip */}
                <div className="h-1.5 bg-gradient-to-r from-brand-teal to-sky-500"></div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center justify-between w-full">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#0d2522] border border-gray-200 dark:border-[#0d2522]">
                        <img
                          src={
                            teacher.profileImage ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-15oVSs246BVTRobf0Ye3gECp5_E3-OKUGgAD4N8HZgj8xa-PElzug6S6tW0sdlT1cY&usqp=CAU"
                          }
                          alt={teacher.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="inline-block px-2.5 py-1 bg-brand-mint/20 text-brand-teal dark:text-brand-mint text-[10px] font-bold rounded-full border border-brand-mint/30 uppercase tracking-wider">
                        {teacher.role}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-1 group-hover:text-brand-teal transition-colors line-clamp-1" title={teacher.name}>
                    {teacher.name}
                  </h3>

                  <div className="space-y-1.5 mb-4 mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 truncate" title={teacher.userName}>
                      <Mail size={12} /> {teacher.userName}
                    </p>
                    {teacher.phoneNumber && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Phone size={12} /> {teacher.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-[#0d2522] mt-auto">
                    {authUser.role === "admin" && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); useAuthStore.getState().impersonate(teacher._id); }}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-lg transition-all"
                          title="Impersonate"
                        >
                          <UserCheck size={13} />
                        </button>
                        <Link
                          to={`/dashboard/admin/staff-edit/${teacher._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/10 rounded-lg transition-all"
                        >
                          <Pencil size={13} />
                        </Link>
                        <button
                          onClick={(e) => handleDeleteClick(teacher, e)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                        >
                          <Trash size={13} />
                        </button>
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

export default TeacherTable;
