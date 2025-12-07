import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { authUser } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="flex justify-between items-center bg-surface-glass dark:bg-surface-glassDark backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20 dark:border-slate-700/50 shadow-sm">
      {/* Left: Greeting & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-display font-bold text-slate-800 dark:text-white">
          {getGreeting()}, <span className="text-primary-500">{authUser?.name?.split(' ')[0] || 'Scholar'}</span> 👋
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
          {authUser?.role || "Guest"} Portal
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar (Visual Only for now) */}
        <div className="hidden md:flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border-none focus-within:ring-2 ring-primary-500/50 transition-all w-64">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 w-full"
          />
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse" />
        </motion.button>

        {/* Profile Avatar */}
        <div className="ml-2 pl-4 border-l border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 p-0.5 cursor-pointer">
            <img 
              src={authUser?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover bg-white"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;