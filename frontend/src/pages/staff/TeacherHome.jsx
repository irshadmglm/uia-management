import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import { BookOpenText, ClipboardList, DownloadCloud, ListTodo, Table2Icon, Users2 } from "lucide-react";
import { useStaffStore } from "../../store/useStaffStore";
import { useEffect } from "react";

const downloadsUrl = "https://drive.google.com/drive/folders/1iTo_Ldar0yfnXF_0yUvCXBMfja9KN99w?usp=drive_link"

const TeacherHome = () => {
      const {getBatch, batches} = useStaffStore();
      useEffect(() => {
        getBatch();
      }, [])
      
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
  <Header />
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20 w-full max-w-4xl p-4">
    {batches.map((c) => (
      <Card key={c._id} title={c.name} icon={Users2} route={`/dashboard/teacher/calss-teacher-home/${c._id}`} />
    ))}
    <Card title="My Subjects" icon={BookOpenText} route="/dashboard/teacher/assigned-subjects" />
    <Card title="Downloads" icon={DownloadCloud} url={downloadsUrl} />
    <Card title="Academic Register" icon={ClipboardList} route={`/dashboard/teacher/academic-register`} />


  </div>
</div>

  );
};


export default TeacherHome