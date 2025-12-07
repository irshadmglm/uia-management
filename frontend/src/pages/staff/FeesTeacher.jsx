import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, ChevronDown, ChevronUp, 
  CreditCard, CheckCircle2, AlertCircle, X,
  Calendar, Loader2, DollarSign
} from "lucide-react";
import { useFeeStore } from "../../store/feesSrore";
import { useStaffStore } from "../../store/useStaffStore";
import { useStudentStore } from "../../store/studentStore";
import Header from "../../components/Header";
import toast from "react-hot-toast";

// Constants
const MONTH_ORDER = [
  "SHAW", "DUL Q", "DUL H", "MUH", "SAF", "RA A", 
  "RA AK", "JUM U", "JUM A", "RAJ", "SHAH", "RAML"
];

const FULL_MONTH_NAMES = {
  'SHAW': 'Shawwal', 'DUL Q': "Dhu al-Qi'dah", 'DUL H': 'Dhu al-Hijjah', 
  'MUH': 'Muharram', 'SAF': 'Safar', 'RA A': "Rabi' al-Awwal", 
  'RA AK': "Rabi' al-Akhir", 'JUM U': 'Jumada al-Ula', 'JUM A': 'Jumada al-Akhirah', 
  'RAJ': 'Rajab', 'SHAH': "Sha'ban", 'RAML': 'Ramadan'
};

// --- Helper Components ---

const StatusBadge = ({ progress }) => {
  if (progress === 100) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
        <CheckCircle2 size={12} /> Fully Paid
      </span>
    );
  }
  if (progress > 50) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
        <DollarSign size={12} /> On Track
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
      <AlertCircle size={12} /> Defaulter
    </span>
  );
};

const PaymentModal = ({ student, onClose, onToggleMonth, isUpdating }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{student.name}</h3>
              <p className="text-primary-100 text-sm mt-1">CIC: {student.cicNumber}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="mt-6 flex justify-between items-end">
            <div>
              <p className="text-xs uppercase tracking-wider opacity-80">Total Paid</p>
              <p className="text-2xl font-bold">{student.progress.toFixed(0)}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider opacity-80">Pending Months</p>
              <p className="text-lg font-semibold">{MONTH_ORDER.length - Object.values(student.status).filter(Boolean).length}</p>
            </div>
          </div>
        </div>

        {/* Month Grid */}
        <div className="p-6">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Payment Record (Click to Toggle)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MONTH_ORDER.map((month) => {
              const isPaid = student.status[month];
              return (
                <button
                  key={month}
                  onClick={() => onToggleMonth(student, month)}
                  disabled={isUpdating}
                  className={`
                    relative p-3 rounded-xl border text-left transition-all duration-200 group
                    ${isPaid 
                      ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" 
                      : "bg-gray-50 border-gray-100 hover:border-primary-300 dark:bg-gray-700/50 dark:border-gray-700"}
                  `}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-bold ${isPaid ? "text-emerald-700 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}`}>
                      {month}
                    </span>
                    {isPaid && <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                    {FULL_MONTH_NAMES[month]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-400">Changes are saved automatically.</p>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Page ---

export default function FeesTeacher() {
  const { batchId } = useParams();
  const { batch, getBatchById } = useStaffStore();
  const { getBatchStudents, batchStudents } = useStudentStore();
  const {
    fees,
    isLoading: feesLoading,
    fetchFees,
    getStudentStatus,
    getStudentProgress,
    updateFee
  } = useFeeStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'paid', 'defaulter'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const init = async () => {
      await getBatchById(batchId);
      await getBatchStudents(batchId);
    };
    init();
  }, [batchId]);

  useEffect(() => {
    if (batch?.name) {
      fetchFees(batch.name);
    }
  }, [batch]);

  // --- Logic to Process Data ---
  const processedStudents = useMemo(() => {
    return batchStudents.map(std => {
      const status = getStudentStatus(std._id);
      const progress = getStudentProgress(std._id);
      
      // Calculate "Paid Until" logic
      let paidUntilIndex = -1;
      for (let i = 0; i < MONTH_ORDER.length; i++) {
        if (status[MONTH_ORDER[i]]) paidUntilIndex = i;
        else break; // Stop at first unpaid month for "Paid Until" logic
      }
      
      const paidUntil = paidUntilIndex >= 0 ? FULL_MONTH_NAMES[MONTH_ORDER[paidUntilIndex]] : "Not Started";
      
      return {
        ...std,
        status,
        progress,
        paidUntil
      };
    }).filter(std => {
      const matchesSearch = std.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (filter === "paid") return matchesSearch && std.progress === 100;
      if (filter === "defaulter") return matchesSearch && std.progress < 100;
      return matchesSearch;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [batchStudents, fees, searchTerm, filter]);

  // --- Handlers ---
  const handleToggleMonth = async (student, month) => {
    setIsUpdating(true);
    try {
      // 1. Create a deep copy of the current status
      const updatedStatus = { ...student.status };
      
      // 2. Toggle the specific month
      // Logic: If it's a string/number (amount), make it null. If null/undefined, make it 'FULL PAID'
      const isCurrentlyPaid = !!updatedStatus[month];
      updatedStatus[month] = isCurrentlyPaid ? "" : "FULL PAID";

      // 3. Construct the full object required by updateFee
      // Note: We need to respect the structure expected by the backend controller
      const payload = {
        name: student.name,
        cicNumber: student.cicNumber,
        payments: { ...updatedStatus }, // Send all months
        subscription: {
            perYear: "0", // These values might need to be fetched from store if critical
            balance: "0"
        }
      };

      // 4. Call Store Action
      await updateFee(student.cicNumber, payload);
      
      // 5. Update local state to reflect change immediately in modal
      setSelectedStudent(prev => ({
        ...prev,
        status: updatedStatus,
        progress: (Object.values(updatedStatus).filter(Boolean).length / 12) * 100
      }));

      toast.success("Payment status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const stats = useMemo(() => {
    const total = processedStudents.length;
    const fullyPaid = processedStudents.filter(s => s.progress === 100).length;
    const defaulters = total - fullyPaid;
    return { total, fullyPaid, defaulters };
  }, [processedStudents]);

  if (feesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-primary-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pb-20 transition-colors">
      <Header page="Fees Management" />
      
      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* 1. Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
              Fee Collection
            </h1>
            <p className="text-slate-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <Calendar size={16} /> 
              {batch?.name || "Loading..."} • {new Date().getFullYear()} Session
            </p>
          </div>

          <div className="flex gap-3">
            <div className="px-5 py-3 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs font-bold uppercase tracking-wide opacity-70">Collected</p>
              <p className="text-2xl font-bold">{stats.fullyPaid}</p>
            </div>
            <div className="px-5 py-3 bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-2xl border border-rose-200 dark:border-rose-800">
              <p className="text-xs font-bold uppercase tracking-wide opacity-70">Pending</p>
              <p className="text-2xl font-bold">{stats.defaulters}</p>
            </div>
          </div>
        </div>

        {/* 2. Filter Bar */}
        <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex flex-col sm:flex-row gap-2">
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            {['all', 'paid', 'defaulter'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === f 
                    ? "bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student name..."
              className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none text-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* 3. The "Smart" List */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-5 md:col-span-4">Student Name</div>
            <div className="hidden md:block col-span-3">Payment Status</div>
            <div className="col-span-4 md:col-span-3">Progress</div>
            <div className="col-span-3 md:col-span-2 text-right">Action</div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {processedStudents.map((std) => (
              <motion.div 
                layout
                key={std._id} 
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                {/* Name Column */}
                <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                    {std.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">{std.name}</p>
                    <p className="text-xs text-slate-500">ID: {std.cicNumber}</p>
                  </div>
                </div>

                {/* Status Column (Desktop) */}
                <div className="hidden md:block col-span-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    {std.progress === 100 ? (
                      <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={14} /> All Cleared</span>
                    ) : (
                      <>
                        <span className="text-slate-400">Paid until:</span> {std.paidUntil}
                      </>
                    )}
                  </p>
                </div>

                {/* Progress Column */}
                <div className="col-span-4 md:col-span-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <StatusBadge progress={std.progress} />
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        std.progress === 100 ? "bg-emerald-500" : "bg-primary-500"
                      }`}
                      style={{ width: `${std.progress}%` }}
                    />
                  </div>
                </div>

                {/* Action Column */}
                <div className="col-span-3 md:col-span-2 text-right">
                  <button
                    onClick={() => setSelectedStudent(std)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </motion.div>
            ))}

            {processedStudents.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                No students found matching filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <PaymentModal 
            student={selectedStudent} 
            onClose={() => setSelectedStudent(null)} 
            onToggleMonth={handleToggleMonth}
            isUpdating={isUpdating}
          />
        )}
      </AnimatePresence>

    </div>
  );
}