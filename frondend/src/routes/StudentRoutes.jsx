import { Routes, Route, Navigate } from "react-router-dom";

import StudentHome from "../pages/StudentHome";
import StudentSemesterListing from "../pages/StudentSemesterListing";
import NotFound from "../pages/NotFound"; 
import MarkListPage from "../pages/MarkListPage";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route index element={<StudentHome />} />
      <Route path="semester-list" element={<StudentSemesterListing />} />
      <Route path="semester/:semesterid" element={<MarkListPage />} />

      {/* Show a 404 Page instead of redirecting to StudentHome */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default StudentRoutes;
