import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, User, School, List, Lock, UserCheck2Icon, User2, GraduationCap, GraduationCapIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../components/Header";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import { MdEmail } from "react-icons/md";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = (props) => {
  const { id } = useParams();
  const {login, isLoggingIn } = useAuthStore();
  const [student, setStudent] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "student"
  });

  const validateForm = () => {
    if (!formData.role) return toast.error("Roll is required");
    if (!formData.username) return toast.error("username is required");
    if (!formData.password) return toast.error("Password is required");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      login(formData);
    }
  };
  useEffect(() => {
    const fetchUser = async (id) => {
      try {
       
      } catch (error) {
        console.error("Error fetching user:", error.response ? error.response.data : error.message);
      }
    };
    
    if (id) {
      fetchUser(id);
    }
  }, [id]); 
  
  

  return (
    <div className="min-h-screen grid bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Login Page</h1>
            <p className="text-base-content/60">Fill in the details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

          <SelectField label="Role" name="role" value={formData.role} icon={<GraduationCapIcon />} onChange={setFormData} options={["student", "teacher", "admin"]} />
            
            <InputField label="Username" name="username" value={formData.email} icon={<User2 />} onChange={setFormData} />
           
            <InputField label="Password" name="password" value={formData.password} icon={<Lock />} onChange={setFormData} />

            
            <button type="submit" className="btn bg-sky-700 w-full text-gray-50" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};



export default LoginPage;
