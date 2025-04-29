import { Menu, Sun, Moon, ArrowLeft, ArrowRight, X, LogOut, User, Settings } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const Header = ({ page, user }) => {
  const { theme, toggleTheme } = useThemeStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const checkNavigation = () => {
      setCanGoBack(window.history.length > 1);
      setCanGoForward(window.history.state !== null);
    };

    checkNavigation();
    window.addEventListener("popstate", checkNavigation);
    return () => {
      window.removeEventListener("popstate", checkNavigation);
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center z-10">
        {/* Left Side: Sidebar & Navigation */}
        <div className="flex items-center gap-4">
          <Menu
            className="text-3xl cursor-pointer hover:text-blue-500 transition-colors duration-200"
            onClick={() => setIsSidebarOpen(true)}
          />
      
        </div>

        {/* Page Title */}
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{page}</h1>

        {/* Right Side: Theme Toggle & Profile Dropdown */}
        <div className="flex items-center gap-4">
      


        <div className="relative">
  {/* Profile Dropdown Trigger */}
  <button
    className="flex items-center gap-3 p-2 rounded-xl bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
    onClick={() => setDropdownOpen(!dropdownOpen)}
    aria-haspopup="true"
    aria-expanded={dropdownOpen}
  >
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYzrKwzB9qf6z1LUGt9CMjPzC5zBy87WL6Fw&s"
      alt="User profile"
      className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
    />
    <span className="hidden sm:inline text-sm font-medium text-gray-900 dark:text-gray-100">
      {user?.name || "Guest User"}
    </span>
  </button>

  {/* Dropdown Content */}
  {dropdownOpen && (
    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden z-50 animate-fadeInUp">
      <div className="py-2">
        {/* Profile Section */}
        <Link
          to="/dashboard/student/profile"
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            My Profile
          </span>
        </Link>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Appearance
          </span>
          <button
            onClick={toggleTheme}
            className="relative w-14 h-7 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300"
            aria-label="Toggle theme"
          >
            <div
              className={`absolute w-6 h-6 bg-white dark:bg-gray-200 rounded-full shadow-sm transform transition-transform duration-300 ${
                theme === "dark" ? "translate-x-7" : "translate-x-1"
              }`}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-gray-700 m-1" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-500 m-1" />
              )}
            </div>
          </button>
        </div>

        {/* Logout Action */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            Sign Out
          </span>
        </button>
      </div>
    </div>
  )}
</div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Menu</h2>
          <X
            className="cursor-pointer text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <nav className="p-4">
          <Link to="/" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors">Home</Link>
          <Link to="/profile" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors">Profile</Link>
          <Link to="/settings" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors">Settings</Link>
        </nav>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Header;
