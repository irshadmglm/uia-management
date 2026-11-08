import React, { useEffect, useState, useMemo } from "react";
import { useLeaveStore } from "../../store/useLeaveStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useStaffStore } from "../../store/useStaffStore";
import { useParams, Link } from "react-router-dom";

import { 
  Search, Users, AlertTriangle, CheckCircle, Plus, Edit2, Trash2, X, 
  RefreshCw, ShieldCheck, Lock, ArrowLeft 
} from "lucide-react";
import { motion } from "framer-motion";
import CustomSelect from '../../components/CustomSelect';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`p-4 rounded-2xl bg-white dark:bg-[#11322f] shadow-sm border-l-4 ${color} flex items-center gap-4 border border-gray-100 dark:border-[#0d2522]`}>
    <div className={`p-3 rounded-xl bg-gray-50 dark:bg-[#0d2522]`}>
      <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-extrabold text-gray-800 dark:text-white font-mono">{value}</h3>
    </div>
  </div>
);

const EditModal = ({ isOpen, onClose, student, onSave }) => {
  if (!isOpen || !student) return null;
  
  const [form, setForm] = useState({ ...student });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Live calculation of remaining balance
  const novCasual = parseInt(form.novCasual, 10) || 0;
  const novMed = parseInt(form.novMedical, 10) || 0;
  const novCond = parseInt(form.novCondonation, 10) || 0;
  const mayCasual = parseInt(form.mayCasual, 10) || 0;
  const mayMed = parseInt(form.mayMedical, 10) || 0;
  const mayCond = parseInt(form.mayCondonation, 10) || 0;

  const novTotal = novCasual + novMed + novCond;
  const mayTotal = mayCasual + mayMed + mayCond;
  const calculatedBalance = 15 - (novTotal + mayTotal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(student.cicNumber, {
        novCasual: form.novCasual,
        novMedical: form.novMedical,
        novCondonation: form.novCondonation,
        mayCasual: form.mayCasual,
        mayMedical: form.mayMedical,
        mayCondonation: form.mayCondonation,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-[#11322f] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-[#0d2522]"
      >
        <div className="p-6 border-b border-gray-100 dark:border-[#0d2522] flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{student.name}</h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">CIC: {student.cicNumber}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg transition-colors">
              <X size={20} />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
            {/* Live Calculated Balance Banner */}
            <div className={`p-4 rounded-2xl text-center mb-6 border transition-colors ${
              calculatedBalance <= 5 
                ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400' 
                : calculatedBalance <= 10 
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400' 
                : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400'
            }`}>
                <span className="text-xs uppercase font-bold tracking-wider opacity-80">Calculated Balance Leave</span>
                <div className="text-4xl font-black mt-1 font-mono">{calculatedBalance}</div>
                <div className="flex justify-center items-center gap-4 mt-2 text-xs font-semibold opacity-80">
                  <span>Nov Total: <strong className="font-mono">{novTotal}</strong></span>
                  <span>•</span>
                  <span>May Total: <strong className="font-mono">{mayTotal}</strong></span>
                  <span>•</span>
                  <span>Total Taken: <strong className="font-mono">{novTotal + mayTotal} / 15</strong></span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* November Section */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-800/40 pb-2">
                  <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300">November Semester</h4>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">Total: {novTotal}</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <InputGroup label="Casual" name="novCasual" value={form.novCasual} onChange={handleChange} />
                  <InputGroup label="Med" name="novMedical" value={form.novMedical} onChange={handleChange} />
                  <InputGroup label="Cond" name="novCondonation" value={form.novCondonation} onChange={handleChange} />
                </div>
              </div>

              {/* May Section */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 space-y-3">
                <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-800/40 pb-2">
                  <h4 className="font-bold text-sm text-purple-900 dark:text-purple-300">May Semester</h4>
                  <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">Total: {mayTotal}</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <InputGroup label="Casual" name="mayCasual" value={form.mayCasual} onChange={handleChange} />
                  <InputGroup label="Med" name="mayMedical" value={form.mayMedical} onChange={handleChange} />
                  <InputGroup label="Cond" name="mayCondonation" value={form.mayCondonation} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
                <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-[#0d2522] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#0a1a18] transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white font-bold shadow-md shadow-brand-teal/20 transition-all text-sm flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Saving to Google Sheet...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
            </div>
        </form>
      </motion.div>
    </div>
  );
};

const InputGroup = ({ label, ...props }) => (
    <div>
        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">{label}</label>
        <input 
          type="number" 
          min="0"
          {...props} 
          className="w-full p-2.5 rounded-xl bg-white dark:bg-[#0d2522] border border-gray-200 dark:border-[#0d2522] focus:ring-2 focus:ring-brand-teal outline-none transition font-mono text-sm text-center text-gray-900 dark:text-white" 
        />
    </div>
);

const AddModal = ({ isOpen, onClose, onAdd }) => {
    if(!isOpen) return null;
    const [name, setName] = useState("");
    const [cic, setCic] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        await onAdd({ name, cicNumber: cic });
        setIsAdding(false);
        onClose();
        setName(""); setCic("");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#11322f] w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-[#0d2522]">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Add New Student</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Student Name</label>
                      <input placeholder="Student Name" value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-[#0d2522] dark:text-white dark:border-[#0d2522] text-sm focus:ring-2 focus:ring-brand-teal outline-none" required />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">CIC Number</label>
                      <input placeholder="CIC Number" value={cic} onChange={e=>setCic(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-[#0d2522] dark:text-white dark:border-[#0d2522] text-sm font-mono focus:ring-2 focus:ring-brand-teal outline-none" required type="number" />
                    </div>
                    <button type="submit" disabled={isAdding} className="w-full py-3 bg-brand-teal text-white rounded-xl font-bold hover:bg-brand-teal/90 transition-all text-sm shadow-md">
                      {isAdding ? "Adding to Sheet..." : "Add to Sheet"}
                    </button>
                    <button type="button" onClick={onClose} className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">Cancel</button>
                </form>
            </div>
        </div>
    )
}

const LeaveStatusPage = () => {
  const { 
    sheetBatches, teacherBatches, fetchSheetBatches, fetchLeaveData, 
    leaveData, stats, isLoading, updateStudentLeave, addStudent, deleteStudent,
    canEdit: serverCanEdit 
  } = useLeaveStore();

  const { authUser } = useAuthStore();
  const { batches: staffBatches, getBatch } = useStaffStore();
  const { batchId } = useParams();

  const [selectedBatch, setSelectedBatch] = useState("");
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Load teacher assigned batches from staffStore if teacher
  useEffect(() => {
    if (authUser?.role === "teacher") {
      getBatch();
    }
  }, [authUser, getBatch]);

  // Initial fetch of sheet batches and smart selection
  useEffect(() => {
    const init = async () => {
      const res = await fetchSheetBatches();
      const batches = res.batches || [];
      const teacherAssignedNames = res.teacherBatches || [];

      if (batches.length === 0) return;

      // 1. If batchId is in the URL params (navigated from CalssTeacherHome)
      if (batchId && staffBatches.length > 0) {
        const matchingStaffBatch = staffBatches.find(b => b._id === batchId);
        if (matchingStaffBatch) {
          const matchedSheet = batches.find(b => 
            b.trim().toLowerCase() === matchingStaffBatch.name.trim().toLowerCase() ||
            b.toLowerCase().includes(matchingStaffBatch.name.trim().toLowerCase()) ||
            matchingStaffBatch.name.toLowerCase().includes(b.trim().toLowerCase())
          );
          if (matchedSheet) {
            setSelectedBatch(matchedSheet);
            return;
          }
        }
      }

      // 2. If user is a teacher with assigned classes, auto-select their class tab
      if (authUser?.role === "teacher" && (teacherAssignedNames.length > 0 || staffBatches.length > 0)) {
        const assignedNames = [
          ...teacherAssignedNames, 
          ...staffBatches.map(b => b.name)
        ];
        const matched = batches.find(b => 
          assignedNames.some(an => 
            an.trim().toLowerCase() === b.trim().toLowerCase() ||
            b.toLowerCase().includes(an.trim().toLowerCase()) ||
            an.toLowerCase().includes(b.trim().toLowerCase())
          )
        );
        if (matched) {
          setSelectedBatch(matched);
          return;
        }
      }

      // 3. Fallback to first batch
      if (!selectedBatch && batches.length > 0) {
        setSelectedBatch(batches[0]);
      }
    };

    init();
  }, [batchId, staffBatches, authUser]);

  // When selectedBatch changes, fetch data
  useEffect(() => { 
    if (selectedBatch) {
      fetchLeaveData(selectedBatch); 
    }
  }, [selectedBatch, fetchLeaveData]);

  // Check if current user is the class teacher for the selected batch
  const isClassTeacher = useMemo(() => {
    if (authUser?.role === "admin") return true;
    if (!selectedBatch) return false;

    const normSelected = selectedBatch.trim().toLowerCase();

    const matchesTeacherBatches = teacherBatches.some(b => {
      const norm = (b || '').trim().toLowerCase();
      return norm === normSelected || normSelected.includes(norm) || norm.includes(normSelected);
    });

    const matchesStaffBatches = staffBatches.some(b => {
      const norm = (b.name || '').trim().toLowerCase();
      return norm === normSelected || normSelected.includes(norm) || norm.includes(normSelected);
    });

    return matchesTeacherBatches || matchesStaffBatches;
  }, [authUser, selectedBatch, teacherBatches, staffBatches]);

  const canEdit = authUser?.role === "admin" || isClassTeacher || serverCanEdit;

  const filtered = leaveData.filter(s => 
    s.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.cicNumber?.includes(search)
  );

  return (
    <div className="transition-colors pb-20">
      
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb / Back Link if navigated from CalssTeacherHome */}
        {batchId && (
          <div className="mb-4">
            <Link 
              to={`/dashboard/teacher/calss-teacher-home/${batchId}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-teal dark:text-brand-mint hover:underline"
            >
              <ArrowLeft size={14} /> Back to Class Portal
            </Link>
          </div>
        )}

        {/* Top Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Leave Register</h1>
                  {authUser?.role === "admin" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <ShieldCheck size={14} /> Admin Access
                    </span>
                  ) : isClassTeacher ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck size={14} /> Class Teacher (Editable)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <Lock size={14} /> View Only
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Live Sync with Google Sheets</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                <CustomSelect 
                    value={selectedBatch} 
                    onChange={e => setSelectedBatch(e.target.value)}
                    className="py-2.5 px-3 bg-white dark:bg-[#11322f] border border-gray-200 dark:border-[#0d2522] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-900 dark:text-white shadow-sm"
                >
                    {sheetBatches.map(b => {
                      const isMyClass = (authUser?.role === "teacher") && (
                        teacherBatches.some(tb => tb.trim().toLowerCase() === b.trim().toLowerCase()) ||
                        staffBatches.some(sb => sb.name.trim().toLowerCase() === b.trim().toLowerCase())
                      );
                      return (
                        <option key={b} value={b}>
                          {b} {isMyClass ? '★ (Your Class)' : ''}
                        </option>
                      );
                    })}
                </CustomSelect>

                {/* Refresh Data button */}
                <button
                  type="button"
                  onClick={() => selectedBatch && fetchLeaveData(selectedBatch)}
                  disabled={isLoading}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-[#0d2522] bg-white dark:bg-[#11322f] text-gray-600 dark:text-gray-300 hover:text-brand-teal dark:hover:text-brand-mint transition-colors shadow-sm"
                  title="Refresh from Google Sheet"
                >
                  <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                </button>

                {/* Add Student button (for admin or class teacher) */}
                {canEdit && (
                  <button 
                    onClick={() => setIsAddOpen(true)} 
                    className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/90 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
                  >
                      <Plus size={16} /> Add Student
                  </button>
                )}
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
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by student name or CIC number..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm bg-white dark:bg-[#11322f] text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-teal outline-none text-sm placeholder-gray-400" 
            />
        </div>

        {/* The Table */}
        <div className="bg-white dark:bg-[#11322f] rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-[#0d2522]">
            {isLoading ? (
                <div className="p-20 text-center flex flex-col items-center">
                    <div className="loading loading-spinner loading-lg text-brand-teal"></div>
                    <p className="mt-4 text-gray-500 text-sm font-semibold">Syncing with Google Sheets...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-[#0d2522] text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">
                            {/* Group Headers */}
                            <tr className="border-b border-gray-100 dark:border-[#11322f]">
                                <th colSpan="2" className="p-4 border-r border-gray-100 dark:border-[#11322f] bg-gray-100/60 dark:bg-[#0a1f1d]">Student Info</th>
                                <th colSpan="4" className="p-4 text-center border-r border-gray-100 dark:border-[#11322f] bg-blue-50/70 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">November Semester</th>
                                <th colSpan="4" className="p-4 text-center border-r border-gray-100 dark:border-[#11322f] bg-purple-50/70 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">May Semester</th>
                                <th colSpan="2" className="p-4 text-center">Summary</th>
                            </tr>
                            {/* Column Headers */}
                            <tr className="border-b border-gray-100 dark:border-[#11322f]">
                                <th className="p-4 w-20">CIC</th>
                                <th className="p-4 border-r border-gray-100 dark:border-[#11322f]">Name</th>
                                
                                <th className="p-4 text-center text-blue-600 dark:text-blue-400">Casual</th>
                                <th className="p-4 text-center text-blue-600 dark:text-blue-400">Med</th>
                                <th className="p-4 text-center text-blue-600 dark:text-blue-400">Cond</th>
                                <th className="p-4 text-center font-black border-r border-gray-100 dark:border-[#11322f]">Total</th>

                                <th className="p-4 text-center text-purple-600 dark:text-purple-400">Casual</th>
                                <th className="p-4 text-center text-purple-600 dark:text-purple-400">Med</th>
                                <th className="p-4 text-center text-purple-600 dark:text-purple-400">Cond</th>
                                <th className="p-4 text-center font-black border-r border-gray-100 dark:border-[#11322f]">Total</th>

                                <th className="p-4 text-center">Balance</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#0d2522] text-sm">
                            {filtered.length > 0 ? filtered.map((row) => (
                                <tr key={row.cicNumber} className="hover:bg-gray-50/70 dark:hover:bg-[#0d2522]/50 transition-colors group">
                                    <td className="p-4 font-mono text-xs text-gray-500 dark:text-gray-400">{row.cicNumber}</td>
                                    <td className="p-4 font-bold text-gray-800 dark:text-gray-200 border-r border-gray-100 dark:border-[#0d2522]">{row.name}</td>
                                    
                                    {/* Nov */}
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-400 font-mono">{row.novCasual}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-400 font-mono">{row.novMedical}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-400 font-mono">{row.novCondonation}</td>
                                    <td className="p-4 text-center font-bold bg-blue-50/30 dark:bg-blue-900/10 border-r border-gray-100 dark:border-[#0d2522] font-mono">{row.novTotal}</td>

                                    {/* May */}
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-400 font-mono">{row.mayCasual}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-400 font-mono">{row.mayMedical}</td>
                                    <td className="p-4 text-center text-gray-600 dark:text-gray-400 font-mono">{row.mayCondonation}</td>
                                    <td className="p-4 text-center font-bold bg-purple-50/30 dark:bg-purple-900/10 border-r border-gray-100 dark:border-[#0d2522] font-mono">{row.mayTotal}</td>

                                    {/* Balance */}
                                    <td className="p-4 text-center">
                                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold font-mono ${
                                            parseInt(row.balance, 10) <= 5 
                                            ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300" 
                                            : parseInt(row.balance, 10) <= 10
                                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300"
                                            : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300"
                                        }`}>
                                            {row.balance}
                                        </div>
                                    </td>

                                    {/* Action Column */}
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                          {canEdit ? (
                                            <>
                                              <button 
                                                onClick={() => setEditingStudent(row)} 
                                                className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all font-bold text-xs flex items-center gap-1 shadow-xs"
                                                title="Edit Leave Records"
                                              >
                                                <Edit2 size={13} /> Edit
                                              </button>
                                              <button 
                                                onClick={() => deleteStudent(selectedBatch, row.cicNumber)} 
                                                className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                                title="Delete from Register"
                                              >
                                                <Trash2 size={15} />
                                              </button>
                                            </>
                                          ) : (
                                            <span className="text-xs text-gray-400 italic">Read-only</span>
                                          )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="12" className="p-10 text-center text-gray-400">No students found for this class.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>

      <EditModal 
        isOpen={!!editingStudent} 
        student={editingStudent} 
        onClose={() => setEditingStudent(null)} 
        onSave={(cic, updates) => updateStudentLeave(selectedBatch, cic, updates)} 
      />
      <AddModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onAdd={(data) => addStudent(selectedBatch, data)} 
      />
    </div>
  );
};

export default LeaveStatusPage;