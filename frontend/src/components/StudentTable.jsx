import React, { useState } from "react";
import { Pencil, Trash, Eye, Search, PlusCircleIcon, Trash2, Undo2, Undo } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useStudentStore } from "../store/studentStore";

const StudentTable = ({ students, inactive}) => {
    const { authUser } = useAuthStore();
    const {deleteStudent, stdStatusChange} = useStudentStore();

  const [expandedRow, setExpandedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDetails = (studentId) => {
    setExpandedRow((prev) => (prev === studentId ? null : studentId));
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const success = await deleteStudent(id);
    }
  };
  const statusChange = async (id) => {
    if (window.confirm(`Are you sure you want to ${inactive ? "Restore" : "Delete"} this student?`)) {
      const success = await stdStatusChange(id, inactive);
    }
  };
  

  const filteredStudents = students.filter((student) =>
    [student.name, student.batchName, String(student.cicNumber)]
      .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className=" px-4 pt-2">
      <div className="flex justify-between items-center mb-4">
      {authUser.role === "admin" && inactive !== true && (
       <div className="flex gap-3">
         <Link
          to="/dashboard/admin/admission-form"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-sky-500 hover:bg-green-700 rounded-md transition"
        >
          <PlusCircleIcon size={16} />
        </Link>
        <Link
          to="/dashboard/admin/inactive-std"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-green-700 rounded-md transition"
        >
          <Trash2 size={16} />
        </Link>
       </div>
      )}
        <div className="relative ">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-white dark:bg-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-3 text-gray-400" size={16} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead className="bg-gradient-to-r from-sky-700 to-sky-800  text-white">
            <tr>
              <th>No</th>
              <th>Profile</th>
              <th>Name</th>
              <th className="hidden md:table-cell">Batch</th>
              <th className="hidden md:table-cell">CIC</th>
              <th className="hidden lg:table-cell">Email</th>
              <th className="hidden lg:table-cell">Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, i) => (
                <React.Fragment key={student._id}>
                  <tr
                    className="cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-800 transition duration-200"
                    onClick={() => toggleDetails(student._id)}
                  >
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border">
                        <img
                          src={
                            student.profileImage ||
                            "https://st.depositphotos.com/55903428/53633/v/450/depositphotos_536336440-stock-illustration-icon-islamic-man-glyph-style.jpg"
                          }
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-3 font-semibold">{student.name}</td>
                    <td className="p-3 hidden md:table-cell">{student.batchName}</td>
                    <td className="p-3 hidden md:table-cell">{student.cicNumber}</td>
                    <td className="p-3 hidden lg:table-cell">{student.email}</td>
                    <td className="p-3 hidden lg:table-cell">{student.phoneNumber}</td>
                    <td
                      className="p-3 flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* <button
                        onClick={() => toggleDetails(student._id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Eye size={16} />
                      </button> */}
                    {authUser.role === "admin" && inactive !== true && (
                        <>
                          <Link
                            to={`/dashboard/admin/std-edit/${student._id}`}
                            className="text-sky-500 hover:text-green-700"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                        onClick={() => statusChange(student._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={16} />
                      </button>
                        </>
                      )}
                    {authUser.role === "admin" && inactive === true && (
                        <>
                          
                          <button
                        onClick={() => statusChange(student._id)}
                        className="text-sky-500 hover:text-sky-700"
                      >
                        <Undo2 size={16} />
                      </button>
                          <button
                        onClick={() => onDelete(student._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={16} />
                      </button>
                        </>
                      )}

                      
                     
                    </td>
                  </tr>
                  {expandedRow === student._id && (
                    <tr className="md:hidden">
                      <td colSpan="8" className="p-2 bg-gray-100 dark:bg-gray-800">
                        <div className="text-sm space-y-1">
                          <p>
                            <strong>Batch:</strong> {student.batchName}
                          </p>
                          <p>
                            <strong>CIC:</strong> {student.cicNumber}
                          </p>
                          <p>
                            <strong>Email:</strong> {student.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {student.phoneNumber}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
