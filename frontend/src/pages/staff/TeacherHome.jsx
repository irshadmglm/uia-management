import { useEffect } from "react";
import { useStaffStore } from "../../store/useStaffStore";
import { useAuthStore } from "../../store/useAuthStore";
import Card from "../../components/Card";
import { motion } from 'framer-motion';
import { 
  BookOpenText, ClipboardList, DownloadCloud, 
  Users2, Calendar, FileText 
} from "lucide-react";

const downloadsUrl = "https://drive.google.com/drive/folders/1iTo_Ldar0yfnXF_0yUvCXBMfja9KN99w?usp=drive_link";

const TeacherHome = () => {
  const { getBatch, batches } = useStaffStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getBatch();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-6 pb-20">
      
      {/* Teacher Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl shadow-xl text-white relative overflow-hidden"
      >
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-400 opacity-10 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold mb-2">Hello, {authUser?.name || "Teacher"}</h1>
          <p className="text-emerald-100 max-w-xl">
            You are managing <span className="font-bold bg-white/20 px-2 py-0.5 rounded">{batches.length}</span> classes this semester. 
            Check your academic register below.
          </p>
        </div>
      </motion.div>

      {/* Section Title */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <Users2 className="text-primary-500" /> My Classes
      </h2>

      {/* Class/Batch Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {batches.map((c) => (
          <motion.div key={c._id} variants={itemVariants} className="h-40">
            <Card 
              title={c.name} 
              icon={Users2} 
              route={`/dashboard/teacher/calss-teacher-home/${c._id}`} 
              color="blue"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Section Title */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <FileText className="text-primary-500" /> Quick Actions
      </h2>

      {/* Tools Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants} className="md:col-span-2 h-44">
          <Card 
            title="Assigned Subjects" 
            icon={BookOpenText} 
            route="/dashboard/teacher/assigned-subjects" 
            color="green"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-1 h-44">
          <Card 
            title="Academic Register" 
            icon={ClipboardList} 
            route={`/dashboard/teacher/academic-register`} 
            color="amber"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-1 h-44">
          <Card 
            title="Downloads" 
            icon={DownloadCloud} 
            url={downloadsUrl} 
            color="red"
          />
        </motion.div>
      </motion.div>

    </div>
  );
};

export default TeacherHome;