import React from 'react';
import { motion } from 'framer-motion';

import Card from "../../components/Card";
import { Users, GraduationCap, Settings2Icon, LineChart, MousePointer2, ListTodo, LucideCopySlash, ArchiveIcon, ClipboardList, Award, ClipboardCheck, HandCoins, Medal,  } from "lucide-react";

const AcademicRegister = () => {
  const cards = [
    { title: "Students' Leave Status", icon: ClipboardList , route: "/dashboard/admin/std-attendance-register" },
    { title: "Teachers' Attendance Register", icon: ListTodo, route: "/dashboard/admin/staff-attendance-register" },
    { title: "Quarterly Subject Status", icon: GraduationCap, route: "/dashboard/admin/subject-status" },
    { title: "CE Status", icon: Award, route: "/dashboard/admin/ce-status" }
  ];

  return (
    <div className="flex flex-col items-center dark: dark:">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl p-4">
        {cards.map((card, index) => (
          <motion.div
          key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: index * 0.1 }}
          >
            <Card title={card.title} icon={card.icon} route={card.route} />
          </motion.div>


    
      

        ))}
      </div>
    </div>
  );
};

export default AcademicRegister