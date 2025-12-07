import React, { useEffect, useState } from "react";
import { useLeaveStore } from "../../store/useLeaveStore";
import Header from "../../components/Header";
import { Search, Users, AlertTriangle, CheckCircle, Plus, Edit2, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border-l-4 ${color} flex items-center gap-4`}>
    <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-700`}>
      <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-extrabold text-gray-800 dark:text-white">{value}</h3>
    </div>
  </div>
);

const EditModal = ({ isOpen, onClose, student, onSave }) => {
  if (!isOpen || !student) return null;
  
  const [form, setForm] = useState({ ...student });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(student.cicNumber, {
        novCasual: form.novCasual,
        novMedical: form.novMedical,
        novCondonation: form.novCondonation,
        mayCasual: form.mayCasual,
        mayMedical: form.mayMedical,
        mayCondonation: form.mayCondonation,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{student.name}</h3>
              <p className="text-sm text-gray-500">Edit Leaves</p>
            </div>
            <button onClick={onClose}><X className="text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center mb-6">
                <span className="text-sm text-gray-600 dark:text-gray-300 uppercase font-semibold tracking-wide">Balance Leave</span>
                <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-1">{student.balance}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* November Section */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 border-b pb-2">November Semester</h4>
                <div className="grid grid-cols-2 gap-3">
                  <InputGroup label="Casual" name="novCasual" value={form.novCasual} onChange={handleChange} />
                  <InputGroup label="Medical" name="novMedical" value={form.novMedical} onChange={handleChange} />
                  <InputGroup label="Condonation" name="novCondonation" value={form.novCondonation} onChange={handleChange} />
                </div>
              </div>

              {/* May Section */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 border-b pb-2">May Semester</h4>
                <div className="grid grid-cols-2 gap-3">
                  <InputGroup label="Casual" name="mayCasual" value={form.mayCasual} onChange={handleChange} />
                  <InputGroup label="Medical" name="mayMedical" value={form.mayMedical} onChange={handleChange} />
                  <InputGroup label="Condonation" name="mayCondonation" value={form.mayCondonation} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 font-semibold text-gray-700 dark:text-gray-200">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-lg shadow-sky-200 dark:shadow-none transition-all">Save Changes</button>
            </div>
        </form>
      </motion.div>
    </div>
  );
};

const InputGroup = ({ label, ...props }) => (
    <div>
        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{label}</label>
        <input type="number" {...props} className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 outline-none transition font-mono text-sm" />
    </div>
);

const AddModal = ({ isOpen, onClose, onAdd }) => {
    if(!isOpen) return null;
    const [name, setName] = useState("");
    const [cic, setCic] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ name, cicNumber: cic });
        onClose();
        setName(""); setCic("");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold mb-4 dark:text-white">Add New Student</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input placeholder="Student Name" value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" required />
                    <input placeholder="CIC Number" value={cic} onChange={e=>setCic(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" required type="number" />
                    <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">Add to Sheet</button>
                    <button type="button" onClick={onClose} className="w-full py-2 text-gray-500 dark:text-gray-400">Cancel</button>
                </form>
            </div>
        </div>
    )
}

const LeaveStatusPage = () => {
  const { sheetBatches, fetchSheetBatches, fetchLeaveData, leaveData, stats, isLoading, updateStudentLeave, addStudent, deleteStudent } = useLeaveStore();
  const [selectedBatch, setSelectedBatch] = useState("");
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => { fetchSheetBatches(); }, []);
  useEffect(() => { if(sheetBatches.length && !selectedBatch) setSelectedBatch(sheetBatches[0]); }, [sheetBatches]);
  useEffect(() => { if(selectedBatch) fetchLeaveData(selectedBatch); }, [selectedBatch]);

  const filtered = leaveData.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.cicNumber.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors pb-20">
      <Header />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 mt-20">
        
        {/* Top Controls */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leave Register</h1>
                <p className="text-gray-500 dark:text-gray-400">Live Sync with Google Sheets</p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
                <select 
                    value={selectedBatch} 
                    onChange={e => setSelectedBatch(e.target.value)}
                    className="select select-bordered bg-white dark:bg-gray-800 shadow-sm rounded-xl dark:text-white"
                >
                    {sheetBatches.map(b => <option key={b}>{b}</option>)}
                </select>
                <button onClick={() => setIsAddOpen(true)} className="btn bg-sky-600 hover:bg-sky-700 text-white border-none rounded-xl gap-2 shadow-lg shadow-sky-200 dark:shadow-none">
                    <Plus size={18} /> Add
                </button>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard title="Total Students" value={stats.totalStudents || 0} icon={Users} color="border-blue-500" />
            <StatCard title="Critical (< 5)" value={stats.critical || 0} icon={AlertTriangle} color="border-red-500" />
            <StatCard title="Safe Zone" value={stats.safe || 0} icon={CheckCircle} color="border-green-500" />
        </div>

        {/* Search */}
        <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-2xl border-none shadow-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none" />
        </div>

        {/* The Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            {isLoading ? (
                <div className="p-20 text-center flex flex-col items-center">
                    <div className="loading loading-spinner loading-lg text-sky-600"></div>
                    <p className="mt-4 text-gray-500">Syncing...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">
                            {/* Group Headers */}
                            <tr className="border-b dark:border-gray-600">
                                <th colSpan="2" className="p-4 border-r dark:border-gray-600 bg-gray-100 dark:bg-gray-800">Student Info</th>
                                <th colSpan="4" className="p-4 text-center border-r dark:border-gray-600 bg-blue-50 dark:bg-blue-900/10">November Semester</th>
                                <th colSpan="4" className="p-4 text-center border-r dark:border-gray-600 bg-purple-50 dark:bg-purple-900/10">May Semester</th>
                                <th colSpan="2" className="p-4 text-center">Summary</th>
                            </tr>
                            {/* Column Headers */}
                            <tr className="border-b dark:border-gray-700">
                                <th className="p-4 w-20">CIC</th>
                                <th className="p-4 border-r dark:border-gray-600">Name</th>
                                
                                <th className="p-4 text-center text-blue-600 dark:text-blue-400">Casual</th>
                                <th className="p-4 text-center text-blue-600 dark:text-blue-400">Med</th>
                                <th className="p-4 text-center text-blue-600 dark:text-blue-400">Cond</th>
                                <th className="p-4 text-center font-black border-r dark:border-gray-600">Total</th>

                                <th className="p-4 text-center text-purple-600 dark:text-purple-400">Casual</th>
                                <th className="p-4 text-center text-purple-600 dark:text-purple-400">Med</th>
                                <th className="p-4 text-center text-purple-600 dark:text-purple-400">Cond</th>
                                <th className="p-4 text-center font-black border-r dark:border-gray-600">Total</th>

                                <th className="p-4 text-center">Balance</th>
                                <th className="p-4 text-right">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                            {filtered.length > 0 ? filtered.map((row) => (
                                <tr key={row.cicNumber} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group">
                                    <td className="p-4 font-mono text-xs text-gray-500">{row.cicNumber}</td>
                                    <td className="p-4 font-bold text-gray-800 dark:text-gray-200 border-r dark:border-gray-700">{row.name}</td>
                                    
                                    {/* Nov */}
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-400">{row.novCasual}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-400">{row.novMedical}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-400">{row.novCondonation}</td>
                                    <td className="p-4 text-center font-bold bg-blue-50/50 dark:bg-blue-900/10 border-r dark:border-gray-700">{row.novTotal}</td>

                                    {/* May */}
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-400">{row.mayCasual}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-400">{row.mayMedical}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-400">{row.mayCondonation}</td>
                                    <td className="p-4 text-center font-bold bg-purple-50/50 dark:bg-purple-900/10 border-r dark:border-gray-700">{row.mayTotal}</td>

                                    {/* Balance */}
                                    <td className="p-4 text-center">
                                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                                            parseInt(row.balance) <= 5 
                                            ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300" 
                                            : "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300"
                                        }`}>
                                            {row.balance}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingStudent(row)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"><Edit2 size={16} /></button>
                                        <button onClick={() => deleteStudent(selectedBatch, row.cicNumber)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="12" className="p-10 text-center text-gray-400">No students found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>

      <EditModal isOpen={!!editingStudent} student={editingStudent} onClose={() => setEditingStudent(null)} onSave={(cic, updates) => updateStudentLeave(selectedBatch, cic, updates)} />
      <AddModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={(data) => addStudent(selectedBatch, data)} />
    </div>
  );
};

export default LeaveStatusPage;