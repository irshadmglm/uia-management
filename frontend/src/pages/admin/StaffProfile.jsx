import React, { useState } from 'react';
import {
  UserCircle,
  Phone,
  Mail,
  Building2,
  GraduationCap,
  BadgeInfo,
  BookUser,
  MessageCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Header from '../../components/Header';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const StudentProfile = () => {
  const {authUser} = useAuthStore()
    const [showChangePassword, setShowChangePassword] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center ">
        <Header />

      <div className="bg-white dark:bg-gray-900 sm:rounded-2xl shadow-2xl w-full max-w-3xl sm:h-auto">
        {/* Header */}
        <div className="bg-gradient-to-tr from-sky-400 to-sky-500 h-36 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
              <img
                className="rounded-full object-cover w-full h-full"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-15oVSs246BVTRobf0Ye3gECp5_E3-OKUGgAD4N8HZgj8xa-PElzug6S6tW0sdlT1cY&usqp=CAU"
                alt="Student Profile"
              />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-20 px-6 pb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{authUser.name}</h2>
          <p className="text-sky-500 dark:text-sky-400 mb-6">
              {authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1)}
            </p>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left text-gray-700 dark:text-gray-300">
            
            <InfoRow icon={<Phone size={20} />} label="Contact Number" value={authUser.phoneNumber} />
            <InfoRow icon={<Mail size={20} />} label="Email" value={authUser.email} />
            <InfoRow icon={<Building2 size={20} />} label="Address" value={authUser.address} />
            <InfoRow icon={<MessageCircle size={20} />} label="Whatsapp Number" value={authUser?.whatsupNumber} />
            <button
              onClick={() => setShowChangePassword(true)}
              className="text-sky-600 underline hover:text-sky-800"
            >
              Change Password
            </button>
            {showChangePassword && (
              <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
            )}

          </div>

          {/* <div className="mt-8">
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-full transition-all">
              Edit Profile
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

// Reusable InfoRow Component
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="mt-1 text-sky-500">{icon}</div>
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  </div>
);

export default StudentProfile;






