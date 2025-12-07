import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStudentStore } from "../../store/studentStore";
import { useAdminStore } from "../../store/useAdminMngStore";
import Header from "../../components/Header";
import StudentTable from "../../components/StudentTable";
import { Calendar, Users } from "lucide-react";

const AdminAttendance = () => {
  let { batchId } = useParams();
  const { getBatches, batches, getTeachers, teachers } = useAdminStore();
  const { batchStudents, getBatchStudents } = useStudentStore();
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [activeTab, setActiveTab] = useState("list");

  useEffect(() => {
    getBatches();
    getTeachers();
    if (batchId) getBatchStudents(batchId);
  }, [batchId]);

  useEffect(() => {
    if (batches.length > 0 && batchId) {
      setSelectedBatch(batches.find((c) => c._id === batchId));
    }
  }, [batches, batchId]);

  const teacherName = teachers.find(t => t._id === selectedBatch?.classTeacher)?.name || "Not Assigned";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark pb-20">
      <Header page="Attendance Management" />
      
      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Banner */}
        {selectedBatch && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Users size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedBatch.name}</h1>
                <p className="text-slate-500">Mentor: <span className="font-medium text-slate-700 dark:text-slate-300">{teacherName}</span></p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab("list")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "list" 
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white" 
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Student List
              </button>
              <button 
                onClick={() => setActiveTab("report")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "report" 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Attendance Report
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === "list" ? (
          <StudentTable students={batchStudents} />
        ) : (
          <AttendanceReport cls={selectedBatch} students={batchStudents} />
        )}
      </div>
    </div>
  );
};

// --- Report Sub-Component ---
const AttendanceReport = ({ cls, students }) => {
  const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [monthData, setMonthData] = useState({});
  const days = monthData ? Object.keys(monthData).sort((a,b) => a-b) : [];

  useEffect(() => {
    if (cls?.attendance) {
      setMonthData(cls.attendance[month] || {});
    }
  }, [cls, month]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Calendar className="text-primary-500" size={20}/> Monthly View
        </h3>
        <select 
          value={month} 
          onChange={(e) => setMonth(e.target.value)}
          className="bg-slate-50 dark:bg-slate-900 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer"
        >
          {cls?.attendance && Object.keys(cls.attendance).map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500">
            <tr>
              <th className="px-4 py-3 min-w-[50px] text-center">Day</th>
              {students.map(s => (
                <th key={s._id} className="px-2 py-3 text-center min-w-[80px] font-medium truncate max-w-[100px]">
                  {s.name.split(' ')[0]}
                </th>
              ))}
              <th className="px-4 py-3 text-center font-bold">Present</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {days.map(day => {
              const dayRecords = monthData[day] || {};
              const presentCount = Object.values(dayRecords).filter(v => v).length;
              return (
                <tr key={day} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-center font-bold text-slate-700 dark:text-slate-300">{day}</td>
                  {students.map(s => (
                    <td key={s._id} className="px-2 py-3 text-center">
                      <div className={`w-2.5 h-2.5 mx-auto rounded-full ${dayRecords[s.studentId] ? "bg-emerald-500" : "bg-rose-500"}`}></div>
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center font-bold text-primary-600">{presentCount}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendance;