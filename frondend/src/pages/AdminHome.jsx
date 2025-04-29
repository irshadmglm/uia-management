import React from 'react';
import { motion } from 'framer-motion';
import Header from "../components/Header";
import Card from "../components/Card";
import { Users, GraduationCap, Settings2Icon, LineChart, MousePointer2, ListTodo, LucideCopySlash } from "lucide-react";

const AdminHome = () => {
  const cards = [
    { title: "Students", icon: Users, route: "/dashboard/admin/users" },
    { title: "Teachers", icon: GraduationCap, route: "/dashboard/admin/teachers-Assign" },
    { title: "Management", icon: Settings2Icon, route: "/dashboard/admin/management" },
    { title: "MarkList Update", icon: LineChart, route: "/dashboard/admin/batches" },
    { title: "CE Mark", icon: MousePointer2, route: "/dashboard/admin/ce-mark" },
    { title: "Internal Mark", icon: ListTodo, route: "/dashboard/admin/ir-mark" },
    { title: "Ishthiraq", icon: LucideCopySlash, route: "/dashboard/admin/ishthiraq" },
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
            <Card title={card.title} icon={card.icon} route={card.route} />
          </motion.div>


    
      

        ))}
      </div>
    </div>
  );
};

export default AdminHome;
