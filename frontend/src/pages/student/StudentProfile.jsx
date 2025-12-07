import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Phone, Mail, MapPin, MessageCircle, 
  GraduationCap, BadgeInfo, Users, Shield, Key, 
  Camera, Edit3, Save 
} from "lucide-react";
import toast from "react-hot-toast";

const StudentProfile = () => {
  const { authUser, changePassword } = useAuthStore();
  const [activeTab, setActiveTab] = useState("personal");

  // Passwords State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (passwords.newPassword.length < 4) {
      return toast.error("Password must be at least 4 characters");
    }
    
    setIsSaving(true);
    try {
      await changePassword(passwords.currentPassword, passwords.newPassword);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark pb-20">
      
      {/* 1. Hero Cover Section */}
      <div className="relative h-60 md:h-80 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 overflow-hidden">
        {/* Abstract Background Patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl mix-blend-overlay"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50/90 dark:from-surface-dark/90 to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 z-10">
        
        {/* 2. Profile Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end gap-6 border border-slate-100 dark:border-slate-700">
          
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-white">
              <img
                src={authUser?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${authUser?.name}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Camera Icon Overlay (Visual only for now) */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer">
              <Camera className="text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 w-full md:w-auto">
            <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-1">
              {authUser?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full font-medium">
                <GraduationCap size={16} />
                {authUser?.role || "Student"}
              </span>
              <span className="flex items-center gap-1">
                <BadgeInfo size={16} />
                CIC: {authUser?.cicNumber || "N/A"}
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="flex items-center gap-1">
                <Users size={16} />
                {authUser?.batchName || "No Batch"}
              </span>
            </div>
          </div>

          {/* Edit Profile Button (Visual) */}
          <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <Edit3 size={18} />
            Edit Profile
          </button>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="mt-8 flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-1.5 rounded-2xl w-full md:w-fit border border-slate-200 dark:border-slate-700 overflow-x-auto">
          {["personal", "academic", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 capitalize flex items-center gap-2
                ${activeTab === tab ? "text-primary-600 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}
              `}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-slate-700 shadow-sm rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab === "personal" && <User size={18} />}
                {tab === "academic" && <GraduationCap size={18} />}
                {tab === "security" && <Shield size={18} />}
                {tab}
              </span>
            </button>
          ))}
        </div>

        {/* 4. Tab Content Area */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* --- PERSONAL TAB --- */}
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard title="Contact Information" icon={Phone}>
                    <InfoRow icon={Phone} label="Phone" value={authUser?.phoneNumber} />
                    <InfoRow icon={MessageCircle} label="WhatsApp" value={authUser?.whatsupNumber} isLink linkPrefix="https://wa.me/" />
                    <InfoRow icon={Mail} label="Email" value={authUser?.email} isLink linkPrefix="mailto:" />
                  </InfoCard>
                  
                  <InfoCard title="Address & Location" icon={MapPin}>
                    <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-primary-500">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Home Address</p>
                        <p className="text-base text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
                          {authUser?.address || "Address not provided"}
                        </p>
                      </div>
                    </div>
                  </InfoCard>
                </div>
              )}

              {/* --- ACADEMIC TAB --- */}
              {activeTab === "academic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard title="Class Details" icon={Users}>
                    <InfoRow icon={GraduationCap} label="Current Semester" value={authUser?.semester} />
                    <InfoRow icon={Users} label="Batch" value={authUser?.batchName} />
                    <InfoRow icon={BadgeInfo} label="Roll Number" value={authUser?.rollNumber || "N/A"} />
                  </InfoCard>

                  <InfoCard title="Mentors & Leaders" icon={BadgeInfo}>
                    <InfoRow icon={User} label="Class Mentor" value={authUser?.classTeacher} />
                    <InfoRow icon={User} label="Class Leader 1" value={authUser?.classLeader} />
                    <InfoRow icon={User} label="Class Leader 2" value={authUser?.classLeader2} />
                  </InfoCard>
                </div>
              )}

              {/* --- SECURITY TAB --- */}
              {activeTab === "security" && (
                <div className="max-w-2xl">
                  <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl text-rose-500">
                        <Key size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Change Password</h3>
                        <p className="text-sm text-slate-500">Ensure your account uses a long, random password.</p>
                      </div>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                        <input 
                          type="password" 
                          value={passwords.currentPassword}
                          onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                          <input 
                            type="password" 
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                          <input 
                            type="password" 
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div className="pt-4 flex justify-end">
                        <button 
                          type="submit" 
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 transition-all disabled:opacity-70"
                        >
                          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components for Clean Code ---

const InfoCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
      <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400">
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-slate-800 dark:text-white">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, isLink, linkPrefix }) => (
  <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors group">
    <div className="flex items-center gap-3">
      <div className="text-slate-400 group-hover:text-primary-500 transition-colors">
        <Icon size={18} />
      </div>
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
    </div>
    {isLink && value ? (
      <a 
        href={`${linkPrefix}${value}`} 
        target="_blank" 
        rel="noreferrer"
        className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
      >
        {value}
      </a>
    ) : (
      <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{value || "Not set"}</span>
    )}
  </div>
);

export default StudentProfile;