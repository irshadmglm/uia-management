import Header from "../../components/Header";
import Card from "../../components/Card";
import { BookMarked, ClipboardPenLineIcon, GraduationCap, LineChart, ListTodo, LucideCopySlash, Magnet, MousePointer2, Settings2Icon, Table, User, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useStaffStore } from "../../store/useStaffStore";

const CalssTeacherHome = () => {
    const { batchId } = useParams();
    const {batch, getBatchById } = useStaffStore()
    useEffect(() => {
     getBatchById(batchId)
    }, [getBatchById])
    
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20 w-full max-w-4xl p-4">

        <Card title="Students" icon={Users} route={`/dashboard/teacher/batch-students/${batchId}`} />
        <a
            href={batch?.IRmarkList}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open internal mark sheet in a new tab"
            >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-md hover:shadow-2xl dark:hover:shadow-lg 
                            transform transition duration-300 hover:scale-105 cursor-pointer p-5 flex flex-col items-center"
                >
                <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-full p-3 shadow-lg">
                    <ListTodo className="text-white text-4xl transition-transform duration-300 hover:scale-110" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-200">Internel Mark</h2>
            </div>
            </a>
        <a
            href={batch?.CEmarkList}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open internal mark sheet in a new tab"
            >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-md hover:shadow-2xl dark:hover:shadow-lg 
                            transform transition duration-300 hover:scale-105 cursor-pointer p-5 flex flex-col items-center"
                >
                <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-full p-3 shadow-lg">
                    <ListTodo className="text-white text-4xl transition-transform duration-300 hover:scale-110" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-200">CE Mark</h2>
            </div>
            </a>
            <Card title="Ishthiraq" icon={ClipboardPenLineIcon} route={`/dashboard/teacher/ishthiraq/${batchId}`} />
            <Card title="Marklist" icon={ListTodo} route={`/dashboard/teacher/marklistes/${batchId}`} />
      </div>
    </div>
  );
};

export default CalssTeacherHome