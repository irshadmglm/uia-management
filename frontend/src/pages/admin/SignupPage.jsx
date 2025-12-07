import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  User, Phone, Lock, Save, Loader2, Shield 
} from "lucide-react";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import { useAuthStore } from "../../store/useAuthStore";
import { useStaffStore } from "../../store/useStaffStore";

const SignupPage = () => {
  const { teacherId } = useParams();
  const { signup, isSigningUp } = useAuthStore();
  const { teacher, getTeacher, updateTeacher } = useStaffStore();

  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    phoneNumber: "",
    password: "",
    role: "",
    profileImage: null,
  });

  useEffect(() => {
    if (teacherId) {
      getTeacher(teacherId);
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacher) {
      setFormData((prev) => ({
        ...prev,
        name: teacher.name || "",
        userName: teacher.userName || "",
        phoneNumber: teacher.phoneNumber || "",
        role: teacher.role || "",
      }));
    }
  }, [teacher]);

  const validateForm = () => {
    if (!formData.name) return toast.error("Name is required");
    if (!formData.userName) return toast.error("Username is required");
    if (!formData.phoneNumber) return toast.error("Phone number is required");
    if (!teacherId && !formData.password) return toast.error("Password is required");
    if (!formData.role) return toast.error("Role is required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (teacherId) {
      await updateTeacher(teacherId, formData);
    } else {
      await signup(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark pb-20">
      <Header page={teacherId ? "Edit Staff" : "Add Staff"} />
      
      <div className="max-w-2xl mx-auto px-4 mt-16">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            {teacherId ? "Update Staff Profile" : "Register New Staff"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Create or modify access for teachers and administrators.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  icon={<User size={18} />}
                  onChange={(val) => handleInputChange("name", val)}
                />
              </div>
              
              <InputField
                label="Username"
                name="userName"
                value={formData.userName}
                icon={<User size={18} />}
                onChange={(val) => handleInputChange("userName", val)}
              />
              
              <InputField
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                icon={<Phone size={18} />}
                onChange={(val) => handleInputChange("phoneNumber", val)}
              />
              
              <SelectField
                label="Role Access"
                name="role"
                value={formData.role}
                onChange={(val) => handleInputChange("role", val)}
                options={["teacher", "admin"]}
              />

              {!teacherId && (
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(val) => handleInputChange("password", val)}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-primary-600 hover:from-indigo-700 hover:to-primary-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSigningUp ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {teacherId ? "Update Staff Details" : "Create Account"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;