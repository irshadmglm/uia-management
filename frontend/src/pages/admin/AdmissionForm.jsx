import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Phone, Mail, MapPin, Calendar, 
  Camera, Save, Loader2, MessageCircle, 
  FileText, ArrowRight, ArrowLeft, CheckCircle2,
  Briefcase, Hash, Lock
} from "lucide-react";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import { useRegisterdStudentStore } from "../../store/useRegisterdStudentStore";
import { useAdminStore } from "../../store/useAdminMngStore";
import { useStudentStore } from "../../store/studentStore";

// Steps Configuration
const STEPS = [
  { id: 1, title: "Personal Details", icon: User },
  { id: 2, title: "Contact Info", icon: Phone },
  { id: 3, title: "Academic Data", icon: Briefcase },
];

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="flex justify-center items-center mb-8">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.id} className="flex items-center">
            <div className="relative flex flex-col items-center group">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 
                ${isActive ? "bg-primary-600 border-primary-600 text-white scale-110 shadow-lg shadow-primary-500/30" : 
                  isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400"}`}
              >
                {isCompleted ? <CheckCircle2 size={20} /> : <step.icon size={18} />}
              </div>
              <span className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors duration-300
                ${isActive ? "text-primary-600 dark:text-primary-400" : 
                  isCompleted ? "text-emerald-600" : "text-slate-400"}`}>
                {step.title}
              </span>
            </div>
            
            {!isLast && (
              <div className="w-12 sm:w-24 h-1 mx-2 sm:mx-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-emerald-500"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const AdmissionForm = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  
  // Stores
  const { newAdmission, isLoading: isAdmitting } = useRegisterdStudentStore();
  const { batches, getBatches } = useAdminStore();
  const { student, getStudent, editStudent, isLoading: isFetching } = useStudentStore();

  // Local State
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // For animation direction
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    cicNumber: "",
    phoneNumber: "",
    whatsupNumber: "",
    email: "",
    address: "",
    password: "",
    batchName: "",
    dateOfBirth: "",
    parentNumber: "",
    profileImage: null,
    gender: "Male" // Added Default
  });

  // Initial Data Fetch
  useEffect(() => {
    getBatches();
    if (studentId) {
      getStudent(studentId);
    }
  }, [studentId, getBatches, getStudent]);

  // Populate Form on Edit
  useEffect(() => {
    if (studentId && student) {
      setFormData((prev) => ({
        ...prev,
        name: student.name || "",
        cicNumber: student.cicNumber || "",
        phoneNumber: student.phoneNumber || "",
        whatsupNumber: student.whatsupNumber || "",
        email: student.email || "",
        address: student.address || "",
        batchName: student.batchName || "",
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : "",
        parentNumber: student.parentNumber || "",
        gender: student.gender || "Male",
        // Keep existing image if not replaced
        profileImage: student.profileImage || null,
      }));
      setPreviewImage(student.profileImage);
    }
  }, [student, studentId]);

  // Handle Input
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Step Navigation Validation
  const validateStep = (step) => {
    switch (step) {
      case 1: // Personal
        if (!formData.name.trim()) return toast.error("Student Name is required");
        if (!formData.dateOfBirth) return toast.error("Date of Birth is required");
        return true;
      case 2: // Contact
        if (!formData.phoneNumber) return toast.error("Phone Number is required");
        if (!formData.parentNumber) return toast.error("Parent Contact is required");
        if (!formData.address) return toast.error("Address is required");
        return true;
      case 3: // Academic
        if (!formData.batchName) return toast.error("Batch is required");
        if (!formData.cicNumber) return toast.error("CIC Number is required");
        if (!studentId && !formData.password) return toast.error("Password is required");
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    try {
      if (studentId) {
        await editStudent(formData, studentId);
      } else {
        await newAdmission(formData);
      }
      navigate(-1); // Go back after success
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = isAdmitting || isFetching;

  // Animation Variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark pb-20">
      <Header page={studentId ? "Update Profile" : "Admission Portal"} />
      
      <div className="max-w-4xl mx-auto px-4 mt-10">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            {studentId ? "Edit Student Profile" : "New Student Admission"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Complete the form steps below to {studentId ? "update" : "register"} a student.
          </p>
        </div>

        <StepIndicator currentStep={currentStep} />

        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 md:p-10 min-h-[450px] flex flex-col justify-between overflow-hidden">
            
            {/* Form Content Area */}
            <div className="relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* --- STEP 1: PERSONAL --- */}
                  {currentStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Photo Upload */}
                      <div className="md:col-span-1 flex flex-col items-center">
                        <div className="relative group cursor-pointer">
                          <div className="w-40 h-40 rounded-full border-4 border-slate-100 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-inner">
                            {previewImage ? (
                              <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                <User size={48} strokeWidth={1.5} />
                                <span className="text-xs mt-2 font-medium">Upload Photo</span>
                              </div>
                            )}
                          </div>
                          <label htmlFor="profileImage" className="absolute bottom-0 right-0 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:scale-110 transition-all cursor-pointer">
                            <Camera size={20} />
                            <input id="profileImage" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                          </label>
                        </div>
                      </div>

                      {/* Personal Fields */}
                      <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                          <User size={20} className="text-primary-500" /> Personal Details
                        </h3>
                        <InputField
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          icon={<User size={18} />}
                          onChange={(val) => handleInputChange("name", val)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <InputField
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            icon={<Calendar size={18} />}
                            onChange={(val) => handleInputChange("dateOfBirth", val)}
                          />
                          <SelectField
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            options={["Male", "Female"]}
                            onChange={(val) => handleInputChange("gender", val)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- STEP 2: CONTACT --- */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Phone size={20} className="text-primary-500" /> Contact Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="Phone Number"
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          icon={<Phone size={18} />}
                          onChange={(val) => handleInputChange("phoneNumber", val)}
                        />
                        <InputField
                          label="WhatsApp Number"
                          name="whatsupNumber"
                          type="tel"
                          value={formData.whatsupNumber}
                          icon={<MessageCircle size={18} />}
                          onChange={(val) => handleInputChange("whatsupNumber", val)}
                        />
                        <InputField
                          label="Guardian Phone"
                          name="parentNumber"
                          type="tel"
                          value={formData.parentNumber}
                          icon={<Phone size={18} />}
                          onChange={(val) => handleInputChange("parentNumber", val)}
                        />
                        <InputField
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          icon={<Mail size={18} />}
                          onChange={(val) => handleInputChange("email", val)}
                        />
                      </div>
                      
                      <div className="pt-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Residential Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                          <textarea
                            rows={3}
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className="w-full pl-12 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none transition-all"
                            placeholder="Full address..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- STEP 3: ACADEMIC --- */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Briefcase size={20} className="text-primary-500" /> Academic & Security
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectField
                          label="Assign Batch"
                          name="batchName"
                          value={formData.batchName}
                          options={batches.map((c) => c.name)}
                          icon={<Briefcase size={18} />}
                          onChange={(val) => handleInputChange("batchName", val)}
                        />
                        <InputField
                          label="CIC Number"
                          name="cicNumber"
                          type="number"
                          value={formData.cicNumber}
                          icon={<Hash size={18} />}
                          onChange={(val) => handleInputChange("cicNumber", val)}
                        />
                      </div>

                      {!studentId && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-800/50 mt-4">
                          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
                            <Lock size={16} /> Account Security
                          </h4>
                          <InputField
                            label="Set Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            icon={<Lock size={18} />}
                            onChange={(val) => handleInputChange("password", val)}
                          />
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                            * Default password for new students. They can change it later.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all
                  ${currentStep === 1 
                    ? "text-slate-300 cursor-not-allowed" 
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"}`}
              >
                <ArrowLeft size={18} /> Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95"
                >
                  Next Step <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                  {studentId ? "Update Student" : "Submit Admission"}
                </button>
              )}
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;