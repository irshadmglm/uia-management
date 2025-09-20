// src/components/FeesDashboardAnalytics.js

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useFeeStore } from '../../store/feesSrore';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

// --- Reusable Child Components ---

const KpiCard = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
    <div className="text-xl sm:text-4xl mr-4">{icon}</div>
    <div>
      <p className="text-xs sm:text:sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-sm sm:text-xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

const KpiGrid = ({ data }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
    <KpiCard title="Total Students" value={data.totalStudents} icon="🧑‍🎓" />
    <KpiCard title="Total Revenue Due" value={`₹${data.totalRevenueDue.toLocaleString('en-IN')}`} icon="💰" />
    <KpiCard title="Total Collected" value={`₹${data.totalCollected.toLocaleString('en-IN')}`} icon="✅" />
    <KpiCard title="Total Outstanding" value={`₹${data.totalOutstanding.toLocaleString('en-IN')}`} icon="⏳" />
    <KpiCard title="Defaulters" value={data.defaulterCount} icon="⚠️" />
  </div>
);

const ChartsSection = ({ charts, kpi }) => {
  const overallStatusData = [
    { name: 'Collected', value: kpi.totalCollected },
    { name: 'Outstanding', value: kpi.totalOutstanding },
  ];
  const COLORS = ['#00C49F', '#FF8042'];

  // 1. Create dynamic state variables for chart colors
  const [textColor, setTextColor] = useState('#374151'); // Default to dark gray for light mode
  const [gridColor, setGridColor] = useState('#e5e7eb'); // Default to light gray for light mode
  const [tooltipBg, setTooltipBg] = useState('#ffffff'); // Default to white for light mode

  // 2. useEffect to detect theme and update colors
  useEffect(() => {
    const updateColors = () => {
      if (document.documentElement.classList.contains('dark')) {
        setTextColor('#f3f4f6');     // Light Gray (almost white) for dark mode text
        setGridColor('#4b5563');     // Darker Gray for dark mode grid
        setTooltipBg('#1f2937');     // Dark Gray for dark mode tooltip background
      } else {
        setTextColor('#374151');     // Dark Gray for light mode text
        setGridColor('#e5e7eb');     // Light Gray for light mode grid
        setTooltipBg('#ffffff');     // White for light mode tooltip background
      }
    };

    updateColors(); // Set initial colors

    // Set up an observer to watch for theme changes in real-time
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect(); // Cleanup on unmount
  }, []);

  // Define a reusable tooltip style object
  const tooltipStyle = {
      backgroundColor: tooltipBg,
      color: textColor,
      border: '1px solid',
      borderColor: gridColor,
      borderRadius: '0.5rem'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md lg:col-span-3">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Collection vs. Due by Batch</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={charts.collectionByBatch}>
            {/* 3. Apply the dynamic state variables to chart props */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor}/>
            <XAxis dataKey="batchName" fontSize={10} tick={{ fill: textColor }} />
            <YAxis fontSize={10} tickFormatter={(value) => `₹${value / 1000}k`} tick={{ fill: textColor }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{fill: 'rgba(128, 128, 128, 0.1)'}} />
            <Legend wrapperStyle={{fontSize: '12px', color: textColor}} />
            <Bar dataKey="due" fill="#8884d8" name="Total Due" radius={[4, 4, 0, 0]} />
            <Bar dataKey="collected" fill="#82ca9d" name="Collected" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Overall Payment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie data={overallStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
        {overallStatusData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      {/* UPDATED: Added itemStyle to control the tooltip's text color */}
      <Tooltip 
        contentStyle={tooltipStyle} 
        itemStyle={{ color: textColor }} 
      />
      <Legend wrapperStyle={{fontSize: '12px', color: textColor}} />
    </PieChart>
  </ResponsiveContainer>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md lg:col-span-5">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Monthly Collection Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={charts.collectionByMonth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="month" fontSize={10} tick={{ fill: textColor }}/>
            <YAxis fontSize={10} tickFormatter={(value) => `₹${value / 1000}k`} tick={{ fill: textColor }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{stroke: gridColor, strokeWidth: 2, strokeDasharray: '3 3'}} />
            <Legend wrapperStyle={{fontSize: '12px', color: textColor}} />
            <Line type="monotone" dataKey="collected" stroke="#ff7300" strokeWidth={2} name="Amount Collected" dot={{ r: 4 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TablesSection = ({ tables }) => (
  <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md xl:col-span-2 overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-6">Top 10 Defaulters</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Batch</th>
              <th scope="col" className="px-6 py-3 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {tables.topDefaulters.length > 0 ? (
              tables.topDefaulters.map((student, index) => (
                <tr key={index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{student.name}</td>
                  <td className="px-6 py-4">{student.batchName}</td>
                  <td className="px-6 py-4 text-right font-medium text-red-500">₹{student.balance.toLocaleString('en-IN')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-500 dark:text-gray-400">🎉 No defaulters found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md xl:col-span-3 overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-6">Batch Summary</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Batch</th>
              <th scope="col" className="px-6 py-3">Students</th>
              <th scope="col" className="px-6 py-3 text-right">Due</th>
              <th scope="col" className="px-6 py-3 text-right">Collected</th>
              <th scope="col" className="px-6 py-3 text-right">Outstanding</th>
            </tr>
          </thead>
          <tbody>
            {tables.batchSummary.map((batch, index) => (
              <tr key={index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{batch.batchName}</td>
                <td className="px-6 py-4">{batch.studentCount}</td>
                <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">₹{batch.due.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-right font-medium text-green-600">₹{batch.collected.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-right font-medium text-orange-500">₹{batch.outstanding.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const DashboardSkeleton = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-200 dark:bg-gray-700 h-80 rounded-lg lg:col-span-3"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-80 rounded-lg lg:col-span-2"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-80 rounded-lg lg:col-span-5"></div>
        </div>
    </div>
);

const FeesDashboardAnalytics = () => {
  const { fetchDashboardAnalytics } = useFeeStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetchDashboardAnalytics();
        setDashboardData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const renderContent = () => {
    if (loading) return <DashboardSkeleton />;
    if (error) return <div className="text-center py-20 text-xl text-red-500">Error: {error}</div>;
    if (!dashboardData) return <div className="text-center py-20">No data available.</div>;
    return (
      <>
        <KpiGrid data={dashboardData.kpi} />
        <ChartsSection charts={dashboardData.charts} kpi={dashboardData.kpi} />
        <TablesSection tables={dashboardData.tables} />
      </>
    );
  };

  return (
    <div className="bg-slate-50 dark:bg-gray-900 min-h-screen font-sans">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8 mt-10">
      <div className="max-w-7xl mx-auto">
        {/* UPDATED: Header is now responsive, stacking on mobile */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Fees Dashboard
          </h1>
          {/* UPDATED: Button hides text on mobile for a cleaner look */}
          <button className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
          onClick={() => navigate("/dashboard/admin/add-fees")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline"> Fees</span>
          </button>
        </div>
        {renderContent()}
      </div>
      </main>
    </div>
  );
};

export default FeesDashboardAnalytics;