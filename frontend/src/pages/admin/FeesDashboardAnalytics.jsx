import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useFeeStore } from '../../store/feesSrore';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, AlertCircle, Wallet, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Styled Components ---

const AnalyticCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="relative overflow-hidden bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 group"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
      <Icon size={80} className={color} />
    </div>
    
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color.replace('text-', 'bg-').replace('500', '100')} dark:bg-opacity-20`}>
        <Icon size={24} className={color} />
      </div>
      
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-3xl font-display font-bold text-slate-800 dark:text-white mt-1">
        {value}
      </h3>
      
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <TrendingUp size={14} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 text-sm">
        <p className="font-bold text-slate-800 dark:text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600 dark:text-slate-300 capitalize">{entry.name}:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {typeof entry.value === 'number' && entry.name !== 'Students' 
                ? `₹${entry.value.toLocaleString()}` 
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const FeesDashboardAnalytics = () => {
  const { fetchDashboardAnalytics } = useFeeStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchDashboardAnalytics();
        setData(res);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  if (!data) return <div className="p-8 text-center text-slate-500">No analytics data available.</div>;

  const { kpi, charts, tables } = data;
  const COLORS = ['#10b981', '#f43f5e', '#f59e0b', '#3b82f6'];

  return (
    <div className="space-y-8 pt-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Financial Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Track revenue, collections, and dues.</p>
        </div>
        <button 
          onClick={() => navigate("/dashboard/admin/add-fees")}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95"
        >
          <Wallet size={18} /> Manage Fees
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticCard 
          title="Total Revenue" 
          value={`₹${kpi.totalRevenueDue.toLocaleString()}`} 
          icon={Wallet} 
          color="text-blue-500" 
          trend="Projected Income"
        />
        <AnalyticCard 
          title="Collected" 
          value={`₹${kpi.totalCollected.toLocaleString()}`} 
          icon={TrendingUp} 
          color="text-emerald-500"
          trend={`${((kpi.totalCollected / kpi.totalRevenueDue) * 100).toFixed(1)}% Recovered`}
        />
        <AnalyticCard 
          title="Outstanding" 
          value={`₹${kpi.totalOutstanding.toLocaleString()}`} 
          icon={AlertCircle} 
          color="text-rose-500"
          trend="Pending Dues"
        />
        <AnalyticCard 
          title="Active Students" 
          value={kpi.totalStudents} 
          icon={Users} 
          color="text-amber-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Monthly Collection Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.collectionByMonth}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="collected" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCollected)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 w-full text-left">Recovery Status</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Collected', value: kpi.totalCollected },
                    { name: 'Outstanding', value: kpi.totalOutstanding }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800 dark:text-white">
                {((kpi.totalCollected / kpi.totalRevenueDue) * 100).toFixed(0)}%
              </span>
              <span className="text-xs text-slate-500 uppercase tracking-wide">Recovered</span>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Collected
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-rose-500" /> Pending
            </div>
          </div>
        </div>
      </div>

      {/* Top Defaulters Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white">Pending Dues Alert</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View All <ArrowRight size={14} />
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Student</th>
              <th className="px-6 py-3">Batch</th>
              <th className="px-6 py-3 text-right">Pending Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {tables.topDefaulters.map((student, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{student.name}</td>
                <td className="px-6 py-3 text-slate-500">{student.batchName}</td>
                <td className="px-6 py-3 text-right font-bold text-rose-500">₹{student.balance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default FeesDashboardAnalytics;