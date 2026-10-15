import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Users,
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Calendar,
  Droplet,
  BookOpen,
  Award,
  FileText,
  Wallet,
  CheckCircle,
  Clock,
  Lock,
  Shield,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Printer,
  TrendingUp,
  BarChart3,
  GraduationCap,
  Eye,
  FileSpreadsheet,
  Layers
} from "lucide-react";

import { useFeeStore } from "../store/feesSrore";
import { useMarksStore } from "../store/useMarksStore";
import { useAchievement } from "../store/achivemnetStore";
import { useBooksStore } from "../store/useBooksStore";
import { useStudentStore } from "../store/studentStore";
import { useAuthStore } from "../store/useAuthStore";
import { useAdminStore } from "../store/useAdminMngStore";
import toast from "react-hot-toast";

// --- Tab Components ---

const ProfileTab = ({ student }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  const [newParentPassword, setNewParentPassword] = useState("");
  const [confirmParentPassword, setConfirmParentPassword] = useState("");
  const [isChangingParent, setIsChangingParent] = useState(false);
  const [credentialTab, setCredentialTab] = useState("parent");

  const { editStudent } = useStudentStore();
  const { authUser } = useAuthStore();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    setIsChanging(true);
    await editStudent({ password: newPassword }, student._id);
    setIsChanging(false);
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Student password updated successfully!");
  };

  const handleParentPasswordChange = async (e) => {
    e.preventDefault();
    if (newParentPassword !== confirmParentPassword) {
      toast.error("Parent passwords do not match");
      return;
    }
    if (newParentPassword.length < 4) {
      toast.error("Parent password must be at least 4 characters");
      return;
    }
    setIsChangingParent(true);
    await editStudent({ parentPassword: newParentPassword }, student._id);
    setIsChangingParent(false);
    setNewParentPassword("");
    setConfirmParentPassword("");
    toast.success("Parent password updated successfully!");
  };

  const formattedDob = student.dateOfBirth || student.dob
    ? new Date(student.dateOfBirth || student.dob).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const formattedEnrolled = student.createdAt
    ? new Date(student.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const address = student.address || student.place;

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Primary Highlight: Parent Contact & Portal Login Credentials */}
      <div className={`p-4 rounded-2xl border transition-all ${
        student.parentNumber 
          ? "bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-200 dark:border-amber-800/60" 
          : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40"
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              student.parentNumber 
                ? "bg-amber-500 text-white shadow-sm" 
                : "bg-red-500 text-white"
            }`}>
              <PhoneCall size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Parent / Guardian Contact
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                  Parent Portal ID
                </span>
              </div>
              {student.parentNumber ? (
                <div className="flex items-baseline gap-2 mt-0.5">
                  <a 
                    href={`tel:${student.parentNumber}`}
                    className="text-lg font-bold text-gray-900 dark:text-white hover:text-brand-teal transition-colors tracking-wide"
                  >
                    {student.parentNumber}
                  </a>
                  {student.parentName && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({student.parentName})
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm font-semibold text-red-600 dark:text-red-400 mt-0.5">
                  No Parent Phone Number registered! Parent login is currently disabled for this student.
                </p>
              )}
            </div>
          </div>

          {student.parentNumber && (
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <a
                href={`tel:${student.parentNumber}`}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Phone size={13} /> Call Parent
              </a>
              <a
                href={`https://wa.me/${String(student.parentNumber).replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <img src="https://cdn-icons-png.flaticon.com/128/5968/5968841.png" alt="WA" className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-800/40 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300/90">
          <ShieldCheck size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Parent Login Access:</strong> The parent can sign in at the Parent Portal using username <code>{student.parentNumber || "[Parent Number]"}</code> and the student's password.
          </span>
        </div>
      </div>

      {/* Main Grid: Student Contact & Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info Column */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Phone size={14} /> Student Contact Info
          </h3>
          
          {/* Student Phone */}
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
            <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
              <Phone size={18} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Student Phone Number</p>
              {student.phoneNumber ? (
                <a href={`tel:${student.phoneNumber}`} className="font-semibold text-gray-900 dark:text-white hover:text-brand-teal transition-colors">
                  {student.phoneNumber}
                </a>
              ) : (
                <p className="text-sm font-medium text-gray-400 italic">Not provided</p>
              )}
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
            <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
              <img src="https://cdn-icons-png.flaticon.com/128/5968/5968841.png" alt="WhatsApp" className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">WhatsApp</p>
              {student.whatsupNumber ? (
                <a 
                  href={`https://wa.me/${String(student.whatsupNumber).replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-semibold text-gray-900 dark:text-white hover:text-brand-teal transition-colors flex items-center gap-1.5"
                >
                  {student.whatsupNumber}
                  <ExternalLink size={12} className="text-gray-400" />
                </a>
              ) : (
                <p className="text-sm font-medium text-gray-400 italic">Not provided</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
            <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
              <Mail size={18} />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
              {student.email ? (
                <a 
                  href={`mailto:${student.email}`}
                  className="font-semibold text-gray-900 dark:text-white truncate block hover:text-brand-teal transition-colors" 
                  title={student.email}
                >
                  {student.email}
                </a>
              ) : (
                <p className="text-sm font-medium text-gray-400 italic">Not provided</p>
              )}
            </div>
          </div>

          {/* Parent Name / Guardian */}
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
            <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal">
              <User size={18} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Parent / Guardian Name</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {student.parentName || "Guardian (Contact: " + (student.parentNumber || "N/A") + ")"}
              </p>
            </div>
          </div>
        </div>

        {/* Personal & Academic Details Column */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <User size={14} /> Personal & Academic Info
          </h3>
          
          {/* Residential Address */}
          <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
            <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal shrink-0 mt-0.5">
              <MapPin size={18} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Residential Address / Place</p>
              <p className="font-semibold text-gray-900 dark:text-white leading-snug">
                {address || "Address not registered"}
              </p>
            </div>
          </div>

          {/* Date of Birth & Gender Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
              <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal shrink-0">
                <Calendar size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Date of Birth</p>
                <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                  {formattedDob || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
              <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal shrink-0">
                <User size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Gender</p>
                <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                  {student.gender || "Male"}
                </p>
              </div>
            </div>
          </div>

          {/* Enrollment Date & Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
              <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal shrink-0">
                <Clock size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Enrolled On</p>
                <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                  {formattedEnrolled || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
              <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-brand-teal shrink-0">
                <CheckCircle size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Account Status</p>
                <p className="font-semibold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 truncate">
                  {student.isActive !== false ? "Active" : "Archived"}
                </p>
              </div>
            </div>
          </div>

          {/* Blood Group (if available) */}
          {student.bloodGroup && (
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0d2522] p-3 rounded-xl border border-gray-100 dark:border-transparent">
              <div className="p-2 bg-white dark:bg-[#11322f] rounded-lg shadow-sm text-red-500">
                <Droplet size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Blood Group</p>
                <p className="font-semibold text-gray-900 dark:text-white">{student.bloodGroup}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Security / Credentials Section */}
      {authUser?.role === "admin" && (
        <div className="space-y-4 pt-5 border-t border-gray-100 dark:border-[#0d2522]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Lock size={15} /> Security & Portal Credentials
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Manage separate login passwords for Parent and Student portals
              </p>
            </div>

            {/* Credential Tab Selector */}
            <div className="inline-flex p-1 bg-gray-100 dark:bg-[#0d2522] rounded-xl self-start sm:self-auto border border-gray-200/50 dark:border-transparent">
              <button
                type="button"
                onClick={() => setCredentialTab("parent")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  credentialTab === "parent"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <PhoneCall size={13} /> Parent Password
              </button>
              <button
                type="button"
                onClick={() => setCredentialTab("student")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  credentialTab === "student"
                    ? "bg-brand-teal text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <User size={13} /> Student Password
              </button>
            </div>
          </div>

          {credentialTab === "parent" ? (
            /* Parent Password Form */
            <div className="bg-amber-500/5 dark:bg-amber-500/10 p-5 rounded-2xl border border-amber-200/70 dark:border-amber-900/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-800 dark:text-amber-300">
                    Parent Login Account:
                  </span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                    {student.parentNumber || "No Phone Registered"}
                  </span>
                </div>
                <span className="text-amber-700 dark:text-amber-400 text-[11px]">
                  {student.parentPassword ? "✓ Independent Parent Password Active" : "ℹ Currently using default/student password"}
                </span>
              </div>

              <form onSubmit={handleParentPasswordChange} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    New Parent Password
                  </label>
                  <input
                    type="password"
                    value={newParentPassword}
                    onChange={(e) => setNewParentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#11322f] border border-amber-200 dark:border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                    placeholder="Enter new parent password"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Confirm Parent Password
                  </label>
                  <input
                    type="password"
                    value={confirmParentPassword}
                    onChange={(e) => setConfirmParentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#11322f] border border-amber-200 dark:border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                    placeholder="Confirm parent password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isChangingParent || !newParentPassword || !confirmParentPassword}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                >
                  {isChangingParent ? "Updating..." : "Update Parent Password"}
                </button>
              </form>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                This updates only the password used by parents when signing in with their phone number ({student.parentNumber || "N/A"}). The student's CIC login password is not affected.
              </p>
            </div>
          ) : (
            /* Student Password Form */
            <div className="bg-gray-50 dark:bg-[#0d2522] p-5 rounded-2xl border border-gray-100 dark:border-transparent space-y-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-gray-600 dark:text-gray-400">
                  Student Login Account:
                </span>
                <span className="font-mono font-bold text-gray-900 dark:text-white bg-gray-200/70 dark:bg-[#11322f] px-2 py-0.5 rounded-md">
                  CIC: {student.cicNumber}
                </span>
              </div>

              <form onSubmit={handlePasswordChange} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    New Student Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#11322f] border border-gray-200 dark:border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-900 dark:text-white"
                    placeholder="Enter new student password"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Confirm Student Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#11322f] border border-gray-200 dark:border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal text-gray-900 dark:text-white"
                    placeholder="Confirm student password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isChanging || !newPassword || !confirmPassword}
                  className="w-full sm:w-auto px-5 py-2.5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                >
                  {isChanging ? "Updating..." : "Update Student Password"}
                </button>
              </form>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                This updates only the password used by the student when logging in with their CIC Number ({student.cicNumber}).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [expandedSemesters, setExpandedSemesters] = useState({});

  useEffect(() => {
    if (student?._id) getMarkList(student._id);
  }, [student, getMarkList]);

  // Expand all by default once markList loads
  useEffect(() => {
    if (Array.isArray(markList) && markList.length > 0) {
      const initial = {};
      markList.forEach((ml) => {
        initial[ml._id] = true;
      });
      setExpandedSemesters(initial);
    }
  }, [markList]);

  const toggleExpand = (id) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isArabic = (text) => /[\u0600-\u06FF]/.test(text || "");

  const getSubjectName = (m) => {
    if (!m) return "Unknown";
    if (typeof m.subject === "string" && m.subject.trim()) return m.subject.trim();
    if (m.subject && typeof m.subject.name === "string") return m.subject.name.trim();
    if (m.subjectId && typeof m.subjectId.name === "string") return m.subjectId.name.trim();
    return "Subject";
  };

  const getGradeInfo = (percentage) => {
    if (percentage >= 85) return { grade: "Distinction", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" };
    if (percentage >= 70) return { grade: "First Class", color: "text-sky-600 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-400 border-sky-200 dark:border-sky-800" };
    if (percentage >= 50) return { grade: "Second Class", color: "text-brand-teal bg-teal-50 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800" };
    if (percentage >= 40) return { grade: "Pass", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800" };
    return { grade: "Needs Improvement", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800" };
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-brand-teal flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-brand-teal"></div>
        <p className="text-sm font-medium text-gray-500">Loading student academic marks...</p>
      </div>
    );
  }

  if (!markList || markList.length === 0) {
    return (
      <div className="p-16 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-[#0d2522] flex items-center justify-center text-gray-400">
          <FileText size={28} />
        </div>
        <h4 className="font-bold text-gray-700 dark:text-gray-300">No Mark Lists Recorded</h4>
        <p className="text-xs text-gray-400 max-w-sm">No semester examination marks have been entered or approved for this student yet.</p>
      </div>
    );
  }

  // Calculate Cumulative Academic Overview
  let cumulativeObtained = 0;
  let cumulativeTotal = 0;
  let approvedCount = 0;

  const processedMarkLists = markList.map((ml) => {
    const rawSubjects = ml.subjects || ml.marks || [];
    const subjects = rawSubjects.filter((s) => s && (s.subject || s.subjectId || s.mark > 0));

    const totalObtained = subjects.reduce((acc, curr) => acc + (Number(curr.mark) || 0), 0);
    const maxTotal = subjects.reduce((acc, curr) => acc + (Number(curr.total) > 0 ? Number(curr.total) : 100), 0);
    const percentage = maxTotal > 0 ? Number(((totalObtained / maxTotal) * 100).toFixed(1)) : 0;
    const grade = getGradeInfo(percentage);

    cumulativeObtained += totalObtained;
    cumulativeTotal += maxTotal;
    if (ml.isApproved) approvedCount++;

    const semName = ml.semesterId?.name || ml.semesterName || (typeof ml.semesterId === "string" ? ml.semesterId : "Semester");

    return {
      ...ml,
      semName,
      subjects,
      totalObtained,
      maxTotal,
      percentage,
      grade,
    };
  });

  const cumulativePercentage = cumulativeTotal > 0 ? ((cumulativeObtained / cumulativeTotal) * 100).toFixed(1) : 0;
  const overallGrade = getGradeInfo(Number(cumulativePercentage));

  return (
    <div className="p-6 animate-fadeIn space-y-6">
      {/* Top Academic Overview Banner */}
      <div className="bg-gradient-to-r from-teal-500/10 via-brand-teal/5 to-transparent border border-teal-200/70 dark:border-teal-900/40 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-teal text-white rounded-xl shadow-sm">
              <GraduationCap size={22} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Academic Performance Summary</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Overall performance across {processedMarkLists.length} recorded semester{processedMarkLists.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Cumulative Total</p>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                {cumulativeObtained} <span className="text-xs font-normal text-gray-400">/ {cumulativeTotal}</span>
              </p>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Overall Aggregate</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-brand-teal dark:text-brand-mint">{cumulativePercentage}%</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${overallGrade.color}`}>
                  {overallGrade.grade}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stat chips */}
        <div className="mt-3 pt-3 border-t border-teal-200/50 dark:border-teal-900/30 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-[#11322f] rounded-lg font-medium text-gray-600 dark:text-gray-300 shadow-xs border border-gray-100 dark:border-transparent">
            <Layers size={13} className="text-brand-teal" /> {processedMarkLists.length} Semester Records
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-[#11322f] rounded-lg font-medium text-emerald-600 dark:text-emerald-400 shadow-xs border border-gray-100 dark:border-transparent">
            <CheckCircle size={13} /> {approvedCount} Approved
          </span>
          {processedMarkLists.length - approvedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-[#11322f] rounded-lg font-medium text-amber-600 dark:text-amber-400 shadow-xs border border-gray-100 dark:border-transparent">
              <Clock size={13} /> {processedMarkLists.length - approvedCount} Pending Approval
            </span>
          )}
        </div>
      </div>

      {/* List of Semester Mark Cards */}
      <div className="space-y-5">
        {processedMarkLists.map((ml) => {
          const isExpanded = expandedSemesters[ml._id] !== false;

          return (
            <div
              key={ml._id}
              className="bg-white dark:bg-[#11322f] border border-gray-100 dark:border-[#0d2522] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              {/* Card Header */}
              <div className="px-5 py-3.5 bg-gray-50/80 dark:bg-[#0a1f1d] border-b border-gray-100 dark:border-[#0d2522] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-teal/10 dark:bg-brand-mint/10 text-brand-teal dark:text-brand-mint rounded-xl">
                    <FileSpreadsheet size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 dark:text-white text-base">
                        Semester: {ml.semName}
                      </h4>
                      {ml.isApproved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle size={11} /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          <Clock size={11} /> Pending Approval
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Batch: {ml.batchId?.name || student.batchName} • {ml.subjects.length} Subjects
                    </p>
                  </div>
                </div>

                {/* KPI Pill & Actions */}
                <div className="flex items-center gap-2.5 ml-auto">
                  <div className="bg-white dark:bg-[#11322f] px-3 py-1.5 rounded-xl border border-gray-200 dark:border-transparent text-right shadow-2xs">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {ml.totalObtained} / {ml.maxTotal}
                    </span>
                    <span className="text-xs text-gray-400 mx-1">•</span>
                    <span className="text-xs font-bold text-brand-teal dark:text-brand-mint">
                      {ml.percentage}%
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedSemester(ml)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#0d2522] dark:hover:bg-[#143a37] text-gray-700 dark:text-gray-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                    title="View Full Detailed Mark Sheet"
                  >
                    <Eye size={15} />
                    <span className="hidden sm:inline">Details</span>
                  </button>

                  <button
                    onClick={() => toggleExpand(ml._id)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#0d2522] dark:hover:bg-[#143a37] text-gray-700 dark:text-gray-300 transition-all"
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Collapsible Subject Table */}
              {isExpanded && (
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#f3f7f6]/60 dark:bg-[#0d2522]/60 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-100 dark:border-[#0d2522]">
                      <tr>
                        <th className="py-2.5 px-4 w-12 text-center">#</th>
                        <th className="py-2.5 px-4">Subject</th>
                        <th className="py-2.5 px-4 text-center w-28">Marks</th>
                        <th className="py-2.5 px-4 text-center w-24">Max Marks</th>
                        <th className="py-2.5 px-4 w-44">Performance</th>
                        <th className="py-2.5 px-4 text-center w-28">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-[#0d2522]">
                      {ml.subjects.map((m, idx) => {
                        const subjectName = getSubjectName(m);
                        const markVal = Number(m.mark) || 0;
                        const maxVal = Number(m.total) > 0 ? Number(m.total) : 100;
                        const subjPercent = Math.min(100, Math.round((markVal / maxVal) * 100));
                        const isPass = subjPercent >= 40;
                        const arabic = isArabic(subjectName);

                        return (
                          <tr
                            key={idx}
                            className="hover:bg-gray-50/70 dark:hover:bg-[#11322f]/80 transition-colors"
                          >
                            <td className="py-2.5 px-4 text-xs text-gray-400 font-mono text-center">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-4 font-medium text-gray-900 dark:text-white">
                              <span
                                dir={arabic ? "rtl" : "ltr"}
                                className={`inline-block ${arabic ? "text-base font-semibold" : ""}`}
                              >
                                {subjectName}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-center font-bold text-gray-900 dark:text-white">
                              <span className={isPass ? "text-brand-teal dark:text-brand-mint" : "text-rose-500"}>
                                {markVal}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-center text-xs text-gray-500 dark:text-gray-400">
                              {maxVal}
                            </td>
                            <td className="py-2.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-100 dark:bg-[#0a1f1d] rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      subjPercent >= 80
                                        ? "bg-emerald-500"
                                        : subjPercent >= 60
                                        ? "bg-sky-500"
                                        : subjPercent >= 40
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                    }`}
                                    style={{ width: `${subjPercent}%` }}
                                  ></div>
                                </div>
                                <span className="text-[11px] font-mono text-gray-400 w-8 text-right">
                                  {subjPercent}%
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  isPass
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                                }`}
                              >
                                {isPass ? "Passed" : "Failed"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50/70 dark:bg-[#0a1f1d]/70 font-semibold text-gray-800 dark:text-gray-200 border-t border-gray-100 dark:border-[#0d2522]">
                      <tr>
                        <td colSpan="2" className="py-3 px-4 text-right text-xs uppercase tracking-wider text-gray-500">
                          Semester Total:
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-brand-teal dark:text-brand-mint">
                          {ml.totalObtained}
                        </td>
                        <td className="py-3 px-4 text-center text-xs text-gray-500">
                          {ml.maxTotal}
                        </td>
                        <td colSpan="2" className="py-3 px-4">
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            Aggregate: {ml.percentage}% • {ml.grade.grade}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Printable Mark Sheet Modal */}
      {selectedSemester && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedSemester(null)}
        >
          <div
            className="bg-white dark:bg-[#11322f] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 dark:border-[#0d2522] overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-[#0d2522] flex items-center justify-between bg-gray-50 dark:bg-[#0a1f1d]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-teal text-white rounded-xl">
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    Semester Mark Sheet - {selectedSemester.semName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Official Grade Card & Subject-wise Marks
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Printer size={14} /> Print
                </button>
                <button
                  onClick={() => setSelectedSemester(null)}
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#143a37] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Student & Semester Info Banner */}
            <div className="p-5 border-b border-gray-100 dark:border-[#0d2522] bg-teal-50/40 dark:bg-[#0d2522]/40">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-gray-400 font-medium">Student Name</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{student.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">CIC Number</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{student.cicNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Batch</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{student.batchName}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Approval Status</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {selectedSemester.isApproved ? "Approved" : "Pending"}
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Breakdown in Modal */}
            <div className="p-0 overflow-y-auto flex-1">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#f3f7f6]/80 dark:bg-[#0d2522]/80 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-100 dark:border-[#0d2522]">
                  <tr>
                    <th className="py-2.5 px-4 w-12 text-center">#</th>
                    <th className="py-2.5 px-4">Subject</th>
                    <th className="py-2.5 px-4 text-center w-24">Marks Obtained</th>
                    <th className="py-2.5 px-4 text-center w-24">Maximum</th>
                    <th className="py-2.5 px-4 text-center w-28">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#0d2522]">
                  {selectedSemester.subjects.map((m, idx) => {
                    const subjectName = getSubjectName(m);
                    const markVal = Number(m.mark) || 0;
                    const maxVal = Number(m.total) > 0 ? Number(m.total) : 100;
                    const isPass = (markVal / maxVal) >= 0.4;
                    const arabic = isArabic(subjectName);

                    return (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#11322f]/80">
                        <td className="py-2.5 px-4 text-xs text-gray-400 font-mono text-center">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-medium text-gray-900 dark:text-white">
                          <span dir={arabic ? "rtl" : "ltr"} className={`inline-block ${arabic ? "text-base font-semibold" : ""}`}>
                            {subjectName}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center font-bold text-brand-teal dark:text-brand-mint">
                          {markVal}
                        </td>
                        <td className="py-2.5 px-4 text-center text-xs text-gray-500 dark:text-gray-400">
                          {maxVal}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${
                              isPass
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                            }`}
                          >
                            {isPass ? "Passed" : "Failed"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer Summary */}
            <div className="p-4 bg-gray-50 dark:bg-[#0a1f1d] border-t border-gray-100 dark:border-[#0d2522] flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">
                Grand Total: <strong className="text-gray-900 dark:text-white">{selectedSemester.totalObtained} / {selectedSemester.maxTotal}</strong>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-brand-teal font-extrabold text-base">{selectedSemester.percentage}%</span>
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${selectedSemester.grade.color}`}>
                  {selectedSemester.grade.grade}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
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

  const { batches } = useAdminStore();
  const isAlumni = batches.some(b => (String(b._id) === String(student.batchId) || b.name === student.batchName) && b.isActive === false);

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
        <div className={`relative h-32 shrink-0 ${isAlumni ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500' : 'bg-gradient-to-r from-brand-teal to-sky-500'}`}>
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
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  student.isActive !== false 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${student.isActive !== false ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  {student.isActive !== false ? 'Active' : 'Inactive'}
                </span>
                {isAlumni && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
                    <GraduationCap size={12} /> Alumni
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-mint/20 text-brand-teal dark:text-brand-mint rounded-lg text-xs font-bold border border-brand-mint/30">
                  CIC: {student.cicNumber}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-[#0d2522] text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-200 dark:border-transparent">
                  <Users size={12} /> {student.batchName}
                </span>
                {student.parentNumber && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium border border-amber-200 dark:border-amber-800">
                    <Phone size={11} /> Parent: {student.parentNumber}
                  </span>
                )}
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
