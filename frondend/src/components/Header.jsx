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
          <ArrowLeft
            onClick={() => canGoBack && navigate(-1)}
            className={`cursor-pointer text-3xl transition-colors duration-200 ${
              canGoBack ? "hover:text-blue-500" : "text-gray-400 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Page Title */}
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{page}</h1>

        {/* Right Side: Theme Toggle & Profile Dropdown */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="relative">
            <div
              className="flex items-center cursor-pointer gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYzrKwzB9qf6z1LUGt9CMjPzC5zBy87WL6Fw&s"
                alt="Profile"
                className="w-8 h-8 rounded-full border"
              />
              <span className="hidden sm:inline font-medium text-gray-800 dark:text-white">
                {user?.name || "User"}
              </span>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-20 animate-fadeIn">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <User size={16} /> Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Settings size={16} /> Settings
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 p-3 text-left hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-400 transition"
                >
                  <LogOut size={16} /> Logout
                </button>
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
