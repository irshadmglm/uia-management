import Header from "../../components/Header";
import Card from "../../components/Card";
import { motion } from 'framer-motion';
import { Award, Book, ClipboardCheck, HandCoins, ListTodo, Medal, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useStaffStore } from "../../store/useStaffStore";

const CalssTeacherHome = () => {
  const { batchId } = useParams();
    const {batch, getBatchById } = useStaffStore()
    useEffect(() => {
     if(batchId){
      getBatchById(batchId)
     }
    }, [getBatchById, batchId])
    
    const cards = [
  
      { title: "Students' Details", icon: Users, route: `/dashboard/teacher/batch-students/${batchId}` },  
      { title: "Semester Exam Results", icon: Award, route: `/dashboard/teacher/batches/marklist/${batchId}` },
      { title: "Achivements", icon: Medal, route: `/dashboard/teacher/batches/achivements/${batchId}` },
      { title: "Reading Progress", icon: Book, route: `/dashboard/teacher/batches/reading-progress/${batchId}` },
      { title: "CE Mark", icon: ClipboardCheck, url: batch?.CEmarkList },
      { title: "Internal Mark", icon: ListTodo, url: batch?.IRmarkList  },
      { title: "Ishthiraq", icon:  HandCoins, url: batch?.ishthiraq  },
    ];
    return (
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 w-full max-w-6xl p-4">
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

export default CalssTeacherHome