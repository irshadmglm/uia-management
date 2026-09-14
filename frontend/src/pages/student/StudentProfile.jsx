import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  Building2,
  GraduationCap,
  BadgeInfo,
  BookUser,
  MessageCircle,
  ShieldCheck,
  KeyRound,
  Sparkles,
  ExternalLink,
  Crown,
  Award
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const StudentProfile = () => {
  const { authUser } = useAuthStore();
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (!authUser) return null;

  const defaultAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-15oVSs246BVTRobf0Ye3gECp5_E3-OKUGgAD4N8HZgj8xa-PElzug6S6tW0sdlT1cY&usqp=CAU";
  const avatarUrl = authUser?.profileImage || authUser?.avatar || defaultAvatar;

  const formatWhatsappLink = (number) => {
    if (!number) return null;
    const cleanNum = String(number).replace(/[^0-9]/g, '');
    const fullNum = cleanNum.length === 10 ? `91${cleanNum}` : cleanNum;
    return `https://wa.me/${fullNum}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Hero Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-[#11322f] rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-[#0d2522] relative"
      >
        {/* Top Banner Gradient */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Sparkles size={14} className="text-amber-300" />
            <span>Student Portal</span>
          </div>
        </div>

        {/* Profile Content Container */}
        <div className="px-6 sm:px-10 pb-8 relative">
          {/* Avatar Positioned Overlap */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-20 sm:-mt-24 mb-6 gap-4">
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white dark:bg-[#11322f] p-1.5 shadow-2xl ring-4 ring-emerald-500/20">
                <img
                  className="rounded-2xl object-cover w-full h-full bg-gray-100 dark:bg-[#0d2522]"
                  src={avatarUrl}
                  alt={authUser?.name || "Student Profile"}
                />
              </div>
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full ring-4 ring-white dark:ring-[#11322f]" title="Active Account"></div>
            </div>

            {/* Change Password Quick Trigger */}
            <button
              onClick={() => setShowChangePassword(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <KeyRound size={16} />
              <span>Change Password</span>
            </button>
          </div>

          {/* User Primary Information */}
          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {authUser?.name}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              {authUser?.batchName && (
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <GraduationCap size={14} />
                  {authUser.batchName}
                </span>
              )}
              {authUser?.cicNumber && (
                <span className="px-3 py-1 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <BadgeInfo size={14} />
                  CIC: {authUser.cicNumber}
                </span>
              )}
              {authUser?.semester && (
                <span className="px-3 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 rounded-xl text-xs font-bold">
                  Sem: {authUser.semester}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-[#11322f] p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-[#0d2522] space-y-4"
        >
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800/80">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Academic Profile</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Class & Leadership assignments</p>
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            {authUser?.semester && (
              <InfoRow 
                icon={<GraduationCap size={18} />} 
                label="Current Semester" 
                value={authUser.semester} 
              />
            )}
            <InfoRow 
              icon={<BadgeInfo size={18} />} 
              label="CIC Register Number" 
              value={authUser?.cicNumber || "N/A"} 
            />
            {authUser?.classTeacher && (
              <InfoRow 
                icon={<BookUser size={18} />} 
                label="Class Teacher" 
                value={authUser.classTeacher} 
              />
            )}
            {authUser?.classLeader && (
              <InfoRow 
                icon={<Crown size={18} className="text-amber-500" />} 
                label="Class Leader" 
                value={authUser.classLeader} 
              />
            )}
            {authUser?.classLeader2 && (
              <InfoRow 
                icon={<Award size={18} className="text-amber-500" />} 
                label="Second Class Leader" 
                value={authUser.classLeader2} 
              />
            )}
          </div>
        </motion.div>

        {/* Contact Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white dark:bg-[#11322f] p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-[#0d2522] space-y-4"
        >
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800/80">
            <div className="p-2.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl">
              <Phone size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Contact & Address</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Personal communication details</p>
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            {authUser?.phoneNumber && (
              <InfoRow 
                icon={<Phone size={18} />} 
                label="Contact Number" 
                value={
                  <a href={`tel:${authUser.phoneNumber}`} className="hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                    <span>{authUser.phoneNumber}</span>
                    <ExternalLink size={12} className="opacity-60" />
                  </a>
                } 
              />
            )}
            {authUser?.whatsupNumber && (
              <InfoRow 
                icon={<MessageCircle size={18} className="text-emerald-500" />} 
                label="WhatsApp Number" 
                value={
                  <a 
                    href={formatWhatsappLink(authUser.whatsupNumber)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1.5"
                  >
                    <span>{authUser.whatsupNumber}</span>
                    <ExternalLink size={12} />
                  </a>
                } 
              />
            )}
            {authUser?.email && (
              <InfoRow 
                icon={<Mail size={18} />} 
                label="Email Address" 
                value={
                  <a href={`mailto:${authUser.email}`} className="hover:text-emerald-600 transition-colors flex items-center gap-1.5 break-all">
                    <span>{authUser.email}</span>
                  </a>
                } 
              />
            )}
            {authUser?.address && (
              <InfoRow 
                icon={<Building2 size={18} />} 
                label="Residential Address" 
                value={authUser.address} 
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Security Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-gradient-to-r from-[#0d2522] to-[#11322f] p-6 rounded-3xl shadow-lg border border-emerald-500/20 text-white flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Account Security</h3>
            <p className="text-xs text-gray-300">Keep your login credentials secure. Update password periodically.</p>
          </div>
        </div>

        <button
          onClick={() => setShowChangePassword(true)}
          className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-500/30 transition-all shrink-0 flex items-center justify-center gap-2"
        >
          <KeyRound size={16} />
          <span>Update Password</span>
        </button>
      </motion.div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
};

// Reusable InfoRow Component with Clean Hierarchy
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3.5 p-2.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#0d2522]/50 transition-colors">
    <div className="mt-0.5 p-2 rounded-xl bg-gray-100 dark:bg-[#0d2522] text-emerald-600 dark:text-emerald-400 shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400">{label}</p>
      <div className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5 leading-snug">{value}</div>
    </div>
  </div>
);

export default StudentProfile;







