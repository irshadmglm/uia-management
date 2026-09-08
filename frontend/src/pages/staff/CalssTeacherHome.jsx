import React, { useEffect } from 'react';
import { 
  Users, Award, Medal, Book, ClipboardCheck, ListTodo, HandCoins, ArrowRight 
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useStaffStore } from '../../store/useStaffStore';

const QuickAction = ({ title, icon: Icon, to, url, colorClass }) => {
  const content = (
    <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between p-3 sm:p-4 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-md hover:border-brand-teal/30 transition-all gap-2 sm:gap-0 h-full">
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
    return <a href={url} target="_blank" rel="noopener noreferrer" className="group block h-full">{content}</a>;
  }
  return <Link to={to} className="group block h-full">{content}</Link>;
};

const CalssTeacherHome = () => {
  const { batchId } = useParams();
  const { batch, getBatchById } = useStaffStore();
  
  useEffect(() => {
    if(batchId){
      getBatchById(batchId);
    }
  }, [getBatchById, batchId]);
  
  const actions = [
    { title: "Students' Details", icon: Users, route: `/dashboard/teacher/batch-students/${batchId}`, colorClass: "bg-blue-500" },  
    { title: "Semester Exam Results", icon: Award, route: `/dashboard/teacher/batches/marklist/${batchId}`, colorClass: "bg-purple-500" },
    { title: "Achivements", icon: Medal, route: `/dashboard/teacher/batches/achievements/${batchId}`, colorClass: "bg-amber-500" },
    { title: "Reading Progress", icon: Book, route: `/dashboard/teacher/batches/reading-progress/${batchId}`, colorClass: "bg-emerald-500" },
    { title: "CE Mark", icon: ClipboardCheck, url: batch?.CEmarkList, colorClass: "bg-cyan-500" },
    { title: "Internal Mark", icon: ListTodo, url: batch?.IRmarkList, colorClass: "bg-indigo-500" },
    { title: "Ishthiraq", icon: HandCoins, route: `/dashboard/teacher/ishthiraq/${batchId}`, colorClass: "bg-rose-500" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="relative bg-[#0d2522] rounded-3xl p-5 sm:p-8 shadow-xl overflow-hidden border border-[#11322f]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#11322f] via-[#0d2522] to-[#071a18]"></div>
        
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-brand-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-brand-mint/15 rounded-full blur-xl"></div>

        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize:'24px 24px'}}></div>

        <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-brand-mint via-brand-teal to-transparent rounded-r-full"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="pl-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-brand-mint/70 uppercase tracking-[0.2em]">UIA Academics</span>
              <span className="w-1 h-1 rounded-full bg-brand-mint/40"></span>
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">Class Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
              Class <span className="text-brand-mint">{batch?.name || 'Details'}</span>
            </h1>
            <p className="text-white/50 max-w-lg text-xs sm:text-sm mt-2 leading-relaxed">
              Manage your class students, exams, progress, and administrative records.
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-brand-mint/10 border border-brand-mint/20 flex-shrink-0">
            <span className="text-3xl leading-none">🏫</span>
            <span className="text-[9px] text-brand-mint/60 font-bold uppercase tracking-wider mt-1">Class</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users size={18} className="text-brand-teal" />
          Class Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {actions.map((action, index) => (
            <QuickAction 
              key={index}
              title={action.title} 
              icon={action.icon} 
              to={action.route} 
              url={action.url}
              colorClass={`bg-gradient-to-br ${action.colorClass.replace('bg-', 'from-')}-400 to-${action.colorClass.replace('bg-', '')}-600`} 
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default CalssTeacherHome;