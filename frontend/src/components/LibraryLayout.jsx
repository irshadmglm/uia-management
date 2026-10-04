import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { 
  Menu, X, BookOpen, LogOut, Moon, Sun, User, ChevronLeft 
} from 'lucide-react';

const LibraryLayout = () => {
  const { logout, authUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { title: "Library Dashboard", icon: BookOpen, route: "/dashboard/library" },
  ];

  return (
    <div className="flex h-screen bg-[#11322f] font-sans overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside 
        className={`fixed z-50 flex flex-col transition-transform duration-300 ease-in-out bg-[#11322f] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:shadow-none
          bottom-0 left-0 right-0 rounded-t-3xl max-h-[85vh]
          lg:bottom-auto lg:right-auto lg:inset-y-0 lg:left-0 lg:w-72 lg:static lg:rounded-none lg:max-h-full lg:bg-transparent
          ${isSidebarOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
        `}
      >
        <div className="lg:hidden w-full flex justify-center pt-3 absolute top-0 left-0 z-10 cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
          <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
        </div>

        <div className="flex items-center justify-between px-6 py-5 lg:py-6 border-b border-[#0d2522] mt-3 lg:mt-0">
          <div className="flex items-center gap-3">
            <img 
              src="/web-app-manifest-192x192.png" 
              alt="UIA Academics Logo" 
              className="h-8 w-8 object-contain" 
            />
            <span className="font-bold text-xl tracking-tight text-white">UIA ACADEMICS</span>
          </div>
          <button 
            className="lg:hidden text-gray-400 hover:text-white bg-white/5 p-1.5 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-slim">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.route || (item.route === '/dashboard/library' && location.pathname === '/dashboard/library/');
            
            const LinkContent = (
              <>
                <item.icon size={18} className={isActive ? "text-brand-mint" : "text-gray-400 group-hover:text-white transition-colors"} />
                <span className="font-medium text-[13px]">{item.title}</span>
              </>
            );

            return (
              <Link
                key={index}
                to={item.route}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#0d2522] text-white shadow-sm' 
                    : 'text-gray-300 hover:bg-[#0d2522] hover:text-white'
                }`}
              >
                {LinkContent}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-[#0d2522] relative" ref={profileMenuRef}>
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-full flex items-center gap-2.5 text-left hover:bg-[#0d2522] p-1.5 rounded-lg transition-colors"
          >
            <img 
              src={authUser?.avatar || "https://ui-avatars.com/api/?name=" + (authUser?.name || "Library") + "&background=00b87c&color=fff"} 
              alt="User" 
              className="w-8 h-8 rounded-full bg-[#0d2522]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{authUser?.name || "Library Staff"}</p>
              <p className="text-[10px] text-brand-mint/80 truncate mt-0.5">{authUser?.email || "Library"}</p>
            </div>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-4 mb-3 w-56 bg-white dark:bg-[#11322f] rounded-2xl shadow-2xl py-2 z-50 border border-gray-100 dark:border-[#0d2522] animate-in slide-in-from-bottom-2 duration-200">
              <button 
                onClick={() => {
                  toggleTheme();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#0d2522] transition-colors"
              >
                {theme === 'light' ? <Moon size={18} className="text-gray-400" /> : <Sun size={18} className="text-gray-400" />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
              
              <div className="h-px bg-gray-100 dark:bg-[#0d2522] my-1 mx-3"></div>

              <button 
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      <header className="lg:hidden absolute top-0 left-0 right-0 h-16 flex items-center justify-between bg-[#11322f] px-4 z-30">
        <button 
          className="p-2 text-white/80 hover:bg-white/10 rounded-lg flex items-center gap-1 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-lg tracking-tight">UIA ACADEMICS</span>
        </div>

        <button 
          className="p-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
      </header>

      <main className="flex-1 flex flex-col mt-16 mb-16 mx-3 lg:mt-4 lg:mb-4 lg:mx-0 lg:mr-4 bg-[#f3f7f6] dark:bg-[#0d2522] rounded-3xl lg:rounded-[2rem] overflow-hidden shadow-2xl relative h-[calc(100vh-8rem)] lg:h-[calc(100vh-2rem)] border border-white/10 dark:border-[#11322f]/50">
        <div className="flex-1 overflow-y-auto overflow-x-auto p-3 sm:p-5 lg:p-10">
          <Outlet />
        </div>
      </main>

      <div className="lg:hidden fixed bottom-2 left-3 right-3 bg-[#0d2522] rounded-2xl px-6 py-3.5 flex justify-between items-center z-30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/5">
        <Link to="/dashboard/library" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/dashboard/library' ? 'text-brand-mint' : 'text-gray-400 hover:text-gray-300'}`}>
          <BookOpen size={22} className={location.pathname === '/dashboard/library' ? 'fill-brand-mint/20' : ''} />
          <span className="text-[10px] font-semibold">Library</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(true)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors">
          <Menu size={22} />
          <span className="text-[10px] font-semibold">Menu</span>
        </button>
      </div>
    </div>
  );
};

export default LibraryLayout;
