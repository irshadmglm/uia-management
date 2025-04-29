import { Routes, Route, Navigate } from "react-router-dom";

import StudentHome from "../pages/StudentHome";
import StudentSemesterListing from "../pages/StudentSemesterListing";
import NotFound from "../pages/NotFound"; 
import MarkListPage from "../pages/MarkListPage";
import CurruntSemSubjects from "../pages/CurruntSemSubjects";
import StudentFees from "../pages/StudentFees";
import StudentProfile from "../pages/StudentProfile";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route index element={<StudentHome />} />
      <Route path="semester-list" element={<StudentSemesterListing />} />
      <Route path="semester/:semesterid" element={<MarkListPage />} />
      <Route path="subjects" element={<CurruntSemSubjects />} />
      {/* <Route path="ce-mark" element={<MarkListPage />} />
      <Route path="ir-mark" element={<MarkListPage />} /> */}
      <Route path="ishthiraq" element={<StudentFees />} />
      <Route path="profile" element={<StudentProfile />} />


      {/* Show a 404 Page instead of redirecting to StudentHome */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default StudentRoutes;
