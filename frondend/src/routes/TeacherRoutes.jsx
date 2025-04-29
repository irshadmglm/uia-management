import { Routes, Route } from "react-router-dom";
import AttendancePage from "../pages/AttendancePage";
import RegisterdStudents from "../pages/RegisterdStudents";
import TeacherHome from "../pages/TeacherHome";
import TeacherAddGraceMark from "../pages/TeacherAddGraceMark";
import CalssTeacherHome from "../pages/CalssTeacherHome";
import BatchStudentsDetails from "../pages/BatchStudentsDetails";
import AssignedSubjects from "../pages/AssignedSubjects";
import FeesTeacher from "../pages/feesTeacher";

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
      {/* Fallback for unknown teacher routes */}
      <Route path="*" element={<TeacherHome />} />
    </Routes>
  );
};

export default TeacherRoutes;
