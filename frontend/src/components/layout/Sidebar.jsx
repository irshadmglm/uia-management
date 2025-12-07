import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { 
  LayoutDashboard, Users, BookOpen, Calendar, 
  Award, Settings, LogOut, GraduationCap, 
  FileText, DollarSign, Layers, ChevronLeft, ChevronRight 
} from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, toggle }) => {
  const { authUser, logout } = useAuthStore();
  const role = authUser?.role?.toLowerCase() || "student";

  // Define navigation items per role
  const NAV_ITEMS = {
    admin: [
      { name: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Students", path: "/dashboard/admin/users", icon: GraduationCap },
      { name: "Teachers", path: "/dashboard/admin/management", icon: Users }, // Assuming management holds teachers
      { name: "Academics", path: "/dashboard/admin/academic-register", icon: BookOpen },
      { name: "Duties", path: "/dashboard/admin/assign-duties", icon: Layers },
      { name: "Fees", path: "/dashboard/admin/ishthiraq", icon: DollarSign },
      { name: "Records", path: "/dashboard/admin/academic-records", icon: FileText },
    ],
    teacher: [
      { name: "Dashboard", path: "/dashboard/teacher", icon: LayoutDashboard },
      { name: "My Subjects", path: "/dashboard/teacher/assigned-subjects", icon: BookOpen },
      { name: "Register", path: "/dashboard/teacher/academic-register", icon: FileText },
      { name: "Profile", path: "/dashboard/teacher/profile", icon: Settings },
    ],
    student: [
      { name: "Home", path: "/dashboard/student", icon: LayoutDashboard },
      { name: "Academics", path: "/dashboard/student/academic-register", icon: BookOpen },
      { name: "Results", path: "/dashboard/student/semester-list", icon: FileText },
      { name: "Achievements", path: "/dashboard/student/achievement", icon: Award },
      { name: "Library", path: "/dashboard/student/reading-progress", icon: BookOpen },
      { name: "Fees", path: "/dashboard/student/ishthiraq", icon: DollarSign },
    ]
  };

  const items = NAV_ITEMS[role] || NAV_ITEMS.student;

  return (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Brand Logo */}
      <div className={`flex items-center gap-3 mb-10 transition-all duration-300 ${isOpen ? "px-2" : "justify-center"}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30 text-white font-display font-bold text-xl">
          U
        </div>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex flex-col"
          >
            <span className="font-display font-bold text-lg text-slate-800 dark:text-white tracking-wide">
              UIA ACADEMICS
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Management Suite
            </span>
          </motion.div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.split('/').length > 3} // Exact match for sub-routes if needed
            className={({ isActive }) => `
              relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group
              ${isActive 
                ? "bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/25" 
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2 : 1.5} className="flex-shrink-0" />
                
                {isOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}

                {/* Active Indicator Dot */}
                {!isOpen && isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Toggle */}
      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700/50 space-y-4">
        <button
          onClick={logout}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors w-full ${!isOpen && "justify-center"}`}
        >
          <LogOut size={20} />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>

        <button
          onClick={toggle}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary-600 transition-colors"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;