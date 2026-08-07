import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import Card from "../../components/Card";
import { Users, GraduationCap, Settings2Icon, LineChart, MousePointer2, ListTodo, LucideCopySlash, ArchiveIcon, ClipboardList, Award, ClipboardCheck, HandCoins, Medal,  } from "lucide-react";
import { useStaffStore } from '../../store/useStaffStore';
import { useAuthStore } from '../../store/useAuthStore';

const AcademicRegister = () => {
    const { getBatchById, batch } = useStaffStore();
    const { authUser} = useAuthStore();
  
  
    useEffect(() => {
        if(authUser && authUser.batchId){
            getBatchById(authUser.batchId);
        }
    }, [authUser, getBatchById]);
  
    

  const cards = [
    { title: "Students' Leave Status", icon: ClipboardList , url: batch.stdAttendanceRegister },
    { title: "Quarterly Subject Status", icon: GraduationCap, url: batch.subjectStatus },
    { title: "CE Status", icon: Award, url: batch.ceStatus }
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
            <Card title={card.title} icon={card.icon} {...(card.route ? { route: card.route } : { url: card.url })} />
          </motion.div>

        ))}
      </div>
    </div>
  );
};

export default AcademicRegister