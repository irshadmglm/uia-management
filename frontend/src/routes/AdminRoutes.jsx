import { Routes, Route } from "react-router-dom";
import AdminHome from "../pages/admin/AdminHome";
import StudentList from "../pages/admin/StudentList";
import StudentForm from "../pages/admin/StudentForm";
import AdmissionForm from "../pages/admin/AdmissionForm";
import RegisterdStudents from "../pages/admin/RegisterdStudents";
import TimetableAsigment from "../pages/admin/TimetableAsigment";
import AssignDutiesPage from "../pages/admin/AssignDutiesPage";
import ManagementPage from "../pages/admin/ManagementPage";
import AdminAttendance from "../pages/admin/AdminAttendance";
import SemesterPage from "../pages/admin/SemesterPage";
import AdminMarkUpdate from "../pages/admin/AdminMarkUpdate";
import MarkSubmitedStudentsPage from "../pages/admin/MarkSubmitedStudentsPage";
import AdminsideMarkListes from "../pages/admin/AdminsideMarkListes ";
import CEMarkAdmin from "../pages/admin/CEMarkAdmin";
import IRMarkAdmin from "../pages/admin/IRMarkAdmin";
import StaffProfile from "../pages/admin/StaffProfile";
import SignupPage from "../pages/admin/SignupPage";
import FeesDashboard from "../pages/admin/FeesDashbord";
import BatchAcademicStatus from "../pages/admin/BatchAcademicStatus";
import AcademicRegister from "../pages/admin/AcademicRegister";
import InactiveStdList from "../pages/admin/InactiveStdList";
import AdminIshthiraq from "../pages/admin/AdminIshthiraq";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminHome />} />
      <Route path="users" element={<StudentList />} />
      <Route path="inactive-std" element={<InactiveStdList />} />
      <Route path="users/add" element={<StudentForm />} />
      <Route path="users/edit/:id" element={<StudentForm edit />} />
      <Route path="admission-form" element={<AdmissionForm />} />
      <Route path="registered-students" element={<RegisterdStudents />} />
      <Route path="timetable-Assign" element={<TimetableAsigment />} />
      <Route path="assign-duties" element={<AssignDutiesPage />} />
      <Route path="management" element={<ManagementPage />} />
      <Route path="attendance/:batchname" element={<AdminAttendance />} />
      <Route path="semester/:semesterId" element={<SemesterPage />} />
      <Route path="batches" element={<AdminMarkUpdate />} />
      <Route path="batches/marklist/:batchId" element={<MarkSubmitedStudentsPage />} />
      <Route path="marklistes/:studentId" element={<AdminsideMarkListes />} />
      {/* <Route path="ishthiraq" element={<FeesDashboard />} /> */}
      <Route path="ishthiraq" element={<AdminIshthiraq item="ishthiraq" />} />
      <Route path="ce-mark" element={<CEMarkAdmin />} />
      <Route path="ir-mark" element={<IRMarkAdmin />} />
      <Route path="profile" element={<StaffProfile />} />
      <Route path="std-edit/:studentId" element={<AdmissionForm />} />
      <Route path="staff-edit/:teacherId" element={<SignupPage />} />
      <Route path="signup" element={<SignupPage />} />

      <Route path="academic-records" element={<AcademicRegister  />} />

      <Route path="academic-register" element={<AcademicRegister  />} />
      <Route path="std-attendance-register" element={<BatchAcademicStatus item="stdAttendanceRegister" />} />
      <Route path="staff-attendance-register" element={<BatchAcademicStatus item="staffAttendanceRegister" />} />
      <Route path="subject-status" element={<BatchAcademicStatus item="subjectStatus" />} />
      <Route path="ce-status" element={<BatchAcademicStatus item="ceStatus" />} />
      

      <Route path="*" element={<AdminHome />} />
    </Routes>
  );
};

export default AdminRoutes;
