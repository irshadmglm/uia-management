import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { MdLibraryBooks, MdMenuBook, MdAssignmentReturned, MdPeople, MdCheckBox, MdMoney } from "react-icons/md";
import { BookMarked, GraduationCap, LineChart, ListTodo, LucideCopySlash, Magnet, MousePointer2, Settings2Icon, Table, User, Users } from "lucide-react";

const AdminHome = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20 w-full max-w-4xl p-4">
        {/* <Card title="Admission Form" icon={MdLibraryBooks} route="/dashboard/admin/admission-form" /> */}
        {/* <Card title="Registered Students" icon={MdLibraryBooks} route="/dashboard/admin/registered-students" /> */}
        {/* <Card title="Timetable Assign" icon={Table} route="/dashboard/admin/timetable-Assign" /> */}
        <Card title="Students" icon={Users} route="/dashboard/admin/users" />
        <Card title="Teachers" icon={GraduationCap} route="/dashboard/admin/teachers-Assign" />
        <Card title="Management" icon={Settings2Icon} route="/dashboard/admin/management" />
        <Card title="MarkList updte" icon={LineChart} route="/dashboard/admin/batches" />
        <Card title="CE Mark" icon={MousePointer2} route="/dashboard/admin/ce-mark" />
        <Card title="Internel Mark" icon={ListTodo} route="/dashboard/admin/ce-mark" />
        <Card title="Ishthiraq" icon={LucideCopySlash} route="/dashboard/admin/ishthiraq" />
        
      </div>
    </div>
  );
};

export default AdminHome;
