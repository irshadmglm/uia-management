import { useState, useEffect, useMemo } from 'react';
import { useFeeStore } from '../../store/feesSrore';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';
import { 
  CreditCard, CheckCircle2, Clock, 
  AlertCircle, RefreshCcw, Download, 
  TrendingUp, Wallet, Receipt
} from 'lucide-react';
import Header from '../../components/Header';

// Constants for sorting months correctly
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

const StatCard = ({ label, amount, icon: Icon, type = "neutral" }) => {
  const styles = {
    neutral: "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700",
    success: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 border-emerald-100 dark:border-emerald-800",
    warning: "bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 border-amber-100 dark:border-amber-800",
    danger: "bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-100 border-rose-100 dark:border-rose-800",
  };

  return (
    <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${styles[type]}`}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{label}</p>
        <h3 className="text-2xl font-mono font-bold">₹{amount.toLocaleString()}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-white/50 dark:bg-black/20`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

const StudentFeePortal = () => {
  const { authUser } = useAuthStore();
  const { fetchFeesByStd, isLoading } = useFeeStore();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (authUser?.batchName && authUser?.cicNumber) {
      fetchFeesByStd(authUser.batchName, authUser.cicNumber).then(setData);
    }
  }, [authUser]);

  const stats = useMemo(() => {
    if (!data) return { total: 0, balance: 0, paid: 0, progress: 0 };
    const total = parseFloat(data.subscription.perYear) || 0;
    const balance = parseFloat(data.subscription.balance) || 0;
    const paid = total - balance;
    const progress = total > 0 ? (paid / total) * 100 : 0;
    return { total, balance, paid, progress };
  }, [data]);

  if (isLoading || !data) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
      <RefreshCcw className="animate-spin text-primary-500" size={40} />
      <p className="text-slate-500 font-medium">Fetching financial records...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pb-20">
      <Header page="My Finances" />
      
      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-8">
        
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
              Fee Dashboard
            </h1>
            <p className="text-slate-500 dark:text-gray-400 mt-1">
              Academic Year {new Date().getFullYear()} • <span className="font-semibold text-primary-600">{authUser?.batchName}</span>
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
            <Download size={16} /> Download Statement
          </button>
        </div>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            label="Total Annual Fee" 
            amount={stats.total} 
            icon={Wallet} 
            type="neutral" 
          />
          <StatCard 
            label="Total Paid" 
            amount={stats.paid} 
            icon={CheckCircle2} 
            type="success" 
          />
          <StatCard 
            label="Balance Due" 
            amount={stats.balance} 
            icon={AlertCircle} 
            type={stats.balance > 0 ? "danger" : "success"} 
          />
        </div>

        {/* 3. Main Content: Ledger & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Progress & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Payment Status</h3>
              
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96" cy="96" r="88"
                    stroke="currentColor" strokeWidth="12" fill="transparent"
                    className="text-slate-100 dark:text-slate-700"
                  />
                  <motion.circle
                    initial={{ strokeDasharray: "0 1000" }}
                    animate={{ strokeDasharray: `${(stats.progress / 100) * 553} 1000` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="96" cy="96" r="88"
                    stroke="currentColor" strokeWidth="12" fill="transparent"
                    className={`${stats.progress === 100 ? 'text-emerald-500' : 'text-primary-600'} stroke-cap-round`}
                    strokeDasharray="553"
                    strokeDashoffset="0"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">{stats.progress.toFixed(0)}%</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Completed</span>
                </div>
              </div>

              {stats.balance > 0 ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl text-left border border-amber-100 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Attention Needed</p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                        You have outstanding dues. Please clear them to avoid late fees.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl text-left border border-emerald-100 dark:border-emerald-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">All Clear!</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                        Great job! Your fees are fully paid for this session.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Transaction History */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Receipt size={20} className="text-primary-500" /> Payment Ledger
                </h3>
                <span className="text-xs font-medium text-slate-500 bg-white dark:bg-slate-700 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-600">
                  {Object.values(data.payments).filter(Boolean).length} / 12 Paid
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {MONTH_ORDER.map((monthKey, index) => {
                  const amount = data.payments[monthKey];
                  const isPaid = !!amount;
                  
                  return (
                    <div 
                      key={monthKey} 
                      className={`flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors
                        ${!isPaid && index < new Date().getMonth() ? 'bg-rose-50/30 dark:bg-rose-900/5' : ''}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border
                          ${isPaid 
                            ? "bg-emerald-100 border-emerald-200 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400" 
                            : "bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700"}
                        `}>
                          {isPaid ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white text-sm">
                            {FULL_MONTH_NAMES[monthKey]}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">{monthKey}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        {isPaid ? (
                          <>
                            <p className="font-mono font-bold text-slate-800 dark:text-white">₹{amount}</p>
                            <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Paid</p>
                          </>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentFeePortal;