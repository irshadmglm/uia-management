import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Phone, Loader2, User, School, Lock, Image as ImageIcon, Calendar1Icon, PhoneCall, FolderOpenIcon, } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import "cally";
import { useRegisterdStudentStore } from "../../store/useRegisterdStudentStore";
import { useAdminStore } from "../../store/useAdminMngStore";
import { useStudentStore } from "../../store/studentStore";

const AdmissionForm = () => {
  const { studentId } = useParams();
  const {newAdmission, isLoading} = useRegisterdStudentStore()
  const {batches, getBatches} = useAdminStore();
  const {student, getStudent, editStudent } = useStudentStore()
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cicNumber: "",
    phoneNumber: "",
    whatsupNumber:"",
    email: "",
    address: "",
    password: "",
    batchName: "",
    dateOfBirth: "",
    parentNumber:"",
    profileImage: null,
  });
  useEffect(() => {
  getBatches()
  }, [])

  useEffect(() => {
    if(studentId){
      getStudent(studentId)
    }
  }, [studentId])
  useEffect(() => {
    if (student) {
      setFormData((prev) => ({
        ...prev,
        name: student.name || "",
        cicNumber: student.cicNumber || "",
        phoneNumber: student.phoneNumber || "",
        whatsupNumber: student.whatsupNumber || "",
        email: student.email || "",
        address: student.address || "",
        batchName: student.batchName || "",
        dateOfBirth: student.dateOfBirth || "",
        parentNumber: student.parentNumber || "",
        profileImage: student.profileImage || null,
      }));
    }
  }, [student]);
  
  
  
  useEffect(() => {
    if (isPopoverVisible && popoverRef.current) {
      const calendar = popoverRef.current.querySelector(".cally");
      if (calendar) {
        const onChangeHandler = (event) => {
          const selectedDate = event.detail?.value || event.target.value;
          setFormData((prev) => ({ ...prev, dateOfBirth: selectedDate }));
          if (buttonRef.current) {
            buttonRef.current.innerText = selectedDate;
          }
          setIsPopoverVisible(false);
        };
        calendar.addEventListener("change", onChangeHandler);
        return () => {
          calendar.removeEventListener("change", onChangeHandler);
        };
      }
    }
  }, [isPopoverVisible]);

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Student Name is required");
    if (!formData.cicNumber) return toast.error("Cic Number is required");
    if (!formData.batchName) return toast.error("Batch is required");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if(studentId){
        editStudent(formData, studentId)
      }else{
      newAdmission(formData);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      <Header page={"Student Admission Form"} />
      <main className="flex-grow flex justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Please fill in all required details below
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Profile Image Upload - Positioned at Top */}
            <div className="md:col-span-2 flex justify-center mb-6">
              <label htmlFor="profileImage" className="cursor-pointer">
                {formData.profileImage ? (
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Profile Preview"
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
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Left Column */}
            <div className="space-y-4">
              <InputField
                label="Student Name"
                name="name"
                value={formData.name}
                icon={<User />}
                onChange={setFormData}
              />
              <InputField
                label="CIC Number"
                name="cicNumber"
                type="number"
                value={formData.cicNumber}
                icon={<Phone />}
                onChange={setFormData}
              />
                  <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                icon={<Calendar1Icon />}
                onChange={setFormData}
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                icon={<Phone />}
                onChange={setFormData}
              />
           
              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                icon={<Lock />}
                onChange={setFormData}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <SelectField
                label="Batch"
                name="batchName"
                value={formData.batchName}
                options={batches.map((c)=> c.name)}
                icon={<School />}
                onChange={setFormData}
              />
             
          
                 <InputField
                label="Address"
                name="address"
                value={formData.address}
                icon={<FolderOpenIcon />}
                onChange={setFormData}
              />
                 <InputField
                label="Whatsup Number"
                name="whatsupNumber"
                value={formData.whatsupNumber}
                icon={<PhoneCall />}
                onChange={setFormData}
              />
              <InputField
                label="Parent Number"
                name="parentNumber"
                value={formData.parentNumber}
                icon={<Phone />}
                onChange={setFormData}
              />
              <InputField
                label="date Of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth?.slice(0, 10)}
                icon={<Calendar1Icon />}
                onChange={setFormData}
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="btn btn-primary w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdmissionForm;
