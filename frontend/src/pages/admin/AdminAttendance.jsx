import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStudentStore } from "../../store/studentStore";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { useAdminStore } from "../../store/useAdminMngStore";
import StudentTable from "../../components/StudentTable";

const AdminAttendance = () => {
  let { batchId } = useParams();

  const { getBatches, batches, getTeachers, teachers } = useAdminStore();
  const { getStudents, students, batchStudents, getBatchStudents } = useStudentStore();
  const [selectedBatch, setSelectedBatch] = useState({});
  const [selectedTab, setSelectedTab] = useState("students");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBatches();
    getTeachers();
  }, []);
  
  useEffect(() => {
    getBatchStudents(batchId); 
  }, [batchId]);
  

  useEffect(() => {
    if (batches.length > 0 && batchStudents.length > 0) {
      const selected = batches.find((c) => c._id === batchId);
      setSelectedBatch(selected);
    }
  }, [batches, batchId, batchStudents]);
  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([getBatches(), getStudents(), getTeachers()]);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 pt-12">
      <Header page="Attendance Management" />
      
      {/* TOP SECTION */}
      {selectedBatch && (
        <div className="w-full max-w-4xl mt-6 p-6 shadow-xl rounded-3xl bg-gray-50 dark:bg-gray-800 text-center">
          <h2 className="text-xl font-bold">{selectedBatch.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-100">
            {teachers
                .filter((t) => t._id === selectedBatch.classTeacher)
                .map((t) => (
                <span key={t._id}>Class Mentor: {t.name || "not assigned"}</span>
                ))}
            </p>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total Students: {batchStudents?.length}
          </p>
        </div>
      )}
      {/* <div className="flex mt-3 space-x-4 border-b border-gray-300 dark:border-gray-600">
        {["students", "attendance"].map((tab) => (
          <Button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
              selectedTab === tab
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-100 dark:bg-blue-900/20"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div> */}

      {/* TAB CONTENT */}
      {selectedTab === "students" ? (
        loading ? <p>Loading...</p> : <StudentTable students={batchStudents}  />

      ) : (
        <AttendanceTable cls={selectedBatch} students={batchStudents} />
      )}
    </div>
  );
};

// STUDENTS TABLE COMPONENT
// const StudentsTable = ({ students }) => {
//   return (
//     <div className="w-full max-w-4xl p-6 mt-6 shadow-xl rounded-3xl bg-gray-50 dark:bg-gray-800">
//       <h2 className="text-xl font-semibold text-center mb-4">Students List</h2>
//       <table className="table w-full">
//         <thead>
//           <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
//             <th>Roll No</th>
//             <th>studentId</th>
//             <th>Name</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
//               <td>{student.rollNumber}</td>
//               <td>{student.studentId}</td>
//               <td>{student.studentName}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// ATTENDANCE TABLE COMPONENT
const AttendanceTable = ({ cls, students }) => {
    const [attendance, setAttendance] = useState({});
    const [dayKeys, setDayKeys] = useState([]);
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    

    useEffect(() => {
        if (cls.attendance && cls.attendance[month]) {
            setAttendance(cls.attendance[month]);
            setDayKeys(Object.keys(cls.attendance[month])); 
        }
    }, [cls, month]); 
    const handleChange = (event) => {
        setMonth(event.target.value);
      }

      function getTotalAttendence (studentId) {
        let present = 0;
        for(let day in attendance){
            if(attendance[day][studentId] === true){
                present++;
            }
        }
        return present
      }

  return (
    <div className="w-full max-w-4xl p-6 mt-6 shadow-xl rounded-3xl bg-gray-50 dark:bg-gray-800">
      <h2 className="text-xl font-semibold text-center mb-4">Attendance Sheet</h2>
      <div className="flex justify-around items-center">
      <select value={month} onChange={handleChange} className="select select-md  bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <option>Months</option>
        {cls.attendance && Object.keys(cls.attendance).map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <p>working days: {Object.keys(attendance).length}</p>
      </div>
      <table className="table w-full">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
            <th>Day</th>
            {students.map((std) => (
              <th key={std._id}>{std.studentName}</th>
            ))}
            <th>Total Present</th>
          </tr>
        </thead>
        <tbody>
          {dayKeys.map((day) => {
            const dayAttendance = attendance[day] || {}; 
            return (
              <tr key={day}>
                <td>{day}</td>
                {Object.entries(dayAttendance).map(([std, isPresent]) => (
                    
                  <td key={std}>
                    <input
                          type="checkbox"
                          className="checkbox border-1 border-gray-500"
                          checked={isPresent}
                        />
                  </td>
                ))}
                  {Array.from({ length: students.length - Object.keys(dayAttendance).length }).map((_, i) => (
                    <td key={i}></td>
                    ))}

                <td>{Object.values(dayAttendance).filter((isPresent) => isPresent).length}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                <th>Total Days: {Object.keys(attendance).length}</th>
                {students.map((std) => (
                <th key={std._id}>{getTotalAttendence(std.studentId)}</th>
                ))}
                <th></th>
            </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default AdminAttendance;
