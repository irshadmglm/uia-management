import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudentStore } from "../../store/studentStore";
import { useStaffStore } from "../../store/useStaffStore";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import { Calendar, Save, CheckCircle, XCircle, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AttendancePage = () => {
  let { classname } = useParams();
  classname = decodeURIComponent(classname);
  const [selectedTab, setSelectedTab] = useState("take");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark pb-20">
      <Header page={"Attendance Register"} />
      
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
              Attendance: <span className="text-primary-600">{classname}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400">Manage daily logs and view monthly reports.</p>
          </div>

          <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            {["take", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  selectedTab === tab
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {tab === "take" ? "Mark Today" : "View History"}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedTab === "take" ? (
            <motion.div 
              key="take"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DayAttendance classname={classname} />
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MonthAttendance classname={classname} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Sub-Component: Mark Daily Attendance ---
const DayAttendance = ({ classname }) => {
  const { getStudents, students } = useStudentStore();
  const { getBatch, batches, isLoading, submitAttendance } = useStaffStore();
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { if (!batches.length) getBatch(); }, []);
  useEffect(() => { if (!students.length) getStudents(); }, []);

  useEffect(() => {
    if (classname && batches.length > 0 && students.length > 0) {
      const classData = batches.find((c) => c.name === classname);
      if (classData) {
        const studentDetails = students.filter((student) =>
          classData.students.includes(student._id)
        );
        // Default to Absent (false) or Present (true)? Usually Present is better UX.
        // Let's stick to your logic (false default) or switch to true.
        setAttendance(studentDetails.map((s) => ({ ...s, present: true }))); 
      }
    }
  }, [classname, batches, students]);

  const togglePresence = (id) => {
    setAttendance(prev => prev.map(s => s.studentId === id ? { ...s, present: !s.present } : s));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let obj = {};
    attendance.forEach((s) => { obj[s.studentId] = s.present; });
    
    if (Object.keys(obj).length > 0) {
      // Find class ID again
      const classData = batches.find((c) => c.name === classname);
      await submitAttendance(classData._id, obj, date);
      toast.success("Attendance submitted successfully");
    }
    setIsSubmitting(false);
  };

  const filtered = attendance.filter(s => s.studentName.toLowerCase().includes(searchTerm.toLowerCase()));
  const presentCount = attendance.filter(s => s.present).length;

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={32} /></div>;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <Calendar className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
          <div className="text-sm font-medium">
            <span className="text-emerald-600">Present: {presentCount}</span>
            <span className="mx-2 text-slate-300">|</span>
            <span className="text-rose-600">Absent: {attendance.length - presentCount}</span>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            placeholder="Search student..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((student) => (
          <motion.div
            key={student.studentId}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => togglePresence(student.studentId)}
            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden group
              ${student.present 
                ? "bg-white dark:bg-slate-800 border-emerald-500/50 shadow-sm hover:border-emerald-500" 
                : "bg-rose-50 dark:bg-rose-900/20 border-rose-500 shadow-md"}
            `}
          >
            <div className={`absolute top-2 right-2 transition-colors ${student.present ? "text-emerald-500" : "text-rose-500"}`}>
              {student.present ? <CheckCircle size={20} /> : <XCircle size={20} />}
            </div>
            
            <div className={`w-16 h-16 rounded-full border-2 p-0.5 ${student.present ? "border-emerald-200" : "border-rose-200"}`}>
               <img 
                 src={student.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${student.studentName}`} 
                 className="w-full h-full rounded-full object-cover" 
                 alt=""
               />
            </div>
            
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{student.studentName}</h3>
              <p className="text-xs text-slate-500">Roll: {student.rollNumber}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          Submit Attendance
        </button>
      </div>
    </div>
  );
};

// --- Sub-Component: History View ---
const MonthAttendance = ({ classname }) => {
  const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const { getBatch, batches } = useStaffStore();
  const [selectedBatch, setSelectedBatch] = useState({});
  const [monthData, setMonthData] = useState({});
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getBatch();
  }, []);

  useEffect(() => {
    const found = batches.find((c) => c.name === classname);
    setSelectedBatch(found || {});
  }, [batches, classname]);

  useEffect(() => {
    if (selectedBatch?.attendance) {
      const data = selectedBatch.attendance[month] || {};
      setMonthData(data);
      // Extract student names from the first day found (assuming consistent)
      const firstDay = Object.keys(data)[0];
      if (firstDay) {
        setStudents(Object.keys(data[firstDay]));
      }
    }
  }, [selectedBatch, month]);

  const days = Object.keys(monthData).sort((a,b) => Number(a) - Number(b));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white">Monthly Report</h3>
        <select 
          value={month} 
          onChange={(e) => setMonth(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
        >
          {selectedBatch?.attendance && Object.keys(selectedBatch.attendance).map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
              <th className="px-4 py-3 min-w-[150px] font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-800 z-10">
                Student Name
              </th>
              {days.map(day => (
                <th key={day} className="px-2 py-3 text-center min-w-[40px] text-slate-500">
                  {day}
                </th>
              ))}
              <th className="px-4 py-3 text-center font-bold text-primary-600">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {students.map(studentName => {
              let presentCount = 0;
              return (
                <tr key={studentName} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 sticky left-0 bg-white dark:bg-slate-800 z-10 shadow-sm md:shadow-none">
                    {studentName}
                  </td>
                  {days.map(day => {
                    const isPresent = monthData[day][studentName];
                    if (isPresent) presentCount++;
                    return (
                      <td key={day} className="px-2 py-3 text-center">
                        <div className={`w-2 h-2 mx-auto rounded-full ${isPresent ? "bg-emerald-500" : "bg-rose-500"}`}></div>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center font-bold text-slate-700 dark:text-slate-300">
                    {days.length > 0 ? Math.round((presentCount / days.length) * 100) : 0}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;