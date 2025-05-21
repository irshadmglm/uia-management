import { Routes, Route } from "react-router-dom";
import AttendancePage from "../pages/staff/AttendancePage";
import TeacherHome from "../pages/staff/TeacherHome";
import TeacherAddGraceMark from "../pages/staff/TeacherAddGraceMark";
import CalssTeacherHome from "../pages/staff/CalssTeacherHome";
import BatchStudentsDetails from "../pages/staff/BatchStudentsDetails";
import AssignedSubjects from "../pages/staff/AssignedSubjects";
import StaffProfile from "../pages/admin/StaffProfile";
import FeesTeacher from "../pages/staff/FeesTeacher";
import MarkSubmitedStudentsPage from "../pages/admin/MarkSubmitedStudentsPage";
import AdminsideMarkListes from "../pages/admin/AdminsideMarkListes ";

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route index element={<TeacherHome />} />
      <Route path="attendance/:classname" element={<AttendancePage />} />
      <Route path="calss-teacher-home/:batchId" element={<CalssTeacherHome />} />
      <Route path="batch-students/:batchId" element={<BatchStudentsDetails />} />
      <Route path="grace-mark" element={<TeacherAddGraceMark />} />
      <Route path="assigned-subjects" element={<AssignedSubjects />} />
      <Route path="ishthiraq/:batchId" element={<FeesTeacher />} />
      <Route path="profile" element={<StaffProfile />} />
      <Route path="marklistes/:batchId" element={<MarkSubmitedStudentsPage />} />
      <Route path="marklist/:studentId" element={<AdminsideMarkListes />} />

      <Route path="*" element={<TeacherHome />} />
    </Routes>
  );
};

export default TeacherRoutes;
