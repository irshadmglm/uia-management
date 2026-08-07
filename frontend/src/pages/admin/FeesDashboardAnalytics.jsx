import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useFeeStore } from '../../store/feesSrore';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, IndianRupee, AlertTriangle, CheckCircle2, PlusCircle, RefreshCw } from 'lucide-react';

// --- Theme-aware chart hook ---
function useChartTheme() {
  const [colors, setColors] = useState({ text: '#374151', grid: '#e5e7eb', tooltip: '#ffffff' });
  useEffect(() => {
    const update = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setColors({
        text: isDark ? '#d1d5db' : '#374151',
        grid: isDark ? '#1f3b38' : '#e5e7eb',
        tooltip: isDark ? '#0d2522' : '#ffffff',
      });
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return colors;
}

// --- KPI Card ---
const KpiCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className={`relative overflow-hidden bg-white dark:bg-[#11322f] rounded-2xl p-5 shadow-md border border-gray-100 dark:border-[#0d2522] group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {subtext && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className={`absolute bottom-0 left-0 right-0 h-1 ${color} opacity-30 group-hover:opacity-60 transition-opacity`}></div>
  </div>
);

// --- Skeleton Loader ---
const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-gray-200 dark:bg-[#11322f] h-28 rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="bg-gray-200 dark:bg-[#11322f] h-72 rounded-2xl lg:col-span-3" />
      <div className="bg-gray-200 dark:bg-[#11322f] h-72 rounded-2xl lg:col-span-2" />
    </div>
    <div className="bg-gray-200 dark:bg-[#11322f] h-64 rounded-2xl" />
  </div>
);

// --- Charts Section ---
const ChartsSection = ({ charts, kpi }) => {
  const { text, grid, tooltip } = useChartTheme();
  const overallData = [
    { name: 'Collected', value: kpi.totalCollected },
    { name: 'Outstanding', value: kpi.totalOutstanding },
  ];
  const PIE_COLORS = ['#00b87c', '#f97316'];
  const tooltipStyle = {
    backgroundColor: tooltip,
    color: text,
    border: '1px solid',
    borderColor: grid,
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    padding: '8px 14px',
  };

  const collectionPct = kpi.totalRevenueDue > 0
    ? ((kpi.totalCollected / kpi.totalRevenueDue) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-[#11322f] p-5 rounded-2xl shadow-md border border-gray-100 dark:border-[#0d2522] lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Collection vs Due by Batch</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts.collectionByBatch} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={grid} />
              <XAxis dataKey="batchName" fontSize={11} tick={{ fill: text }} tickLine={false} axisLine={false} />
              <YAxis fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fill: text }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,184,124,0.05)' }} />
              <Legend wrapperStyle={{ fontSize: '12px', color: text, paddingTop: '12px' }} />
              <Bar dataKey="due" fill="#a78bfa" name="Total Due" radius={[6, 6, 0, 0]} />
              <Bar dataKey="collected" fill="#00b87c" name="Collected" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-[#11322f] p-5 rounded-2xl shadow-md border border-gray-100 dark:border-[#0d2522] lg:col-span-2 flex flex-col">
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">Overall Payment Status</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{collectionPct}% of total dues collected</p>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={overallData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4}>
                    {overallData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: text }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">{collectionPct}%</span>
                <span className="text-xs text-gray-400">Collected</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-5 mt-3">
            {overallData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white dark:bg-[#11322f] p-5 rounded-2xl shadow-md border border-gray-100 dark:border-[#0d2522]">
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-4">Monthly Collection Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={charts.collectionByMonth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={grid} />
            <XAxis dataKey="month" fontSize={11} tick={{ fill: text }} tickLine={false} axisLine={false} />
            <YAxis fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fill: text }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="collected" stroke="#00b87c" strokeWidth={2.5} name="Collected" dot={{ r: 3, fill: '#00b87c', strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- Tables Section ---
const TablesSection = ({ tables }) => (
  <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
    {/* Top Defaulters */}
    <div className="bg-white dark:bg-[#11322f] rounded-2xl shadow-md border border-gray-100 dark:border-[#0d2522] xl:col-span-2 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-[#0d2522] flex items-center gap-2">
        <AlertTriangle size={16} className="text-orange-500" />
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Top Defaulters</h3>
        <span className="ml-auto bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
          {tables.topDefaulters.length}
        </span>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-[#0d2522]">
        {tables.topDefaulters.length > 0 ? (
          tables.topDefaulters.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-[#0d2522] transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gray-100 dark:bg-[#0d2522] text-gray-500 dark:text-gray-400 text-xs font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.batchName}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-red-500">₹{s.balance.toLocaleString('en-IN')}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 dark:text-gray-500">
            <CheckCircle2 size={32} className="mx-auto mb-2 text-green-400" />
            <p className="text-sm">No defaulters!</p>
          </div>
        )}
      </div>
    </div>

    {/* Batch Summary */}
    <div className="bg-white dark:bg-[#11322f] rounded-2xl shadow-md border border-gray-100 dark:border-[#0d2522] xl:col-span-3 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-[#0d2522] flex items-center gap-2">
        <TrendingUp size={16} className="text-brand-mint" />
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Batch Summary</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 dark:text-gray-500 uppercase bg-gray-50 dark:bg-[#0d2522]">
              <th className="px-5 py-3 text-left font-semibold">Batch</th>
              <th className="px-5 py-3 text-center font-semibold">Students</th>
              <th className="px-5 py-3 text-right font-semibold">Due</th>
              <th className="px-5 py-3 text-right font-semibold">Collected</th>
              <th className="px-5 py-3 text-right font-semibold">Outstanding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-[#0d2522]">
            {tables.batchSummary.map((batch, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#0d2522] transition-colors">
                <td className="px-5 py-3 font-bold text-gray-900 dark:text-white">{batch.batchName}</td>
                <td className="px-5 py-3 text-center text-gray-500 dark:text-gray-400">{batch.studentCount}</td>
                <td className="px-5 py-3 text-right text-gray-700 dark:text-gray-300">₹{batch.due.toLocaleString('en-IN')}</td>
                <td className="px-5 py-3 text-right font-semibold text-green-600 dark:text-green-400">₹{batch.collected.toLocaleString('en-IN')}</td>
                <td className="px-5 py-3 text-right font-semibold text-orange-500">₹{batch.outstanding.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// --- Main Component ---
const FeesDashboardAnalytics = () => {
  const { fetchDashboardAnalytics } = useFeeStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDashboardAnalytics();
      setDashboardData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const fmt = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ishthiraq</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Fee collection analytics across all batches</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#0d2522] rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => navigate("/dashboard/admin/add-fees")}
            className="flex items-center gap-2 bg-[#00b87c] hover:bg-[#009e6a] text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition-colors text-sm"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Add Fees</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && <DashboardSkeleton />}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
          <AlertTriangle size={36} className="mx-auto mb-3 text-red-400" />
          <p className="font-semibold text-red-600 dark:text-red-400">Failed to load dashboard</p>
          <p className="text-sm text-red-500 dark:text-red-500 mt-1">{error}</p>
          <button onClick={fetchData} className="mt-4 text-sm text-red-600 dark:text-red-400 underline">Try again</button>
        </div>
      )}
      {!loading && !error && dashboardData && (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <KpiCard title="Total Students" value={dashboardData.kpi.totalStudents} icon={Users} color="bg-blue-500" subtext="Enrolled" />
            <KpiCard title="Revenue Due" value={fmt(dashboardData.kpi.totalRevenueDue)} icon={IndianRupee} color="bg-violet-500" subtext="This year" />
            <KpiCard title="Collected" value={fmt(dashboardData.kpi.totalCollected)} icon={CheckCircle2} color="bg-[#00b87c]" subtext="Total received" />
            <KpiCard title="Outstanding" value={fmt(dashboardData.kpi.totalOutstanding)} icon={TrendingUp} color="bg-orange-500" subtext="Pending balance" />
            <KpiCard title="Defaulters" value={dashboardData.kpi.defaulterCount} icon={AlertTriangle} color="bg-red-500" subtext="Students with dues" />
          </div>

          {/* Charts */}
          <ChartsSection charts={dashboardData.charts} kpi={dashboardData.kpi} />

          {/* Tables */}
          <TablesSection tables={dashboardData.tables} />
        </>
      )}
    </div>
  );
};

export default FeesDashboardAnalytics;