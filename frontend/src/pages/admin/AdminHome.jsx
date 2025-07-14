import React from 'react';
import { motion } from 'framer-motion';
import Header from "../../components/Header";
import Card from "../../components/Card";
import { Users, GraduationCap, Settings2Icon, LineChart, MousePointer2, ListTodo, LucideCopySlash, ArchiveIcon, ClipboardList, Award, ClipboardCheck, HandCoins, Medal, File, DownloadCloud, Book,  } from "lucide-react";
const downloadsUrl = "https://drive.google.com/drive/folders/1iTo_Ldar0yfnXF_0yUvCXBMfja9KN99w?usp=drive_link"

const AdminHome = () => {
  const cards = [
    { title: "Academic Register", icon: ClipboardList , route: "/dashboard/admin/academic-register" },
    { title: "Assign Duties", icon: GraduationCap, route: "/dashboard/admin/assign-duties" },
    { title: "Manage Academic Info", icon: Settings2Icon, route: "/dashboard/admin/management" },

    { title: "Students' Details", icon: Users, route: "/dashboard/admin/users" },
    { title: "CE Mark", icon: ClipboardCheck, route: "/dashboard/admin/ce-mark" }, 
    { title: "Internal Mark", icon: ListTodo, route: "/dashboard/admin/ir-mark" },

    { title: "Semester Exam Results", icon: Award, route: "/dashboard/admin/batches/marklist" },
    { title: "Achivements", icon: Medal, route: "/dashboard/admin/batches/achievements" },
    { title: "Reading Progress", icon: Book, route: "/dashboard/admin/batches/reading-progress" },

    { title: "Ishthiraq", icon:  HandCoins, route: "/dashboard/admin/ishthiraq" },
    { title: "Downloads", icon: DownloadCloud, url: downloadsUrl },
    { title: "Academic Records", icon: File, route: "/dashboard/admin/academic-records" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-14 w-full max-w-6xl p-4">
        {cards.map((card, index) => (
          <motion.div
          key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: index * 0.1 }}
          >
            <Card 
             title={card.title}
             icon={card.icon}
             {...(card.route ? { route: card.route } : { url: card.url })} />
          </motion.div>


    
      

        ))}
      </div>
    </div>
  );
};

export default AdminHome;
