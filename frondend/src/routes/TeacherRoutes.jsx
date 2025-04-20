import { Routes, Route } from "react-router-dom";
import AttendancePage from "../pages/AttendancePage";
import RegisterdStudents from "../pages/RegisterdStudents";
import TeacherHome from "../pages/TeacherHome";
import TeacherAddGraceMark from "../pages/TeacherAddGraceMark";

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route index element={<TeacherHome />} />
      <Route path="attendance/:classname" element={<AttendancePage />} />
      <Route path="grace-mark" element={<TeacherAddGraceMark />} />
      {/* Fallback for unknown teacher routes */}
      <Route path="*" element={<TeacherHome />} />
    </Routes>
  );
};

export default TeacherRoutes;
