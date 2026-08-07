import React, { useEffect } from 'react';
import { 
  Users, GraduationCap, Users2, FileText, BookOpen, 
  ArrowRight, PlusCircle, ClipboardList, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useDashboardStore } from '../../store/useDashboardStore';

const MetricCard = ({ title, value, icon: Icon, colorClass, gradientClass, loading }) => (
  <div className={`relative overflow-hidden bg-white dark:bg-[#11322f] p-4 sm:p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-[#0d2522] group hover:-translate-y-1 transition-all duration-300`}>
    <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl opacity-20 ${gradientClass} group-hover:scale-150 transition-transform duration-700`}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">{title}</p>
        {loading ? (
          <div className="h-8 w-14 bg-gray-200 dark:bg-[#0d2522] rounded animate-pulse"></div>
        ) : (
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white font-oswald tracking-tight">
            {value}
          </h2>
        )}
      </div>
      <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${colorClass}`}>
        <Icon size={18} className="text-white sm:w-6 sm:h-6" />
      </div>
    </div>
  </div>
);

const QuickAction = ({ title, icon: Icon, to, colorClass }) => (
  <Link to={to} className="group flex flex-col sm:flex-row items-center sm:items-center justify-between p-3 sm:p-4 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-md hover:border-brand-teal/30 transition-all gap-2 sm:gap-0">
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
      <div className={`p-2 sm:p-3 rounded-xl ${colorClass}`}>
        <Icon size={18} className="text-white" />
      </div>
      <span className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200 text-center sm:text-left">{title}</span>
    </div>
    <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all hidden sm:block" />
  </Link>
);

const AdminHome = () => {
  const { authUser } = useAuthStore();
  const { metrics, isLoading, fetchDashboardMetrics } = useDashboardStore();

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="relative bg-[#0d2522] rounded-3xl p-5 sm:p-8 shadow-xl overflow-hidden border border-[#11322f]">
        
        {/* Background decorative layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#11322f] via-[#0d2522] to-[#071a18]"></div>
        
        {/* Glowing orbs */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-brand-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-brand-mint/15 rounded-full blur-xl"></div>

        {/* Subtle dot-grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize:'24px 24px'}}></div>

        {/* Accent left bar */}
        <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-brand-mint via-brand-teal to-transparent rounded-r-full"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="pl-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-brand-mint/70 uppercase tracking-[0.2em]">UIA Academics</span>
              <span className="w-1 h-1 rounded-full bg-brand-mint/40"></span>
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">Admin Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
              Welcome back, <span className="text-brand-mint">{authUser?.name || 'Admin'}</span>! 👋
            </h1>
            <p className="text-white/50 max-w-lg text-xs sm:text-sm mt-2 leading-relaxed">
              Here is what's happening across UIA Academics today. Manage your students, classes, and records all from one central command center.
            </p>
          </div>

          {/* Right decorative badge */}
          <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-brand-mint/10 border border-brand-mint/20 flex-shrink-0">
            <span className="text-3xl leading-none">🎓</span>
            <span className="text-[9px] text-brand-mint/60 font-bold uppercase tracking-wider mt-1">Admin</span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <MetricCard 
          title="Total Students" 
          value={metrics?.totalStudents || 0} 
          icon={Users} 
          colorClass="bg-blue-500 shadow-blue-500/30"
          gradientClass="bg-blue-500"
          loading={isLoading}
        />
        <MetricCard 
          title="Teaching Staff" 
          value={metrics?.totalStaff || 0} 
          icon={Users2} 
          colorClass="bg-purple-500 shadow-purple-500/30"
          gradientClass="bg-purple-500"
          loading={isLoading}
        />
        <MetricCard 
          title="Active Batches" 
          value={metrics?.totalBatches || 0} 
          icon={GraduationCap} 
          colorClass="bg-amber-500 shadow-amber-500/30"
          gradientClass="bg-amber-500"
          loading={isLoading}
        />
        <MetricCard 
          title="Library Books" 
          value={metrics?.totalBooks || 0} 
          icon={BookOpen} 
          colorClass="bg-emerald-500 shadow-emerald-500/30"
          gradientClass="bg-emerald-500"
          loading={isLoading}
        />
      </div>

      {/* Quick Actions & Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-teal" />
            Quick Management Actions
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <QuickAction title="Manage Students" icon={Users} to="/dashboard/admin/users" colorClass="bg-gradient-to-br from-blue-400 to-blue-600" />
            <QuickAction title="Assign Duties" icon={ClipboardList} to="/dashboard/admin/assign-duties" colorClass="bg-gradient-to-br from-purple-400 to-purple-600" />
            <QuickAction title="Academic Records" icon={FileText} to="/dashboard/admin/academic-records" colorClass="bg-gradient-to-br from-brand-teal to-brand-teal-dark" />
            <QuickAction title="Library" icon={BookOpen} to="/dashboard/admin/library" colorClass="bg-gradient-to-br from-emerald-400 to-emerald-600" />
          </div>
        </div>

        {/* System Summary (Right Column) */}
        <div className="bg-white dark:bg-[#11322f] rounded-3xl p-4 sm:p-6 border border-gray-100 dark:border-[#0d2522] shadow-sm flex flex-col justify-between">
          <div>
             <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">System Data</h3>
             
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-[#0d2522] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-200 dark:bg-[#11322f] rounded-lg text-gray-600 dark:text-gray-300">
                      <FileText size={18} />
                    </div>
                    <span className="font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-300">Academic Records</span>
                  </div>
                  <span className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
                    {isLoading ? "..." : (metrics?.totalRecords || 0)}
                  </span>
                </div>
             </div>
          </div>

          <div className="mt-4 sm:mt-8 p-4 sm:p-5 bg-gradient-to-br from-brand-teal/10 to-transparent rounded-2xl border border-brand-teal/20 text-center">
            <p className="text-xs sm:text-sm font-medium text-brand-teal mb-2 sm:mb-3">Need to update system settings?</p>
            <Link to="/dashboard/admin/management" className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-brand-teal text-white rounded-xl font-bold text-sm hover:bg-brand-teal-dark transition-colors">
              Manage Academic Info
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminHome;
