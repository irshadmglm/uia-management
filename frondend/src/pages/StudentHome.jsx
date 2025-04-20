import Header from "../components/Header";
import Card from "../components/Card";
import { GraduationCap, ListChecks, ServerCogIcon, Table2Icon } from "lucide-react";
import { useStaffStore } from "../store/useStaffStore";
import { useEffect } from "react";

const StudentHome = () => {
      
      
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20 w-full max-w-4xl p-4">
        <Card title="Mark List" icon={ListChecks} route="/dashboard/student/semester-list" />
        <Card title="CE Mark" icon={GraduationCap} route="/dashboard/student/" />
        <Card title="Ishthiraq" icon={ServerCogIcon} route="/dashboard/student/" />
        
      </div>
    </div>
  );
};

export default StudentHome