import React, { useEffect } from 'react';
import { 
  ClipboardList, BookCopyIcon, Award, BookUserIcon, 
  ListChecks, LucideHandCoins, BookMarked, DownloadCloud, ArrowRight, BookOpen,
  User, CheckCircle2, Clock, ExternalLink, Plus, Sparkles, GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStaffStore } from '../../store/useStaffStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useStudentStore } from '../../store/studentStore';
import { useAchievement } from '../../store/achivemnetStore';
import { useReadingProgress } from '../../store/readingProgressStore';

const downloadsUrl = "https://drive.google.com/drive/folders/1iTo_Ldar0yfnXF_0yUvCXBMfja9KN99w?usp=drive_link";

const StudentHome = () => {
  const { batch, getStudentBatch } = useStaffStore();
  const { authUser } = useAuthStore();
  const { semSubjects, getCurruntSemSubjects, isLoading: isSubjectsLoading } = useStudentStore();
  const { achievements, getStdAchievements } = useAchievement();
  const { readingProgress, getStdReadingProgress } = useReadingProgress();

  useEffect(() => {
    getStudentBatch();
    getCurruntSemSubjects();
    getStdAchievements();
    getStdReadingProgress();
  }, [getStudentBatch, getCurruntSemSubjects, getStdAchievements, getStdReadingProgress]);

  const role = authUser?.role === 'parent' ? 'parent' : 'student';
  const baseRoute = `/dashboard/${role}`;

  const approvedAchievementsCount = achievements?.filter(a => a.approval).length || 0;
  const recentAchievements = achievements?.slice(-3).reverse() || [];
  const recentReading = readingProgress?.slice(-3).reverse() || [];
  const activeSubjects = semSubjects || [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn pb-6">
      
      {/* Welcome Banner */}
      <div className="relative bg-[#0d2522] rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden border border-[#11322f]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#11322f] via-[#0d2522] to-[#071a18]"></div>
        
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-brand-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-brand-mint/15 rounded-full blur-xl"></div>
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize:'24px 24px'}}></div>
        <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-gradient-to-b from-brand-mint via-brand-teal to-transparent rounded-r-full"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="pl-3 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-brand-mint/90 uppercase tracking-[0.2em] bg-brand-mint/10 px-2.5 py-1 rounded-full border border-brand-mint/20">
                UIA Academics
              </span>
              <span className="text-[10px] font-semibold text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
                {batch?.name || "Student Portal"}
              </span>
              {authUser?.cicNumber && (
                <span className="text-[10px] font-semibold text-brand-teal-light bg-brand-teal/20 px-2.5 py-1 rounded-full border border-brand-teal/30">
                  CIC: {authUser.cicNumber}
                </span>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                Welcome back, <span className="text-brand-mint">
                  {authUser?.role === 'parent' ? `Parent of ${authUser?.name}` : authUser?.name || 'Student'}
                </span>! 👋
              </h1>
              <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                {authUser?.role === 'parent' 
                  ? "Track your child's academic performance, subjects, achievements, and reading progress in real time."
                  : "Here is your academic overview. Monitor your enrolled subjects, logged achievements, and reading progress."
                }
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Link 
                to={`${baseRoute}/profile`} 
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-brand-mint text-[#0d2522] rounded-xl hover:bg-brand-mint/90 transition-all shadow-md"
              >
                <User size={14} /> View My Profile
              </Link>
              <Link 
                to={`${baseRoute}/semester-list`} 
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/15 text-white rounded-xl transition-all border border-white/10"
              >
                <ListChecks size={14} /> Exam Mark List
              </Link>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-br from-brand-mint/20 to-brand-teal/10 border border-brand-mint/30 flex-shrink-0 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-mint/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-4xl transform group-hover:scale-110 transition-transform">🎓</span>
            <span className="text-[10px] text-brand-mint font-bold uppercase tracking-wider mt-1">
              {authUser?.role === 'parent' ? 'Parent' : 'Student'}
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Subjects */}
        <Link to={`${baseRoute}/subjects`} className="group p-5 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-md hover:border-purple-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <BookCopyIcon size={22} />
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              {activeSubjects.length}
            </h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
              Enrolled Subjects
            </p>
          </div>
        </Link>

        {/* Card 2: Achievements */}
        <Link to={`${baseRoute}/achievement`} className="group p-5 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Award size={22} />
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {achievements?.length || 0}
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                ({approvedAchievementsCount} Approved)
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
              Achievements
            </p>
          </div>
        </Link>

        {/* Card 3: Reading Logs */}
        <Link to={`${baseRoute}/reading-progress`} className="group p-5 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <BookUserIcon size={22} />
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              {readingProgress?.length || 0}
            </h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
              Reading Progress Logs
            </p>
          </div>
        </Link>

        {/* Card 4: Academic Register */}
        <Link to={`${baseRoute}/academic-register`} className="group p-5 bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <ClipboardList size={22} />
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 size={18} className="text-emerald-500" /> Active
            </h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
              Academic Register
            </p>
          </div>
        </Link>

      </div>

      {/* Current Semester Subjects Overview */}
      <div className="bg-white dark:bg-[#11322f] rounded-3xl p-6 border border-gray-100 dark:border-[#0d2522] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-teal/10 text-brand-teal dark:text-brand-mint">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Current Semester Subjects</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Subjects assigned for your current academic batch</p>
            </div>
          </div>
          <Link 
            to={`${baseRoute}/subjects`}
            className="text-xs font-bold text-brand-teal dark:text-brand-mint hover:underline flex items-center gap-1"
          >
            View All ({activeSubjects.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {isSubjectsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : activeSubjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeSubjects.slice(0, 6).map((subj, idx) => (
              <div 
                key={subj._id || idx}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0d2522] border border-gray-100 dark:border-[#071a18] flex items-center gap-3 hover:border-brand-teal/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-teal/10 dark:bg-brand-mint/10 text-brand-teal dark:text-brand-mint flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {subj.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    Teacher: {subj?.subTeacherInfo?.[0]?.name || "Assigned"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            No subjects listed for current semester yet.
          </div>
        )}
      </div>

      {/* Split Grid: Recent Achievements & Reading Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Achievements Widget */}
        <div className="bg-white dark:bg-[#11322f] rounded-3xl p-6 border border-gray-100 dark:border-[#0d2522] shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Award size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Achievements</h3>
            </div>
            <Link to={`${baseRoute}/achievement`} className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1">
              Add New <Plus size={14} />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {recentAchievements.length > 0 ? (
              recentAchievements.map((item) => (
                <div 
                  key={item._id} 
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0d2522] border border-gray-100 dark:border-[#071a18] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.achievedItem}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {item.agencyLevel} • {item.placeOrRank}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    item.approval 
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  }`}>
                    {item.approval ? "Approved" : "Pending"}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-xs">
                No achievements recorded yet. Add your first achievement!
              </div>
            )}
          </div>

          <Link 
            to={`${baseRoute}/achievement`} 
            className="w-full text-center py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] rounded-xl hover:bg-gray-100 dark:hover:bg-black/20 transition-all block"
          >
            View All Achievements
          </Link>
        </div>

        {/* Recent Reading Progress Widget */}
        <div className="bg-white dark:bg-[#11322f] rounded-3xl p-6 border border-gray-100 dark:border-[#0d2522] shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <BookUserIcon size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Reading Progress</h3>
            </div>
            <Link to={`${baseRoute}/reading-progress`} className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
              Log Progress <Plus size={14} />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {recentReading.length > 0 ? (
              recentReading.map((item) => (
                <div 
                  key={item._id} 
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0d2522] border border-gray-100 dark:border-[#071a18] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.bookTitle}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      Author: {item.author || "N/A"} • Category: {item.category || "General"}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex-shrink-0 border border-emerald-500/20">
                    Logged
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-xs">
                No reading progress entries logged yet.
              </div>
            )}
          </div>

          <Link 
            to={`${baseRoute}/reading-progress`} 
            className="w-full text-center py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] rounded-xl hover:bg-gray-100 dark:hover:bg-black/20 transition-all block"
          >
            View All Reading Logs
          </Link>
        </div>

      </div>

      {/* Quick Academic Portals & External Resources */}
      <div className="bg-gradient-to-r from-[#11322f] to-[#0d2522] rounded-3xl p-5 border border-white/10 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-mint/20 text-brand-mint flex-shrink-0">
            <Sparkles size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold">Quick Academic Portals & Downloads</h4>
            <p className="text-xs text-white/60">Access internal mark sheets, CE marks, and course downloads</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {batch?.IRmarkList && (
            <a 
              href={batch.IRmarkList} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 flex items-center gap-1.5"
            >
              <BookMarked size={14} /> Internal Mark <ExternalLink size={12} />
            </a>
          )}
          {batch?.CEmarkList && (
            <a 
              href={batch.CEmarkList} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 flex items-center gap-1.5"
            >
              <BookMarked size={14} /> CE Mark <ExternalLink size={12} />
            </a>
          )}
          <a 
            href={downloadsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-bold bg-brand-mint text-[#0d2522] hover:bg-brand-mint/90 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
          >
            <DownloadCloud size={14} /> Downloads Drive <ExternalLink size={12} />
          </a>
        </div>
      </div>

    </div>
  );
};

export default StudentHome;