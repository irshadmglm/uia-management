import React, { useEffect, useState } from "react";
import { useRegisterdStudentStore } from "../store/useRegisterdStudentStore";
import Header from "../components/Header";

const RegisterdStudents = () => {
  const [openDetails, setOpenDetails] = useState({});
  const { getRegisteredStudents, filteredStudents: students, studentsLoading, selectStudent, filteringBatch } = useRegisterdStudentStore();

    const [selectedBatch, setSelectedBatch] = useState("All Batch");

    const handleChange = (event) => {
      const value = event.target.value;
      setSelectedBatch(value);
      filteringBatch(value); 
    };
  useEffect(() => {
    getRegisteredStudents();
  }, [getRegisteredStudents]);

  const toggleDetails = (index) => {
    setOpenDetails((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSelect = async (studentId, isSelected) => {
    await selectStudent(studentId, isSelected);
    getRegisteredStudents(); 
  };
  

  return (
    <div className="min-h-screen overflow-x-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <Header page={"Registered Students"} />
      <select value={selectedBatch} onChange={handleChange} className="select select-md mt-14  bg-white dark:bg-gray-900 text-gray-900 dark:text-white ">
      <option>All Batch</option>
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
      <option>6</option>
      <option>7</option>
      <option>8</option>
      <option>9</option>
      <option>10</option>
    </select>
      <table className="table w-full border border-gray-300 dark:border-gray-700 mt-2 ">
        {/* Table Head */}
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="hidden md:table-cell">Profile</th>
            <th>Name</th>
            <th className="hidden md:table-cell">Phone</th>
            <th>Batch</th>
            <th className="hidden md:table-cell">Gender</th>
            <th className="hidden md:table-cell">DOB</th>
            <th>Details</th>
            <th>Action</th> {/* New Action Column */}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {students && students.length > 0 ? (
            students.map((student, index) => (
              <React.Fragment key={student._id}>
                {/* Main Row */}
                <tr
                  className={`border-b dark:border-gray-700 ${
                    student.selected ? "bg-green-100 dark:bg-green-900" : ""
                  }`} // Highlight selected students
                >
                  <td className="hidden md:table-cell">
                    <img
                      src={student.profileImage || "https://img.daisyui.com/images/profile/demo/placeholder.webp"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold">{student.studentName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">{student.phoneNumber}</td>
                  <td>{student.selectedBatch}</td>
                  <td className="hidden md:table-cell">{student.gender}</td>
                  <td className="hidden md:table-cell">{student.dateOfBirth}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-xs dark:text-gray-200"
                      onClick={() => toggleDetails(index)}
                    >
                      Details
                    </button>
                  </td>
                  {/* Action Column */}
                  <td>
                    {student.isSelected ? (
                      <button className="btn btn-xs btn-active text-white bg-green-500 dark:bg-green-700">
                        Selected
                      </button>
                    ) : (
                      <button
                        className="btn btn-xs btn-outline dark:border-gray-400 dark:text-gray-200"
                        onClick={() => handleSelect(student._id, true)}
                      >
                        Select
                      </button>
                    )}
                  </td>
                </tr>

                {/* Collapsible Details Row for Mobile */}
                {openDetails[index] && (
                  <tr className="md:hidden">
                    <td colSpan="9">
                      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
                        <p>
                          <span className="font-bold">Phone: </span>
                          {student.phoneNumber}
                        </p>
                        <p>
                          <span className="font-bold">Gender: </span>
                          {student.gender}
                        </p>
                        <p>
                          <span className="font-bold">DOB: </span>
                          {student.dateOfBirth}
                        </p>
                        <p>
                          <span className="font-bold">Profile: </span>
                          <img
                            src={student.profileImage || "https://img.daisyui.com/images/profile/demo/placeholder.webp"}
                            alt="Profile"
                            className="w-10 h-10 rounded-full inline"
                          />
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center p-4">
                No students registered.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RegisterdStudents;
