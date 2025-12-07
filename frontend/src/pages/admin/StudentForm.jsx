import { useEffect, useState } from "react";
import { useStudentStore } from "../../store/studentStore";
import { Loader2, User, Layers, Hash, CheckCircle2 } from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import axios from "axios";

const StudentForm = (props) => {
  const { id } = useParams();
  const { registerStudent, isRegistering, editStudent } = useStudentStore();
  const [formData, setFormData] = useState({
    studentName: "",
    selectedBatch: "",
    rollNumber: "",
    gender: "",
    studentId: ""
  });

  // Fetch logic remains same
  useEffect(() => {
    const fetchUser = async (id) => {
      try {
        const hostname = window.location.hostname;
        const response = await axios.get(`http://${hostname}:5000/api/users/${id}`);
        setFormData({ ...response.data.user });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    if (id) fetchUser(id);
  }, [id]);

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
      
      if (props.edit) {
        editStudent(updatedFormData);
      } else {
        registerStudent(updatedFormData); 
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark pb-20">
      <Header page={props.edit ? "Edit Registration" : "Quick Register"} />
      
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {props.edit ? "Update Student" : "Quick Registration"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Basic student details entry.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <InputField 
                label="Student Name" 
                name="studentName" 
                value={formData.studentName} 
                icon={<User size={18} />} 
                onChange={(val) => handleInputChange("studentName", val)} 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <SelectField 
                  label="Batch" 
                  name="selectedBatch" 
                  value={formData.selectedBatch} 
                  options={[1,2,3,4,5,6,7,8,9,10]} 
                  icon={<Layers size={18} />} 
                  onChange={(val) => handleInputChange("selectedBatch", val)} 
                />
                <SelectField 
                  label="Roll No" 
                  name="rollNumber" 
                  value={formData.rollNumber} 
                  options={Array.from({length: 60}, (_, i) => i + 1)} 
                  icon={<Hash size={18} />} 
                  onChange={(val) => handleInputChange("rollNumber", val)} 
                />
              </div>
              
              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                <div className="flex gap-4">
                  {["Male", "Female"].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                        formData.gender === gender 
                          ? "bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300" 
                          : "border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                      onClick={() => setFormData({ ...formData, gender })}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full btn py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
                disabled={isRegistering}
              >
                {isRegistering ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                {props.edit ? "Update" : "Register"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentForm;