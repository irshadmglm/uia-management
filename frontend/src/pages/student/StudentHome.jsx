import { useEffect } from "react";
import { useStaffStore } from "../../store/useStaffStore";
import { useAuthStore } from "../../store/useAuthStore";
import Card from "../../components/Card";
import { motion } from 'framer-motion';
import { 
  Award, BookCopyIcon, BookUserIcon, ClipboardList, 
  DownloadCloud, ListChecks, LucideHandCoins, 
  BookMarked, GraduationCap, Calendar 
} from "lucide-react";

const downloadsUrl = "https://drive.google.com/drive/folders/1iTo_Ldar0yfnXF_0yUvCXBMfja9KN99w?usp=drive_link";

const StudentHome = () => {
  const { batch, getStudentBatch } = useStaffStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getStudentBatch();
  }, [getStudentBatch]);

  // Bento Grid Configuration
  // colSpan: 1 = standard square, 2 = wide rectangle
  const bentoItems = [
    { 
      title: "Academic Register", 
      icon: ClipboardList, 
      route: "/dashboard/student/academic-register",
      color: "blue",
      colSpan: "md:col-span-2", // Wide Card
      description: "View attendance & leave status"
    },
    { 
      title: "Mark Lists", 
      icon: ListChecks, 
      route: "/dashboard/student/semester-list",
      color: "green",
      colSpan: "md:col-span-1",
      description: "Check exam results"
    },
    { 
      title: "Fees (Ishthiraq)", 
      icon: LucideHandCoins, 
      route: "/dashboard/student/ishthiraq",
      color: "amber",
      colSpan: "md:col-span-1",
      description: "Payment history"
    },
    { 
      title: "My Achievements", 
      icon: Award, 
      route: "/dashboard/student/achievement",
      color: "red",
      colSpan: "md:col-span-1",
      description: "Awards & certificates"
    },
    { 
      title: "Reading Progress", 
      icon: BookUserIcon, 
      route: "/dashboard/student/reading-progress",
      color: "blue",
      colSpan: "md:col-span-2", // Wide Card
      description: "Track books & library logs"
    },
    { 
      title: "Subjects", 
      icon: BookCopyIcon, 
      route: "/dashboard/student/subjects",
      color: "green",
      colSpan: "md:col-span-1",
      description: "Current semester syllabus"
    },
    { 
      title: "Downloads", 
      icon: DownloadCloud, 
      url: downloadsUrl,
      color: "amber",
      colSpan: "md:col-span-1",
      description: "Study materials"
    }
  ];

  // Internal Marks logic
  if(batch?.IRmarkList) {
    bentoItems.push({ 
      title: "Internal Marks", 
      icon: BookMarked, 
      url: batch.IRmarkList, 
      color: "red",
      colSpan: "md:col-span-1" 
    });
  }
  if(batch?.CEmarkList) {
    bentoItems.push({ 
      title: "CE Marks", 
      icon: BookMarked, 
      url: batch.CEmarkList, 
      color: "blue",
      colSpan: "md:col-span-1" 
    });
  }

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
      
      {/* Hero Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-8 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl shadow-xl text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Welcome back, {authUser?.name?.split(' ')[0]}!</h1>
            <p className="text-blue-100 flex items-center gap-2">
              <GraduationCap size={18} />
              {batch?.name || "Loading Batch..."} &bull; {authUser?.cicNumber || "ID Loading..."}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 flex items-center gap-2">
            <Calendar size={18} />
            <span className="font-medium text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]"
      >
        {bentoItems.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`${item.colSpan} h-full`}
          >
            <Card 
              title={item.title}
              icon={item.icon}
              color={item.color}
              route={item.route}
              url={item.url}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default StudentHome;