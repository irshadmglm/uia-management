import React from 'react';
import {
  UserCircle,
  Phone,
  Mail,
  Building2,
  GraduationCap,
  BadgeInfo,
  BookUser,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const StudentProfile = () => {
  const {authUser} = useAuthStore()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center ">
      <div className="bg-white dark:bg-gray-900 sm:rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden h-screen sm:h-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-tr from-sky-400 to-indigo-500 h-36 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
              <img
                className="rounded-full object-cover w-full h-full"
                src="https://png.pngtree.com/png-vector/20250221/ourmid/pngtree-cheerful-child-in-islamic-dress-with-a-warm-expression-png-image_15543168.png"
                alt="Student Profile"
              />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-20 px-6 pb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{authUser.name}</h2>
          <p className="text-sky-500 dark:text-sky-400 mb-6">Student of {authUser.batchName}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left text-gray-700 dark:text-gray-300">
            {authUser?.semester && <InfoRow icon={<GraduationCap size={20} />} label="Current Semester" value={authUser?.semester} />}
            <InfoRow icon={<BadgeInfo size={20} />} label="CIC Number" value={authUser.cicNumber} />
            {authUser?.classTeacher && <InfoRow icon={<BookUser size={20} />} label="Class Teacher" value={authUser.classTeacher} />}
            <InfoRow icon={<Phone size={20} />} label="Contact Number" value={authUser.phoneNumber} />
            <InfoRow icon={<Mail size={20} />} label="Email" value={authUser.email} />
            <InfoRow icon={<Building2 size={20} />} label="Address" value={authUser.address} />
          </div>

          <div className="mt-8">
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full transition-all">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable InfoRow Component
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="mt-1 text-indigo-500">{icon}</div>
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  </div>
);

export default StudentProfile;
