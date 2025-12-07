import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { User, Lock, GraduationCap, School, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  
  // State
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return toast.error("Please fill in all fields");
    }
    login({ ...formData, role });
  };

  return (
    // FIXED: Added 'relative w-full' and 'overflow-hidden' to prevent horizontal scroll
    <div className="min-h-screen w-full relative flex items-center justify-center bg-slate-50 dark:bg-surface-dark overflow-hidden p-4">
      
      {/* Background Blobs - Positioned relative to the viewport container */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary-500/20 rounded-full blur-[80px] md:blur-[120px] animate-float pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-500/20 rounded-full blur-[80px] md:blur-[120px] animate-float pointer-events-none" />

      {/* Main Card Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white/70 dark:bg-surface-glassDark backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700/50 min-h-[500px] md:min-h-[600px] relative z-10">
        
        {/* Left Side: Visuals (Hidden on mobile) */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-600 to-indigo-700 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-4 leading-tight">
              Welcome to <br/> UIA Academics
            </h1>
            <p className="text-primary-100 text-lg max-w-sm">
              Manage your academic journey with precision. Track results, attendance, and achievements in one place.
            </p>
          </div>

          {/* Abstract geometric shapes */}
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 pointer-events-none">
            <School size={400} />
          </div>
          
          <div className="relative z-10 text-sm text-primary-200">
            © 2025 Wafy CIC. All rights reserved.
          </div>
        </div>

        {/* Right Side: Form */}
        {/* FIXED: Reduced padding on mobile (p-6) to prevent squishing */}
        <div className="p-6 sm:p-12 flex flex-col justify-center w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-2">Sign In</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm sm:text-base">Enter your credentials to access the portal.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Role Selection */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {['student', 'teacher', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-1 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 capitalize truncate
                      ${role === r 
                        ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Username / CIC No</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder={role === 'student' ? "Enter CIC Number" : "Enter Username"}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 dark:text-white text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 dark:text-white text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
              </button>

            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;