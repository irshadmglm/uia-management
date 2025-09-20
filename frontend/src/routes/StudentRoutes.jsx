import { Routes, Route, Navigate } from "react-router-dom";

import StudentHome from "../pages/student/StudentHome";
import StudentSemesterListing from "../pages/student/StudentSemesterListing";
import MarkListPage from "../pages/student/MarkListPage";
import CurruntSemSubjects from "../pages/student/CurruntSemSubjects";
import StudentFees from "../pages/student/StudentFees";
import StudentProfile from "../pages/student/StudentProfile";
import NotFound from "../pages/NotFound"; 
import AchievementPage from "../pages/student/AchivementPage";
import ReadingProgressPage from "../pages/student/readingProgressPage";
import AcademicRegister from "../pages/student/StdAcademicRegister";
import StudentFeePortal from "../pages/student/StudentFees";


const StudentRoutes = () => {
  return (
    <Routes>
      <Route index element={<StudentHome />} />
      <Route path="academic-register" element={<AcademicRegister  />} />
      <Route path="semester-list" element={<StudentSemesterListing />} />
      <Route path="achievement" element={<AchievementPage/>} />
      <Route path="reading-progress" element={<ReadingProgressPage/>} />
      <Route path="semester/:semesterid" element={<MarkListPage />} />
      <Route path="subjects" element={<CurruntSemSubjects />} />
      <Route path="ishthiraq" element={<StudentFeePortal />} />
      <Route path="profile" element={<StudentProfile />} />



      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default StudentRoutes;
