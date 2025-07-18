import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Lock,
  Phone,
  Image as ImageIcon,
  User2,
} from "lucide-react";
import toast from "react-hot-toast";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import { useAuthStore } from "../../store/useAuthStore";
import { useParams } from "react-router-dom";
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

  const [showPassword, setShowPassword] = useState(false);

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
        profileImage: null, // Reset image file (not available in plain teacher object)
      }));
    }
  }, [teacher]);

  const validateForm = () => {
    if (!formData.name) return toast.error("Name is required");
    if (!formData.userName) return toast.error("User Name is required");
    if (!formData.phoneNumber) return toast.error("Phone number is required");
    if (!teacherId && !formData.password) return toast.error("Password is required");
    if (!formData.role) return toast.error("Role is required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // const formToSend = new FormData();
    // formToSend.append("name", formData.name);
    // formToSend.append("userName", formData.userName);
    // formToSend.append("phoneNumber", formData.phoneNumber);
    // if (!teacherId) formToSend.append("password", formData.password);
    // formToSend.append("role", formData.role);
    // if (formData.profileImage) {
    //   formToSend.append("profileImage", formData.profileImage);
    // }

    if (teacherId) {
      await updateTeacher(teacherId, formData);
    } else {
      
      await signup(formData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header page={teacherId ? "Update Teacher" : "Sign Up"} />
      <div className="flex flex-col items-center justify-center p-5 sm:p-12 mt-16">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex flex-col items-center">
            <label htmlFor="profileImage" className="cursor-pointer">
              {formData.profileImage ? (
                <img
                  src={URL.createObjectURL(formData.profileImage)}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
                />
              ) : teacher?.profileImage ? (
                <img
                  src={teacher.profileImage}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors">
                  <ImageIcon className="w-10 h-10" />
                </div>
              )}
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setFormData({ ...formData, profileImage: e.target.files[0] })
                }
              />
            </label>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              icon={<User />}
              onChange={setFormData}
            />
            <InputField
              label="User Name"
              name="userName"
              value={formData.userName}
              icon={<User2 />}
              onChange={setFormData}
            />
            <InputField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              icon={<Phone />}
              onChange={setFormData}
            />
            <SelectField
              label="Role"
              name="role"
              value={formData.role}
              onChange={setFormData}
              options={["teacher", "admin"]}
            />
            {!teacherId && (
              <div className="relative">
                <InputField
                  label="Password"
                  name="password"
                  value={formData.password}
                  icon={<Lock />}
                  type={showPassword ? "text" : "password"}
                  onChange={setFormData}
                />
                <button
                  type="button"
                  className="absolute right-3 top-12 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            )}
            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {teacherId ? "Updating..." : "Signing up..."}
                  </>
                ) : teacherId ? (
                  "Update Teacher"
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
