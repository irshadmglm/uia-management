import { useEffect, useState } from "react";
import { useStudentStore } from "../../store/studentStore";
import { Eye, EyeOff, Loader2, User, School, List } from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";

const StudentForm = (props) => {
  const { id } = useParams();
  console.log(id);
  
  const [student, setStudent] = useState([])
  const { registerStudent, isRegistering, editStudent } = useStudentStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    selectedBatch: "",
    rollNumber: "",
    gender: "",
    studentId: ""
  });

  const validateForm = () => {
    if (!formData.studentName.trim()) return toast.error("Student name is required");
    if (!formData.selectedBatch) return toast.error("Batch is required");
    if (!formData.rollNumber) return toast.error("Roll number is required");
    if (!formData.gender) return toast.error("Gender is required");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const classMap = {
        1: "A", 2: "B", 3: "C", 4: "D", 5: "E",
        6: "F", 7: "G", 8: "H", 9: "I", 10: "J"
      };
      const classPrefix = classMap[Number(formData.selectedBatch)] || "X";
      const genderPrefix = formData.gender === "Male" ? "B" : "G";
      const studentId = `${classPrefix}${genderPrefix}${formData.rollNumber}`;
  
      const updatedFormData = { ...formData, studentId };
      if(props.edit){
        editStudent(updatedFormData)
      }else{
      registerStudent(updatedFormData); 
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };
  useEffect(() => {
    const fetchUser = async (id) => {
      try {
        const response = await axios.get(`http://192.168.1.7:5000/api/users/${id}`);
        console.log(response.data.user);
        setFormData({ ...response.data.user });
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
            <h1 className="text-2xl font-bold">Student Registration</h1>
            <p className="text-base-content/60">Fill in the details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField label="Student Name" name="studentName" value={formData.studentName} icon={<User />} onChange={setFormData} />
            <SelectField label="Batch" name="selectedBatch" value={formData.selectedBatch} options={[1,2,3,4,5,6,7,8,9,10]} icon={<School />} onChange={setFormData} />
            <SelectField label="Roll Number" name="rollNumber" value={formData.rollNumber} options={[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]} icon={<List />} onChange={setFormData} />
            
            <div className="form-control">
              <label className="label font-medium text-gray-700 dark:text-gray-300">Gender</label>
              <div className="flex gap-4">
                {["Male", "Female"].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    className={`btn ${formData.gender === gender ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setFormData({ ...formData, gender })}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isRegistering}>
              {isRegistering ? <Loader2 className="size-5 animate-spin" /> : "Register"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};



export default StudentForm;
