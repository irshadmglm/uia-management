"use client"

import { Menu, Sun, Moon, X, LogOut, User, Settings, Bell, Home, ChevronRight, ArrowLeft, ChevronLeft } from "lucide-react"
import { useThemeStore } from "../store/useThemeStore"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { useAuthStore } from "../store/useAuthStore"

const Header = ({ page, user }) => {
  const { theme, toggleTheme } = useThemeStore()
  const { logout, authUser } = useAuthStore()
  const navigate = useNavigate()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const sidebarRef = useRef(null)

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsSidebarOpen(false)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    // { name: "Profile", href: "/profile", icon: User },
    // { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <>
      {/* Minimal Header */}
      <header className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-40">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          {/* Left Side - Sidebar Toggle */}
          <div className="flex items-center">
          <button 
          onClick={handleBack}
          className="shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 gap-1 px-2 py-2 rounded-full transition-all duration-200"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          </div>

          {/* Right Side - App Logo */}
          <div className="flex items-center space-x-3">
          <div className="rounded-xl flex items-center justify-center shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 transition">
            <img
              src="/web-app-manifest-512x512.png"
              alt="UIA Logo"
              className="w-10 h-10 object-contain"
            />
          </div>

            <span className="hidden xs:block text-base sm:text-xl font-bold bg-gradient-to-r from-sky-500 to-sky-400 bg-clip-text text-transparent">
            UIA ACADEMICS
            </span>
          </div>
        </div>
      </header>

      {/* Enhanced Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white dark:bg-gray-900 shadow-2xl transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center space-x-3">
          <div className="rounded-xl flex items-center justify-center shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 transition">
            <img
              src="/web-app-manifest-512x512.png"
              alt="UIA Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
            <div>
              <h2 className="text-l font-bold text-gray-900 dark:text-white">UIA ACADEMICS</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Wafy cic</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="relative">
              <img
                src={
                  authUser?.avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-15oVSs246BVTRobf0Ye3gECp5_E3-OKUGgAD4N8HZgj8xa-PElzug6S6tW0sdlT1cY&usqp=CAU" ||
                  "/placeholder.svg"
                }
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover ring-3 ring-blue-500/20"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {authUser?.name || " "}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {authUser?.email || " "}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {authUser?.role || " "}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Notifications */}
            <button className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 group">
              <div className="relative">
                <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                {/* <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span> */}
              </div>
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Notifications</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 group"
            >
              {theme === "light" ? (
                <Moon className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
              ) : (
                <Sun className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
              )}
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-6 py-6 overflow-y-auto max-h-[calc(100vh-320px)] sm:max-h-[calc(100vh-280px)]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
            Navigation
          </h3>
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                  <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                    {item.name}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
              </Link>
            ))}

            {/* Profile Link */}
            {authUser && (
              <Link
                to={`/dashboard/${authUser.role}/profile`}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                  <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                    My Profile
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
              </Link>
            )}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 group"
    >
      <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      <span className="font-medium">Sign Out</span>
    </button>
  </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 z-40"
    onClick={() => setIsSidebarOpen(false)}
  ></div>
)}

    </>
  )
}

export default Header
