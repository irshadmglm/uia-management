import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, GraduationCap, Settings, ClipboardList, 
  Award, HandCoins, FileText, DownloadCloud, 
  BookOpen, Layers, ShieldCheck, TrendingUp, 
  AlertCircle, Bell, Plus
} from "lucide-react";
import { Link } from 'react-router-dom';
import { useFeeStore } from '../../store/feesSrore'; // Using existing store for data
import { useStudentStore } from '../../store/studentStore';

// --- Components ---

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-white">{value}</h3>
      {subtext && <p className={`text-xs mt-1 font-medium ${color}`}>{subtext}</p>}
    </div>
    <div className={`p-3 rounded-xl bg-${color.split('-')[1]}-50 dark:bg-slate-700 text-${color.split('-')[1]}-600`}>
      <Icon size={20} />
    </div>
  </div>
);

const MenuCard = ({ title, description, icon: Icon, route, url, color, notificationCount }) => {
  const content = (
    <div className={`
      relative h-full p-5 rounded-2xl border transition-all duration-300 group overflow-hidden
      bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-${color}-200 dark:hover:border-${color}-800
    `}>
      {/* Hover Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-${color}-900/10`} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} />
          </div>
          {notificationCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              {notificationCount} New
            </span>
          )}
        </div>
        
        <div className="mt-auto">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );

  return route ? <Link to={route} className="block h-full">{content}</Link> 
               : <a href={url} target="_blank" rel="noreferrer" className="block h-full">{content}</a>;
};

const AdminHome = () => {
  const { fetchDashboardAnalytics } = useFeeStore();
  const { getStudents, students } = useStudentStore();
  const [stats, setStats] = useState({ revenue: 0, pending: 0, totalStudents: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch 'Live' data to make the dashboard feel real
  useEffect(() => {
    const loadData = async () => {
      // Parallel fetch for speed
      const [feeData, _] = await Promise.all([
        fetchDashboardAnalytics(), // Reuse existing fee analytics [cite: 1577]
        getStudents() // Reuse existing student fetch [cite: 1589]
      ]);

      if (feeData?.kpi) {
        setStats({
          revenue: feeData.kpi.totalCollected,
          pending: feeData.kpi.totalOutstanding,
          totalStudents: students.length || feeData.kpi.totalStudents
        });
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-6 pb-20 max-w-7xl mx-auto">
      
      {/* 1. Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Overview of academic & financial performance.
          </p>
        </div>
        
        <Link 
          to="/dashboard/admin/admission-form"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={18} /> New Admission
        </Link>
      </div>

      {/* 2. Morning Briefing (Stats) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
      >
        <StatCard 
          title="Total Students" 
          value={loading ? "..." : stats.totalStudents} 
          subtext="Active on Campus"
          icon={Users} 
          color="text-blue-600"
        />
        <StatCard 
          title="Revenue Collected" 
          value={loading ? "..." : `₹${(stats.revenue / 1000).toFixed(1)}k`} 
          subtext="Current Session"
          icon={TrendingUp} 
          color="text-emerald-600"
        />
        <StatCard 
          title="Pending Dues" 
          value={loading ? "..." : `₹${(stats.pending / 1000).toFixed(1)}k`} 
          subtext="Needs Attention"
          icon={AlertCircle} 
          color="text-rose-600"
        />
      </motion.div>

      {/* 3. Section Divider */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Management Modules</h2>
        <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
      </div>

      {/* 4. Smart Menu Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Row 1: Core */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <MenuCard 
            title="Student Directory" 
            description="Manage admissions, profiles, and batch allocations."
            icon={Users} 
            route="/dashboard/admin/users" 
            color="blue"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MenuCard 
            title="Fees & Finance" 
            description="Track collections & defaulters."
            icon={HandCoins} 
            route="/dashboard/admin/ishthiraq" 
            color="emerald"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MenuCard 
            title="Academic Setup" 
            description="Batches, Semesters & Subjects."
            icon={Settings} 
            route="/dashboard/admin/management" 
            color="slate"
          />
        </motion.div>

        {/* Row 2: Operations */}
        <motion.div variants={itemVariants}>
          <MenuCard 
            title="Assign Duties" 
            description="Teachers, Leaders & Timetables."
            icon={Layers} 
            route="/dashboard/admin/assign-duties" 
            color="amber"
          />
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-2">
          <MenuCard 
            title="Academic Register" 
            description="Daily attendance logs, leave tracking, and class reports."
            icon={ClipboardList} 
            route="/dashboard/admin/academic-register" 
            color="indigo"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MenuCard 
            title="Exam Results" 
            description="Semester mark entry & analysis."
            icon={Award} 
            route="/dashboard/admin/batches/marklist" 
            color="rose"
          />
        </motion.div>

        {/* Row 3: Extra */}
        <motion.div variants={itemVariants}>
          <MenuCard 
            title="Achievements" 
            description="Approve student awards."
            icon={ShieldCheck} 
            route="/dashboard/admin/batches/achievements" 
            color="purple"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MenuCard 
            title="Reading Logs" 
            description="Library tracking."
            icon={BookOpen} 
            route="/dashboard/admin/batches/reading-progress" 
            color="cyan"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MenuCard 
            title="Documents" 
            description="Syllabus & Circulars."
            icon={FileText} 
            route="/dashboard/admin/academic-records" 
            color="gray"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MenuCard 
            title="Downloads" 
            description="Resources Drive."
            icon={DownloadCloud} 
            url="https://drive.google.com/drive/folders/1iTo_Ldar0yfnXF_0yUvCXBMfja9KN99w?usp=drive_link" 
            color="red"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminHome;