import Header from "../../components/Header";
import Card from "../../components/Card";
import { Award, BookCopyIcon, BookMarked, BookUserIcon, DownloadCloud, GraduationCap, ListChecks, LucideHandCoins, PictureInPicture, ServerCogIcon, Table2Icon } from "lucide-react";
import { useStaffStore } from "../../store/useStaffStore";
import { motion } from 'framer-motion';

import { useEffect } from "react";
const downloadsUrl = "https://drive.google.com/drive/folders/1iTo_Ldar0yfnXF_0yUvCXBMfja9KN99w?usp=drive_link"

const StudentHome = () => {
     const {batch, getStudentBatch} = useStaffStore();
     useEffect(() => {
       getStudentBatch()
     }, [getStudentBatch])
     const cards = [
      { title: "Subjects", icon: BookCopyIcon, route: "/dashboard/student/subjects" },
      { title: "Achievement", icon: Award, route: "/dashboard/student/achievement" },
      { title: "Reading Progress", icon: BookUserIcon, route: "/dashboard/student/reading-progress" },
      { title: "Mark List", icon: ListChecks, route: "/dashboard/student/semester-list" },
      { title: "Internel Mark", icon: BookMarked, url: batch?.IRmarkList },
      { title: "CE Mark", icon: BookMarked, url: batch?.CEmarkList  },
      { title: "Downloads", icon: DownloadCloud, url: downloadsUrl  },
      { title: "Ishthiraq", icon: LucideHandCoins, route: "/dashboard/student/ishthiraq" },
    ];
     
    return (
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20 w-full max-w-4xl p-4">
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
                  {...(card.route ? { route: card.route } : { url: card.url })}
                />

            </motion.div>

          ))}
        </div>
      </div>
    );
};

export default StudentHome