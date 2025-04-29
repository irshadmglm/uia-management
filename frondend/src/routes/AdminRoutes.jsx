import { Routes, Route } from "react-router-dom";
import StudentList from "../pages/StudentList";
import StudentForm from "../pages/StudentForm";
import AdmissionForm from "../pages/AdmissionForm";
import AdminHome from "../pages/AdminHome";
import RegisterdStudents from "../pages/RegisterdStudents";
import TimetableAsigment from "../pages/TimetableAsigment";
import TeacherAssignmentPage from "../pages/TeacherAssignmentPage";
import ManagementPage from "../pages/ManagementPage";
import SignupPage from "../pages/SignupPage";
import AdminAttendance from "../pages/AdminAttendance";
import SemesterPage from "../pages/SemesterPage";
import AdminMarkUpdate from "../pages/AdminMarkUpdate";
import MarkSubmitedStudentsPage from "../pages/MarkSubmitedStudentsPage";
import AdminsideMarkListes from "../pages/AdminsideMarkListes ";
import FeesDashboard from "../pages/FeesDashbord";
import CEMarkAdmin from "../pages/CEMarkAdmin";
import IRMarkAdmin from "../pages/IRMarkAdmin";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminHome />} />
      {/* Manage user list */}
      <Route path="users" element={<StudentList />} />
      <Route path="users/add" element={<StudentForm />} />
      <Route path="users/edit/:id" element={<StudentForm edit />} />
      {/* Admission form route */}
      <Route path="admission-form" element={<AdmissionForm />} />
      <Route path="registered-students" element={<RegisterdStudents />} />
      <Route path="timetable-Assign" element={<TimetableAsigment />} />
      <Route path="teachers-Assign" element={<TeacherAssignmentPage />} />
      <Route path="management" element={<ManagementPage />} />
      <Route path="attendance/:batchname" element={<AdminAttendance />} />
      <Route path="semester/:semesterId" element={<SemesterPage />} />
      <Route path="batches" element={<AdminMarkUpdate />} />
      <Route path="batches/marklist/:batchId" element={<MarkSubmitedStudentsPage />} />
      <Route path="marklistes/:studentId" element={<AdminsideMarkListes />} />
      <Route path="ishthiraq" element={<FeesDashboard />} />
      <Route path="ce-mark" element={<CEMarkAdmin />} />
      <Route path="ir-mark" element={<IRMarkAdmin />} />
      

      {/* teachers singup form */}
      <Route path="signup" element={<SignupPage />} />

      {/* Fallback for unknown admin routes */}
      <Route path="*" element={<AdminHome />} />
    </Routes>
  );
};

export default AdminRoutes;
