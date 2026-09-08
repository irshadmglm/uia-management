import React, { useEffect } from 'react';
import { 
  ClipboardList, BookCopyIcon, Award, BookUserIcon, 
  ListChecks, LucideHandCoins, BookMarked, DownloadCloud, ArrowRight, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStaffStore } from '../../store/useStaffStore';
import { useAuthStore } from '../../store/useAuthStore';

const downloadsUrl = "https://drive.google.com/drive/folders/1iTo_Ldar0yfnXF_0yUvCXBMfja9KN99w?usp=drive_link";

const QuickAction = ({ title, icon: Icon, to, url, colorClass }) => {
  const content = (
    <div className="group flex flex-col sm:flex-row items-center sm:items-center justify-between p-3 sm:p-4 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-md hover:border-brand-teal/30 transition-all gap-2 sm:gap-0 h-full">
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
    return <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">{content}</a>;
  }
  return <Link to={to} className="block h-full">{content}</Link>;
};

const StudentHome = () => {
  const { batch, getStudentBatch } = useStaffStore();
  const { authUser } = useAuthStore();
  
  useEffect(() => {
    getStudentBatch();
  }, [getStudentBatch]);
  
  const baseRoute = `/dashboard/${authUser?.role === 'parent' ? 'parent' : 'student'}`;
  
  const actions = [
    { title: "Academic Register", icon: ClipboardList, route: `${baseRoute}/academic-register`, colorClass: "bg-gradient-to-br from-blue-400 to-blue-600" },
    { title: "Subjects", icon: BookCopyIcon, route: `${baseRoute}/subjects`, colorClass: "bg-gradient-to-br from-purple-400 to-purple-600" },
    { title: "Achievement", icon: Award, route: `${baseRoute}/achievement`, colorClass: "bg-gradient-to-br from-amber-400 to-amber-600" },
    { title: "Reading Progress", icon: BookUserIcon, route: `${baseRoute}/reading-progress`, colorClass: "bg-gradient-to-br from-emerald-400 to-emerald-600" },
    { title: "Mark List", icon: ListChecks, route: `${baseRoute}/semester-list`, colorClass: "bg-gradient-to-br from-cyan-400 to-cyan-600" },
    { title: "Ishthiraq", icon: LucideHandCoins, route: `${baseRoute}/ishthiraq`, colorClass: "bg-gradient-to-br from-rose-400 to-rose-600" },
    { title: "Internal Mark", icon: BookMarked, url: batch?.IRmarkList, colorClass: "bg-gradient-to-br from-indigo-400 to-indigo-600" },
    { title: "CE Mark", icon: BookMarked, url: batch?.CEmarkList, colorClass: "bg-gradient-to-br from-teal-400 to-teal-600" },
    { title: "Downloads", icon: DownloadCloud, url: downloadsUrl, colorClass: "bg-gradient-to-br from-orange-400 to-orange-600" }
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
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">Student Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
              Welcome back, <span className="text-brand-mint">
                {authUser?.role === 'parent' ? `Parent of ${authUser?.name}` : authUser?.name || 'Student'}
              </span>! 👋
            </h1>
            <p className="text-white/50 max-w-lg text-xs sm:text-sm mt-2 leading-relaxed">
              {authUser?.role === 'parent' 
                ? "Here is your child's academic hub. View their records, subjects, and achievements."
                : "Here is your personal academic hub. View your records, subjects, and achievements."
              }
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-brand-mint/10 border border-brand-mint/20 flex-shrink-0">
            <span className="text-3xl leading-none">🎓</span>
            <span className="text-[9px] text-brand-mint/60 font-bold uppercase tracking-wider mt-1">
              {authUser?.role === 'parent' ? 'Parent' : 'Student'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen size={18} className="text-brand-teal" />
          Academic Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {actions.map((action, index) => (
            <QuickAction 
              key={index}
              title={action.title} 
              icon={action.icon} 
              to={action.route} 
              url={action.url}
              colorClass={action.colorClass} 
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default StudentHome;