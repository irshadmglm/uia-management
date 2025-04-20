import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStudentStore } from "../store/studentStore";
import Header from "../components/Header";
import { useStaffStore } from "../store/useStaffStore";
import { useParams } from "react-router-dom";
import Button from "../components/Button";


const AttendancePage = () => {
  let { classname } = useParams();  
  classname = decodeURIComponent(classname);
  const [selectedTab, setSelectedTab] = useState("take")

  
  return (
    <div className="min-h-screen flex flex-col  items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 pt-12 mt-14">
    <Header page={"Attendance Sheet"} />
    <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 w-full sm:w-auto">
        {["take", "total", ].map((tab) => (
          <Button
            key={tab}
            onClick={() => {
              setSelectedTab(tab);
            }}
            className={`px-6 py-3 rounded-t-lg transition-all duration-300 font-medium ${
             selectedTab === tab
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}

      </div>
      {selectedTab === "take" ? <DayAttendence/> : <MonthAttendance classname={classname} /> }

      </div>

  )
}

export default AttendancePage

const DayAttendence = () => {
  let { classname } = useParams();
  classname = decodeURIComponent(classname);
  
  const { getStudents, students, studentsLoading } = useStudentStore();
  const { getBatch, batches, isLoading, submitAttendance } = useStaffStore();
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  useEffect(() => {
    if (!batches.length) getBatch();
  }, [getBatch, batches.length]);

  useEffect(() => {
    if (!students.length) getStudents();
  }, [getStudents, students.length]);

  useEffect(() => {
    if (classname && batches.length > 0 && students.length > 0) {
      const classData = batches.find((c) => c.name === classname);
  
      if (classData) {
        const studentDetails = students.filter((student) =>
          classData.students.includes(student._id)
        );
  
        if (studentDetails.length > 0) {
          setAttendance(
            studentDetails.map((student) => ({
              ...student,
              present: false, 
            }))
          );
        } else {
          console.warn("No students found for class:", classname);
        }
      } else {
        console.warn("Batch not found:", classname);
      }
    }
  }, [classname, batches, students]);
  

  const handleCheckboxChange = (studentId) => {
    setAttendance((prev) =>
      prev.map((student) =>
        student.studentId === studentId
          ? { ...student, present: !student.present }
          : student
      )
    );
  };

  const handleSubmit = () => {
    let obj = {};
    attendance.forEach((s) => {
      obj[s.studentId] = s.present;
    });
    if (Object.keys(obj).length > 0) {
      submitAttendance(attendance[0].classId, obj, date);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 pt-12">
      <Header page={"Attendance Sheet"} />
      
      {studentsLoading || isLoading ? (
        <motion.div
          className="flex items-center justify-center h-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
        </motion.div>
      ) : (
        <motion.div 
          className="p-8 shadow-xl rounded-3xl w-full max-w-4xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-center mb-8">Attendance Sheet</h2>
          <input
            className="input input-bordered w-full pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          
          {attendance.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No students found for this class.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                    <th>Name</th>
                    <th>Batch</th>
                    <th>Roll No</th>
                    <th className="text-center">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                      <td>{student.studentName}</td>
                      <td>{student.selectedBatch}</td>
                      <td>{student.rollNumber}</td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={student.present}
                          onChange={() => handleCheckboxChange(student.studentId)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <motion.button
            className="mt-8 w-full py-4 rounded-2xl text-xl font-semibold transition bg-slate-800 hover:bg-slate-700 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
          >
            Submit Attendance
          </motion.button>
        </motion.div>
      )}

    </div>
  );
};


function MonthAttendance({ classname }) {
  const [attendance, setAttendance] = useState({});
  const [dayKeys, setDayKeys] = useState([]);
  const [studentsName, setStudentsName] = useState([]);
  const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const { getBatch, batches } = useStaffStore();
  const [selectedBatch, setSelectedBatch] = useState({})


  useEffect(() => {
    getBatch();
  const selected = batches.filter((c) => c.name === classname);
      setSelectedBatch(selected[0]);
    }, [])
  
  useEffect(() => {  
      if(selectedBatch?.attendance){
        const monthAttendance = selectedBatch.attendance[month];
      setAttendance(monthAttendance);
        
      const days = Object.keys(monthAttendance);
      setDayKeys(days);

      if (days.length > 0) {
        setStudentsName(Object.keys(monthAttendance[days[0]] || {}));
      }
      }
    
  }, [selectedBatch, month]);

  const handleChange = (event) => {
    setMonth(event.target.value);
  }

  return (
   <div>
        <select value={month} onChange={handleChange} className="select select-md mt-14 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <option>Months</option>
        {selectedBatch?.attendance && Object.keys(selectedBatch.attendance).map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

     <div className="overflow-x-auto p-8 shadow-xl rounded-3xl w-full max-w-4xl">
    <table className="table table-xs">
      <thead>
        <tr>
        <th>Day</th>
            {studentsName.map((stdName) => (
              <th key={stdName}>{stdName}</th>
            ))}
        </tr>
      </thead>
      <tbody>
      {dayKeys.map((day) => {
            const students = attendance[day] || {}; 
            return (
              <tr key={day}>
                <td>{day}</td>
                {Object.entries(students).map(([std, isPresent]) => (
                  <td key={std}>
                    <input
                          type="checkbox"
                          className="checkbox"
                          checked={isPresent}
                        />
                  </td>
                ))}
              </tr>
            );
          })}
        
      </tbody>
  
    </table>
  </div>
   </div>
  );
}


