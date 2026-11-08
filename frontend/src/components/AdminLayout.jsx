import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { 
  Menu, X, Home, Users, GraduationCap, Settings2Icon, 
  ClipboardList, ClipboardCheck, ListTodo, Award, Medal, 
  Book, HandCoins, DownloadCloud, File, BookOpen, LogOut, Moon, Sun, User, 
  ChevronLeft, UserCheck, Briefcase, Calendar, LayoutGrid, List
} from 'lucide-react';

const AdminLayout = () => {
  const { logout, authUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState(() => {
    return localStorage.getItem("admin_sidebar_mode") || "grid";
  });
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const handleSetSidebarMode = (mode) => {
    setSidebarMode(mode);
    localStorage.setItem("admin_sidebar_mode", mode);
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseRoute = "/dashboard/admin";

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else if (location.pathname !== baseRoute && location.pathname !== `${baseRoute}/`) {
      navigate(baseRoute);
    } else {
      navigate(-1);
    }
  };

  const getPageTitle = (pathname) => {
    if (pathname.includes('/users/add')) return 'Add Student';
    if (pathname.includes('/users/edit')) return 'Edit Student';
    if (pathname.includes('/users')) return 'Student Directory';
    if (pathname.includes('/alumni')) return 'Alumni Directory';
    if (pathname.includes('/teachers')) return 'Faculty & Staff';
    if (pathname.includes('/inactive-std')) return 'Inactive Students';
    if (pathname.includes('/admission-form')) return 'Admission Form';
    if (pathname.includes('/academic-records/register')) return 'Academic Register';
    if (pathname.includes('/academic-records')) return 'Academic Records';
    if (pathname.includes('/academic-status')) return 'Batch Academic Status';
    if (pathname.includes('/timetable')) return 'Timetable';
    if (pathname.includes('/teacher-attendance') || pathname.includes('/staff-attendance-register')) return 'Teacher Attendance';
    if (pathname.includes('/assign-duties') || pathname.includes('/duties')) return 'Assign Duties';
    if (pathname.includes('/management')) return 'Management Roles';
    if (pathname.includes('/attendance')) return 'Attendance';
    if (pathname.includes('/semesters')) return 'Semesters';
    if (pathname.includes('/mark-update')) return 'Mark Update';
    if (pathname.includes('/submitted-marks')) return 'Submitted Marks';
    if (pathname.includes('/marks')) return 'Mark Lists';
    if (pathname.includes('/ce-mark')) return 'CE Marks';
    if (pathname.includes('/ir-mark')) return 'IR Marks';
    if (pathname.includes('/profile')) return 'Profile';
    if (pathname.includes('/ishthiraq')) return 'Ishthiraq';
    if (pathname.includes('/achievements')) return 'Achievements';
    if (pathname.includes('/reading-progress')) return 'Reading Progress';
    if (pathname.includes('/batches')) return 'Batches';
    if (pathname.includes('/assigned-subjects')) return 'Assigned Subjects';
    if (pathname.includes('/fees/assign')) return 'Assign Fees';
    if (pathname.includes('/fees/dashboard')) return 'Fees Analytics';
    if (pathname.includes('/fees')) return 'Fees Register';
    if (pathname.includes('/leave-status')) return 'Leave Register';
    if (pathname.includes('/library')) return 'Library Management';
    return 'Dashboard';
  };

  const navItems = [
    { title: "Dashboard", icon: Home, route: "/dashboard/admin" },
    { title: "Academic Register", icon: ClipboardList, route: "/dashboard/admin/academic-register" },
    { title: "Assign Duties", icon: Briefcase, route: "/dashboard/admin/assign-duties" },
    { title: "Timetable", icon: Calendar, route: "/dashboard/admin/timetable" },
    { title: "Teacher Attendance", icon: UserCheck, route: "/dashboard/admin/teacher-attendance" },
    { title: "Manage Academic Info", icon: Settings2Icon, route: "/dashboard/admin/management" },
    { title: "Students' Details", icon: Users, route: "/dashboard/admin/users" },
    { title: "Alumni", icon: GraduationCap, route: "/dashboard/admin/alumni" },
    { title: "Teachers' Details", icon: UserCheck, route: "/dashboard/admin/teachers" },
    { title: "CE Mark", icon: ClipboardCheck, route: "/dashboard/admin/ce-mark" },
    { title: "Internal Mark", icon: ListTodo, route: "/dashboard/admin/ir-mark" },
    { title: "Semester Exam Results", icon: Award, route: "/dashboard/admin/batches/marklist" },
    { title: "Achivements", icon: Medal, route: "/dashboard/admin/batches/achievements" },
    { title: "Reading Progress", icon: Book, route: "/dashboard/admin/batches/reading-progress" },
    { title: "Ishthiraq", icon: HandCoins, route: "/dashboard/admin/ishthiraq" },
    { title: "Downloads", icon: DownloadCloud, url: "https://drive.google.com/drive/folders/1iTo_Ldar0yfnXF_0yUvCXBMfja9KN99w?usp=drive_link" },
    { title: "Academic Records", icon: File, route: "/dashboard/admin/academic-records" },
    { title: "Library Catalog", icon: BookOpen, route: "/dashboard/admin/library" },
  ];

  return (
    <div className="flex h-screen bg-[#11322f] font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar / Bottom Sheet */}
      <aside 
        className={`fixed z-50 flex flex-col transition-transform duration-300 ease-in-out bg-[#11322f] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:shadow-none
          bottom-0 left-0 right-0 rounded-t-3xl max-h-[85vh]
          lg:bottom-auto lg:right-auto lg:inset-y-0 lg:left-0 lg:w-80 lg:static lg:rounded-none lg:max-h-full lg:bg-transparent
          ${isSidebarOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
        `}
      >
        {/* Mobile Drag Handle */}
        <div className="lg:hidden w-full flex justify-center pt-3 absolute top-0 left-0 z-10 cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
          <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
        </div>

        <div className="flex items-center justify-between px-5 py-4 lg:py-5 border-b border-[#0d2522] mt-3 lg:mt-0">
          <div className="flex items-center gap-2.5">
            <img 
              src="/web-app-manifest-192x192.png" 
              alt="UIA Academics Logo" 
              className="h-8 w-8 object-contain" 
            />
            <span className="font-extrabold text-lg tracking-tight text-white">UIA ACADEMICS</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* View Mode Switcher (Grid vs List) */}
            <div className="flex items-center bg-black/25 p-0.5 rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => handleSetSidebarMode("grid")}
                className={`p-1 rounded-md transition-all ${
                  sidebarMode === "grid"
                    ? "bg-brand-mint text-[#11322f] shadow-xs"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Grid View"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                type="button"
                onClick={() => handleSetSidebarMode("list")}
                className={`p-1 rounded-md transition-all ${
                  sidebarMode === "list"
                    ? "bg-brand-mint text-[#11322f] shadow-xs"
                    : "text-gray-400 hover:text-white"
                }`}
                title="List View"
              >
                <List size={13} />
              </button>
            </div>

            <button 
              className="lg:hidden text-gray-400 hover:text-white bg-white/5 p-1.5 rounded-lg transition-colors ml-1"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3.5 py-3.5 scrollbar-slim">
          {sidebarMode === "grid" ? (
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item, index) => {
                const isHome = item.route === '/dashboard/admin';
                const isActive = isHome
                  ? location.pathname === '/dashboard/admin' || location.pathname === '/dashboard/admin/'
                  : item.route && location.pathname.startsWith(item.route);

                const tileClass = `group relative flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all duration-200 min-h-[82px] text-center select-none ${
                  isActive 
                    ? "bg-gradient-to-b from-brand-mint/25 via-[#0d2522] to-[#0a1f1d] border border-brand-mint/50 text-white shadow-lg shadow-black/30 ring-1 ring-brand-mint/30" 
                    : "bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 text-gray-300 hover:text-white hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/25"
                }`;

                const TileContent = (
                  <>
                    {/* Active glow dot */}
                    {isActive && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-mint shadow-[0_0_8px_#00b87c]" />
                    )}
                    {item.url && (
                      <span className="absolute top-1.5 right-2 text-[9px] text-gray-500 group-hover:text-gray-300 font-mono">↗</span>
                    )}

                    {/* Icon Badge */}
                    <div 
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 mb-1.5 ${
                        isActive 
                          ? "bg-brand-mint text-[#11322f] shadow-md shadow-brand-mint/30 scale-105 font-bold" 
                          : "bg-white/[0.05] text-gray-300 group-hover:bg-white/[0.12] group-hover:text-brand-mint group-hover:scale-105"
                      }`}
                    >
                      <item.icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                    </div>

                    {/* Title */}
                    <span 
                      className={`text-[11px] leading-tight font-semibold text-center line-clamp-2 px-1 transition-colors ${
                        isActive 
                          ? "text-white font-bold" 
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {item.title}
                    </span>
                  </>
                );

                if (item.url) {
                  return (
                    <a 
                      key={index} 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={tileClass}
                    >
                      {TileContent}
                    </a>
                  );
                }

                return (
                  <Link
                    key={index}
                    to={item.route}
                    className={tileClass}
                  >
                    {TileContent}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {navItems.map((item, index) => {
                const isHome = item.route === '/dashboard/admin';
                const isActive = isHome
                  ? location.pathname === '/dashboard/admin' || location.pathname === '/dashboard/admin/'
                  : item.route && location.pathname.startsWith(item.route);

                const LinkContent = (
                  <>
                    <item.icon size={18} className={isActive ? "text-brand-mint" : "text-gray-400 group-hover:text-white transition-colors"} />
                    <span className="font-medium text-[13px]">{item.title}</span>
                  </>
                );

                if (item.url) {
                  return (
                    <a 
                      key={index} 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-[#0d2522] hover:text-white transition-colors"
                    >
                      {LinkContent}
                    </a>
                  );
                }

                return (
                  <Link
                    key={index}
                    to={item.route}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-[#0d2522] text-white shadow-sm font-semibold' 
                        : 'text-gray-300 hover:bg-[#0d2522] hover:text-white'
                    }`}
                  >
                    {LinkContent}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* User Account / Footer */}
        <div className="px-4 py-3 border-t border-[#0d2522] relative" ref={profileMenuRef}>
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-full flex items-center gap-2.5 text-left hover:bg-[#0d2522] p-1.5 rounded-lg transition-colors"
          >
            <img 
              src={authUser?.avatar || "https://ui-avatars.com/api/?name=" + (authUser?.name || "Admin") + "&background=00b87c&color=fff"} 
              alt="User" 
              className="w-8 h-8 rounded-full bg-[#0d2522]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{authUser?.name || "Admin User"}</p>
              <p className="text-[10px] text-brand-mint/80 truncate mt-0.5">{authUser?.email || "admin@example.com"}</p>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-4 mb-3 w-56 bg-white dark:bg-[#11322f] rounded-2xl shadow-2xl py-2 z-50 border border-gray-100 dark:border-[#0d2522] animate-in slide-in-from-bottom-2 duration-200">
              <Link 
                to={`/dashboard/${authUser?.role || 'admin'}/profile`}
                onClick={() => setIsProfileMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#0d2522] transition-colors"
              >
                <User size={18} className="text-gray-400 dark:text-gray-400" />
                My Profile
              </Link>
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

      {/* Mobile Header (Outside Main Box) */}
      <header className="lg:hidden absolute top-0 left-0 right-0 h-16 flex items-center justify-between bg-[#11322f] px-3 z-30 shadow-md">
        <button 
          className="px-2.5 py-1.5 text-white/90 hover:text-white active:scale-95 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-1 transition-all shadow-sm"
          onClick={handleBack}
          aria-label="Go back"
          title="Go back"
        >
          <ChevronLeft size={20} />
          <span className="text-xs font-semibold">Back</span>
        </button>
        
        <div className="flex items-center gap-2 px-2 text-center min-w-0">
          <span className="font-bold text-white text-base tracking-tight truncate max-w-[190px]">
            {getPageTitle(location.pathname)}
          </span>
        </div>

        <button 
          className="p-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col mt-16 mb-16 mx-3 lg:mt-4 lg:mb-4 lg:mx-0 lg:mr-4 bg-[#f3f7f6] dark:bg-[#0d2522] rounded-3xl lg:rounded-[2rem] overflow-hidden shadow-2xl relative h-[calc(100vh-8rem)] lg:h-[calc(100vh-2rem)] border border-white/10 dark:border-[#11322f]/50">
        
        {/* Desktop Header with Back Button */}
        <div className="hidden lg:flex items-center justify-between px-6 py-3.5 border-b border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-[#11322f]/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0d2522] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 shadow-sm border border-gray-200/80 dark:border-white/10 transition-all flex items-center gap-1.5 font-medium text-xs sm:text-sm group active:scale-95"
              title="Go back"
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform text-brand-teal dark:text-brand-mint" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-gray-300 dark:bg-white/10"></div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {getPageTitle(location.pathname)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white bg-white/50 dark:bg-[#0d2522]/50 hover:bg-white dark:hover:bg-[#0d2522] border border-gray-200/60 dark:border-white/10 transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-3 sm:p-5 lg:p-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation Footer (Floating outside) */}
      <div className="lg:hidden fixed bottom-2 left-3 right-3 bg-[#0d2522] rounded-2xl px-6 py-3.5 flex justify-between items-center z-30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/5">
        <Link to="/dashboard/admin" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname === '/dashboard/admin' ? 'text-brand-mint' : 'text-gray-400 hover:text-gray-300'}`}>
          <Home size={22} className={location.pathname === '/dashboard/admin' ? 'fill-brand-mint/20' : ''} />
          <span className="text-[10px] font-semibold">Home</span>
        </Link>
        <Link to="/dashboard/admin/users" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname.includes('/users') ? 'text-brand-mint' : 'text-gray-400 hover:text-gray-300'}`}>
          <Users size={22} className={location.pathname.includes('/users') ? 'fill-brand-mint/20' : ''} />
          <span className="text-[10px] font-semibold">Students</span>
        </Link>
        <Link to="/dashboard/admin/academic-records" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname.includes('/records') ? 'text-brand-mint' : 'text-gray-400 hover:text-gray-300'}`}>
          <File size={22} className={location.pathname.includes('/records') ? 'fill-brand-mint/20' : ''} />
          <span className="text-[10px] font-semibold">Records</span>
        </Link>
        <Link to="/dashboard/admin/library" className={`flex flex-col items-center gap-1 transition-colors ${location.pathname.includes('/library') ? 'text-brand-mint' : 'text-gray-400 hover:text-gray-300'}`}>
          <BookOpen size={22} className={location.pathname.includes('/library') ? 'fill-brand-mint/20' : ''} />
          <span className="text-[10px] font-semibold">Library</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(true)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors">
          <Menu size={22} />
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </div>
    </div>
  );
};

export default AdminLayout;
