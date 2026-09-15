import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Droplet,
  BookOpen,
  Award,
  FileText,
  Wallet,
  CheckCircle,
  Clock
} from "lucide-react";

import { useFeeStore } from "../store/feesSrore";
import { useMarksStore } from "../store/useMarksStore";
import { useAchievement } from "../store/achivemnetStore";
import { useBooksStore } from "../store/useBooksStore";

// --- Tab Components ---

const ProfileTab = ({ student }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 animate-fadeIn">
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Contact Info</h3>
      
      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
        <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
          <Phone size={18} />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
          <p className="font-medium">{student.phoneNumber}</p>
        </div>
      </div>

      {student.whatsupNumber && (
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
          <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
            <img src="https://cdn-icons-png.flaticon.com/128/5968/5968841.png" alt="WhatsApp" className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">WhatsApp</p>
            <a href={`https://wa.me/${student.whatsupNumber}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-brand-teal transition-colors">
              {student.whatsupNumber}
            </a>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
        <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
          <Mail size={18} />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
          <p className="font-medium truncate" title={student.email}>{student.email}</p>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Personal Info</h3>
      
      {student.parentName && (
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
          <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
            <User size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Parent Name</p>
            <p className="font-medium">{student.parentName}</p>
          </div>
        </div>
      )}

      {student.place && (
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
          <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Place / Location</p>
            <p className="font-medium">{student.place}</p>
          </div>
        </div>
      )}

      {student.dob && (
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
          <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
            <p className="font-medium">{new Date(student.dob).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {student.bloodGroup && (
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
          <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-red-500">
            <Droplet size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Blood Group</p>
            <p className="font-medium">{student.bloodGroup}</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

const FeesTab = ({ student }) => {
  const { fetchFeesByStd, monthNames } = useFeeStore();
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadFees = async () => {
      try {
        setLoading(true);
        const data = await fetchFeesByStd(student.batchName, student.cicNumber);
        if (isMounted) {
          setFeeData(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load fee data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (student?.batchName && student?.cicNumber) loadFees();
    return () => { isMounted = false; };
  }, [student, fetchFeesByStd]);

  if (loading) return <div className="p-10 text-center text-brand-teal"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div></div>;
  if (error) return <div className="p-10 text-center text-red-500 bg-red-50 dark:bg-red-900/10 m-6 rounded-2xl">{error}</div>;
  if (!feeData) return <div className="p-10 text-center text-gray-500">No fee record found.</div>;

  return (
    <div className="p-6 animate-fadeIn space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-[#0d2522] p-4 rounded-2xl border border-gray-100 dark:border-transparent">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Per Year</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">₹{feeData.subscription?.perYear || 0}</p>
        </div>
        <div className="bg-gray-50 dark:bg-[#0d2522] p-4 rounded-2xl border border-gray-100 dark:border-transparent">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Old Balance</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">₹{feeData.subscription?.oldBalance || 0}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Paid</p>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            ₹{((feeData.subscription?.perYear || 0) + (feeData.subscription?.oldBalance || 0)) - (feeData.subscription?.balance || 0)}
          </p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-800/30">
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Balance</p>
          <p className="text-lg font-bold text-rose-700 dark:text-rose-300">₹{feeData.subscription?.balance || 0}</p>
        </div>
      </div>

      {/* Monthly Payments */}
      <div className="bg-white dark:bg-[#11322f] rounded-2xl border border-gray-100 dark:border-[#0d2522] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-[#0d2522] bg-gray-50 dark:bg-[#0a1f1d]">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Monthly Payments</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 divide-x divide-y divide-gray-50 dark:divide-[#0d2522]">
          {Object.entries(feeData.payments || {}).map(([key, amount]) => (
            <div key={key} className="p-4 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{monthNames[key] || key}</span>
              <span className={`text-sm font-bold ${Number(amount) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-300 dark:text-gray-600'}`}>
                {Number(amount) > 0 ? `₹${amount}` : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MarksTab = ({ student }) => {
  const { getMarkList, markList, isLoading } = useMarksStore();

  useEffect(() => {
    if (student?._id) getMarkList(student._id);
  }, [student, getMarkList]);

  if (isLoading) return <div className="p-10 text-center text-brand-teal"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div></div>;
  if (!markList || markList.length === 0) return <div className="p-10 text-center text-gray-500">No mark lists found for this student.</div>;

  return (
    <div className="p-6 animate-fadeIn space-y-6">
      {markList.map((ml) => (
        <div key={ml._id} className="bg-white dark:bg-[#11322f] border border-gray-100 dark:border-[#0d2522] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-gray-100 dark:border-[#0d2522] bg-gray-50 dark:bg-[#0a1f1d] flex justify-between items-center">
            <h4 className="font-bold text-gray-800 dark:text-white">{ml.semesterId?.name || "Semester"}</h4>
            {ml.isApproved ? (
               <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full"><CheckCircle size={10}/> Approved</span>
            ) : (
               <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full"><Clock size={10}/> Pending</span>
            )}
          </div>
          <div className="p-0">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#f3f7f6]/50 dark:bg-[#0d2522]/50 text-gray-500 dark:text-gray-400 text-xs">
                  <tr>
                    <th className="p-3 pl-5 font-semibold">Subject</th>
                    <th className="p-3 font-semibold text-center w-24">Mark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#0d2522]">
                  {ml.marks?.map((m, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#11322f]/80">
                      <td className="p-3 pl-5 text-gray-700 dark:text-gray-300 font-medium">{m.subject?.name || m.subjectId?.name || "Unknown"}</td>
                      <td className="p-3 text-center font-bold text-brand-teal dark:text-brand-mint">{m.mark}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>
      ))}
    </div>
  );
};

const AchievementsTab = ({ student }) => {
  const { getStdAchievements, achievements, isLoading } = useAchievement();

  useEffect(() => {
    if (student?._id) getStdAchievements(student._id);
  }, [student, getStdAchievements]);

  if (isLoading) return <div className="p-10 text-center text-brand-teal"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div></div>;
  if (!achievements || achievements.length === 0) return <div className="p-10 text-center text-gray-500">No achievements found for this student.</div>;

  return (
    <div className="p-6 animate-fadeIn">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {achievements.map((a) => (
           <div key={a._id} className="bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] p-4 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="shrink-0 w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center">
                <Award size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{a.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{a.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-[#11322f] px-2 py-1 rounded-lg">
                    {new Date(a.date).toLocaleDateString()}
                  </span>
                  {a.isApproved ? (
                     <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><CheckCircle size={10}/> Approved</span>
                  ) : (
                     <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1"><Clock size={10}/> Pending</span>
                  )}
                </div>
              </div>
           </div>
         ))}
       </div>
    </div>
  );
};

const LibraryTab = ({ student }) => {
  const { getUserHistory, history } = useBooksStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      setLoading(true);
      await getUserHistory(student._id);
      if (isMounted) setLoading(false);
    };
    if (student?._id) loadHistory();
    return () => { isMounted = false; };
  }, [student, getUserHistory]);

  if (loading) return <div className="p-10 text-center text-brand-teal"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div></div>;
  if (!history || history.length === 0) return <div className="p-10 text-center text-gray-500">No library history found.</div>;

  return (
    <div className="p-6 animate-fadeIn">
      <div className="space-y-4">
        {history.map((record, index) => (
          <div key={index} className="bg-white dark:bg-[#0d2522] border border-gray-100 dark:border-[#11322f] p-4 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 shadow-sm">
             <div className="flex items-start gap-3">
               <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl">
                 <BookOpen size={20} />
               </div>
               <div>
                 <h4 className="font-bold text-gray-900 dark:text-white text-sm">{record.book?.title || "Unknown Book"}</h4>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Author: {record.book?.author || "N/A"} • Book No: {record.book?.bookNumber}</p>
                 <div className="mt-2 text-[11px] font-medium text-gray-500 flex items-center gap-3">
                   <span className="flex items-center gap-1"><Calendar size={12}/> Issued: {new Date(record.issueDate).toLocaleDateString()}</span>
                   {record.returnDate && (
                     <span className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500"/> Returned: {new Date(record.returnDate).toLocaleDateString()}</span>
                   )}
                 </div>
               </div>
             </div>
             <div className="shrink-0">
               {record.returnDate ? (
                 <span className="inline-flex px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100 dark:border-transparent">Returned</span>
               ) : (
                 <span className="inline-flex px-2.5 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-xs font-bold rounded-lg border border-orange-100 dark:border-transparent">Currently Borrowed</span>
               )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Modal Component ---

const StudentProfileModal = ({ student, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');

  // Reset tab when a new student is opened
  useEffect(() => {
    if (isOpen) setActiveTab('profile');
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'fees', label: 'Fees', icon: Wallet },
    { id: 'marks', label: 'Marks', icon: FileText },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'library', label: 'Library', icon: BookOpen },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#11322f] w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-scaleIn border border-gray-100 dark:border-[#0d2522] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header */}
        <div className="relative h-32 shrink-0 bg-gradient-to-r from-brand-teal to-sky-500">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md z-10"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Profile Info Header */}
        <div className="px-6 pb-4 relative shrink-0 border-b border-gray-100 dark:border-[#0d2522] bg-white dark:bg-[#11322f]">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end -mt-16 mb-4 gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#11322f] shadow-lg overflow-hidden bg-white z-10">
              <img 
                src={student.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-15oVSs246BVTRobf0Ye3gECp5_E3-OKUGgAD4N8HZgj8xa-PElzug6S6tW0sdlT1cY&usqp=CAU"} 
                alt={student.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left mt-2 sm:mt-16 sm:ml-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{student.name}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-mint/20 text-brand-teal dark:text-brand-mint rounded-lg text-xs font-bold border border-brand-mint/30">
                  CIC: {student.cicNumber}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-[#0d2522] text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-200 dark:border-transparent">
                  <Users size={12} /> {student.batchName}
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 mt-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-brand-teal text-white shadow-md' 
                      : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#0d2522]'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-transparent">
          {activeTab === 'profile' && <ProfileTab student={student} />}
          {activeTab === 'fees' && <FeesTab student={student} />}
          {activeTab === 'marks' && <MarksTab student={student} />}
          {activeTab === 'achievements' && <AchievementsTab student={student} />}
          {activeTab === 'library' && <LibraryTab student={student} />}
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
