import { useEffect, useState } from "react";
import { Loader2, User2, Lock, GraduationCapIcon, ArrowRight, ShieldCheck } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const { id } = useParams();
  const { login, isLoggingIn } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "student"
  });

  const validateForm = () => {
    if (!formData.role) return toast.error("Role is required");
    if (!formData.username) return toast.error("Username is required");
    if (!formData.password) return toast.error("Password is required");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      login(formData);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans">
      
      {/* Left Panel - Branding & Graphics */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-teal to-brand-teal-dark relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-mint opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full"></div>
        </div>

        {/* Logo Area */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl">
             <img src="/web-app-manifest-192x192.png" alt="UIA Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">UIA ACADEMICS</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Empowering the future of education.
          </h1>
          <p className="text-brand-teal-light text-lg">
            Access your courses, manage student records, and seamlessly connect with your academic community.
          </p>
        </div>

        {/* Footer Area */}
        <div className="relative z-10 flex items-center gap-2 text-white/70 text-sm">
          <ShieldCheck size={16} />
          <span>Secure Academic Portal</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile Logo (hidden on desktop) */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <img src="/web-app-manifest-192x192.png" alt="UIA Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">UIA ACADEMICS</span>
        </div>

        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-[#11322f] p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-[#0d2522]">
            
            <SelectField 
              label="Select Your Role" 
              name="role" 
              value={formData.role} 
              icon={<GraduationCapIcon />} 
              onChange={setFormData} 
              options={["student", "parent", "teacher", "admin"]} 
            />
            
            <InputField 
              label="Username or Email" 
              name="username" 
              value={formData.username} 
              icon={<User2 />} 
              onChange={setFormData} 
            />
           
            <InputField 
              label="Password" 
              name="password" 
              value={formData.password} 
              icon={<Lock />} 
              onChange={setFormData} 
            />

            <div className="flex items-center justify-end pt-2">
              <a href="#" className="text-sm font-medium text-brand-teal hover:text-brand-teal-dark">
                Forgot password?
              </a>
            </div>
            
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            Don't have an account? <span className="text-brand-teal font-medium cursor-not-allowed">Contact Administrator</span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
