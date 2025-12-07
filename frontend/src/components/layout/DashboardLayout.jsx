import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import Header from "../Header"; // We will upgrade this next
import Sidebar from "./Sidebar"; // We will separate sidebar logic here

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-slate-100 font-sans selection:bg-primary-500 selection:text-white overflow-hidden flex">
      
      {/* Background Decor Elements (Blobs) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] animate-float delay-1000" />
      </div>

      {/* Glass Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-72 translate-x-0' : 'w-20 translate-x-0'} 
        hidden md:flex flex-col fixed h-[96vh] top-[2vh] left-4 z-50
        bg-surface-glass dark:bg-surface-glassDark backdrop-blur-xl border border-white/20 dark:border-slate-700/50 
        rounded-3xl shadow-glass transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]`}
      >
        <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 relative z-10 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
        ${isSidebarOpen ? 'md:ml-80' : 'md:ml-28'} h-screen overflow-y-auto overflow-x-hidden scrollbar-hide`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 px-6 py-4">
          <Header fullWidth={!isSidebarOpen} />
        </div>

        {/* Page Content with Transition */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-7xl mx-auto min-h-[85vh]"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;