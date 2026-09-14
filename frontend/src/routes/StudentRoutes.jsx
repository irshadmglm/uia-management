import { Routes, Route } from "react-router-dom";

import StudentHome from "../pages/student/StudentHome";
import StudentSemesterListing from "../pages/student/StudentSemesterListing";
import MarkListPage from "../pages/student/MarkListPage";
import CurruntSemSubjects from "../pages/student/CurruntSemSubjects";
import StudentProfile from "../pages/student/StudentProfile";
import NotFound from "../pages/NotFound"; 
import AchievementPage from "../pages/student/AchivementPage";
import ReadingProgressPage from "../pages/student/readingProgressPage";
import AcademicRegister from "../pages/student/StdAcademicRegister";
import StudentFeePortal from "../pages/student/StudentFees";
import StudentLayout from "../components/StudentLayout";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentLayout />}>
        <Route index element={<StudentHome />} />
        <Route path="academic-register" element={<AcademicRegister />} />
        <Route path="semester-list" element={<StudentSemesterListing />} />
        <Route path="achievement" element={<AchievementPage />} />
        <Route path="reading-progress" element={<ReadingProgressPage />} />
        <Route path="semester/:semesterid" element={<MarkListPage />} />
        <Route path="subjects" element={<CurruntSemSubjects />} />
        <Route path="ishthiraq" element={<StudentFeePortal />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
