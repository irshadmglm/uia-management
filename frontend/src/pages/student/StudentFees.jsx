import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import { useFeeStore } from '../../store/feesSrore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  CreditCard, CheckCircle2, Clock, ChevronDown, 
  Sparkles, ShieldCheck, AlertCircle, ArrowLeft, Loader2, IndianRupee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (value) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(numValue);
};

function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, value, {
        duration: 1.2,
        ease: "easeOut",
        onUpdate(latest) {
          if (ref.current) {
            ref.current.textContent = formatCurrency(latest);
          }
        }
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref}>{formatCurrency(0)}</span>;
}

const StatCard = ({ title, value, colorClass, borderClass }) => (
  <div className={`bg-white dark:bg-[#11322f] p-5 rounded-2xl border ${borderClass || 'border-gray-100 dark:border-[#0d2522]'} shadow-sm flex flex-col justify-between`}>
    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</p>
    <p className={`text-2xl font-black mt-2 ${colorClass}`}>
      <AnimatedNumber value={value} />
    </p>
  </div>
);

const FeeStatusRing = ({ total, paid, balance }) => {
  const progress = total > 0 ? (paid / total) * 100 : 0;
  const circumference = 2 * Math.PI * 45;

  return (
    <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle className="text-gray-100 dark:text-[#0d2522]" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
        <motion.circle
          className="text-brand-mint"
          strokeWidth="8"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center px-2">
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Balance Due</p>
        <p className="text-xl sm:text-2xl font-black text-rose-500 dark:text-rose-400 mt-0.5">
          {formatCurrency(balance)}
        </p>
        <p className="text-[10px] font-semibold text-brand-mint mt-1">
          {progress.toFixed(0)}% Completed
        </p>
      </div>
    </div>
  );
};

const PaymentHistory = ({ payments }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!payments || Object.keys(payments).length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#11322f] rounded-3xl border border-gray-100 dark:border-[#0d2522] shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 focus:outline-none text-left bg-gray-50/50 dark:bg-[#0d2522]/30 border-b border-gray-100 dark:border-[#0d2522]"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-teal/10 text-brand-teal dark:text-brand-mint">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Monthly Payment Breakdown</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ishthiraq monthly contribution records</p>
          </div>
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(payments).map(([month, amount]) => {
                const isPaid = Boolean(amount && amount > 0);
                const displayMonth = month.replace(/_/g, ' ');

                return (
                  <div
                    key={month}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      isPaid
                        ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-gray-900 dark:text-white"
                        : "bg-gray-50 dark:bg-[#0d2522] border-gray-100 dark:border-[#071a18] text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isPaid ? (
                        <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Clock size={18} className="text-amber-500 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-bold capitalize">{displayMonth}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{isPaid ? "Paid" : "Pending"}</p>
                      </div>
                    </div>

                    <span className={`text-sm font-black ${isPaid ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                      {isPaid ? formatCurrency(amount) : "₹0"}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function StudentFeePortal() {
  const { authUser } = useAuthStore();
  const { fetchFeesByStd } = useFeeStore();
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!authUser?.cicNumber) {
        setError("Student authentication credentials (CIC Number) missing.");
        setIsLoading(false);
        return;
      }
      try {
        const data = await fetchFeesByStd(authUser?.batchName || '', authUser.cicNumber);
        setStudentData(data);
      } catch (err) {
        setError(err.message || "Could not load fee details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [authUser, fetchFeesByStd]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-brand-mint mb-3" />
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Fetching fee & Ishthiraq records...</p>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-[#11322f] rounded-3xl p-8 border border-gray-100 dark:border-[#0d2522] shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fee Record Notification</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
              {error || "Fee records for your student ID could not be loaded from the Ishthiraq registry."}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-[#0d2522] hover:bg-[#11322f] text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { name, subscription, payments } = studentData;
  const total = parseFloat(subscription?.perYear) || 0;
  const balance = parseFloat(subscription?.balance) || 0;
  const paid = Math.max(0, total - balance);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-10">
      
      {/* Top Header Card */}
      <div className="relative bg-[#0d2522] rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden border border-[#11322f]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#11322f] via-[#0d2522] to-[#071a18]"></div>
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-brand-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-brand-mint/15 rounded-full blur-2xl"></div>
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize:'24px 24px'}}></div>
        <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-gradient-to-b from-brand-mint via-brand-teal to-transparent rounded-r-full"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="pl-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-brand-mint/90 uppercase tracking-[0.2em] bg-brand-mint/10 px-2.5 py-1 rounded-full border border-brand-mint/20">
                Ishthiraq Portal
              </span>
              <span className="text-[10px] font-semibold text-white/50 bg-white/10 px-2.5 py-1 rounded-full">
                CIC: {authUser?.cicNumber}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <CreditCard className="text-brand-mint w-8 h-8" />
              Student Fee & Ishthiraq Summary
            </h1>
            <p className="text-white/60 text-xs sm:text-sm max-w-xl leading-relaxed">
              Welcome, <strong className="text-brand-mint">{name}</strong>! Review your annual Ishthiraq subscription and monthly payment logs.
            </p>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-brand-mint/10 border border-brand-mint/20 flex-shrink-0">
            <IndianRupee className="w-10 h-10 text-brand-mint" />
            <span className="text-[9px] text-brand-mint font-bold uppercase tracking-wider mt-1">
              Active Record
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="bg-white dark:bg-[#11322f] rounded-3xl p-6 border border-gray-100 dark:border-[#0d2522] shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
          <FeeStatusRing total={total} paid={paid} balance={balance} />
          
          <div className="w-full md:w-auto flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard 
              title="Annual Ishthiraq Total" 
              value={total} 
              colorClass="text-gray-900 dark:text-white" 
            />
            <StatCard 
              title="Total Amount Paid" 
              value={paid} 
              colorClass="text-emerald-600 dark:text-emerald-400" 
              borderClass="border-emerald-500/20"
            />
            <StatCard 
              title="Remaining Balance" 
              value={balance} 
              colorClass="text-rose-600 dark:text-rose-400" 
              borderClass="border-rose-500/20"
            />
            <div className="bg-gray-50 dark:bg-[#0d2522] p-5 rounded-2xl border border-gray-100 dark:border-[#071a18] flex flex-col justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Payment Status</p>
              <div className="flex items-center gap-2 mt-2">
                <ShieldCheck size={20} className={balance === 0 ? "text-emerald-500" : "text-amber-500"} />
                <span className={`text-base font-black ${balance === 0 ? "text-emerald-500" : "text-amber-500"}`}>
                  {balance === 0 ? "Fully Settled" : "Partial Due"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Payments Breakdown */}
      <PaymentHistory payments={payments} />

    </div>
  );
}