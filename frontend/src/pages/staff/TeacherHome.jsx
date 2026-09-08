import React, { useEffect } from 'react';
import { 
  Users2, BookOpenText, ClipboardList, DownloadCloud, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStaffStore } from '../../store/useStaffStore';
import { useAuthStore } from '../../store/useAuthStore';

const downloadsUrl = "https://drive.google.com/drive/folders/1iTo_Ldar0yfnXF_0yUvCXBMfja9KN99w?usp=drive_link";

const MetricCard = ({ title, value, icon: Icon, colorClass, gradientClass, loading, route }) => {
  const content = (
    <div className={`relative overflow-hidden bg-white dark:bg-[#11322f] p-4 sm:p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-[#0d2522] group hover:-translate-y-1 transition-all duration-300 h-full`}>
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl opacity-20 ${gradientClass} group-hover:scale-150 transition-transform duration-700`}></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">{title}</p>
          {loading ? (
            <div className="h-8 w-14 bg-gray-200 dark:bg-[#0d2522] rounded animate-pulse"></div>
          ) : (
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-oswald tracking-tight">
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
  
  return route ? <Link to={route} className="block h-full">{content}</Link> : content;
};

const QuickAction = ({ title, icon: Icon, to, url, colorClass }) => {
  const content = (
    <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between p-3 sm:p-4 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-md hover:border-brand-teal/30 transition-all gap-2 sm:gap-0">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <div className={`p-2 sm:p-3 rounded-xl ${colorClass}`}>
          <Icon size={18} className="text-white" />
        </div>
        <span className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200 text-center sm:text-left">{title}</span>
      </div>
      <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all hidden sm:block" />
    </div>
  );

  if (url) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className="group block">{content}</a>;
  }
  return <Link to={to} className="group block">{content}</Link>;
};

const TeacherHome = () => {
  const { getBatch, batches } = useStaffStore();
  const { authUser } = useAuthStore();
  
  useEffect(() => {
    getBatch();
  }, [getBatch]);
  
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
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">Teacher Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
              Welcome back, <span className="text-brand-mint">{authUser?.name || 'Teacher'}</span>! 👋
            </h1>
            <p className="text-white/50 max-w-lg text-xs sm:text-sm mt-2 leading-relaxed">
              Here is your central hub for classes and subjects. Navigate your assigned duties efficiently.
            </p>
          </div>

          {/* Right decorative badge */}
          <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-brand-mint/10 border border-brand-mint/20 flex-shrink-0">
            <span className="text-3xl leading-none">📖</span>
            <span className="text-[9px] text-brand-mint/60 font-bold uppercase tracking-wider mt-1">Staff</span>
          </div>
        </div>
      </div>

      {/* Class Batches Grid */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users2 size={18} className="text-brand-teal" />
          My Classes
        </h3>
        {batches?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {batches.map((c, index) => {
              const colorSchemes = [
                { colorClass: "bg-blue-500 shadow-blue-500/30", gradientClass: "bg-blue-500" },
                { colorClass: "bg-purple-500 shadow-purple-500/30", gradientClass: "bg-purple-500" },
                { colorClass: "bg-amber-500 shadow-amber-500/30", gradientClass: "bg-amber-500" },
                { colorClass: "bg-emerald-500 shadow-emerald-500/30", gradientClass: "bg-emerald-500" }
              ];
              const scheme = colorSchemes[index % colorSchemes.length];
              
              return (
                <MetricCard 
                  key={c._id}
                  title="Class / Batch"
                  value={c.name}
                  icon={Users2}
                  colorClass={scheme.colorClass}
                  gradientClass={scheme.gradientClass}
                  route={`/dashboard/teacher/calss-teacher-home/${c._id}`}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] text-center text-gray-500 dark:text-gray-400">
            No classes assigned.
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpenText size={18} className="text-brand-teal" />
          Teacher Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <QuickAction title="My Subjects" icon={BookOpenText} to="/dashboard/teacher/assigned-subjects" colorClass="bg-gradient-to-br from-blue-400 to-blue-600" />
          <QuickAction title="Academic Register" icon={ClipboardList} to="/dashboard/teacher/academic-register" colorClass="bg-gradient-to-br from-brand-teal to-brand-teal-dark" />
          <QuickAction title="Downloads" icon={DownloadCloud} url={downloadsUrl} colorClass="bg-gradient-to-br from-purple-400 to-purple-600" />
        </div>
      </div>

    </div>
  );
};

export default TeacherHome;