import { Routes, Route } from "react-router-dom";
import LibraryLayout from "../components/LibraryLayout";
import LibraryDashboard from "../pages/admin/LibraryDashboard";
import LibraryBooksTab from "../pages/admin/LibraryBooksTab";
import LibraryStudents from "../pages/admin/LibraryStudents";
import LibraryBorrowed from "../pages/admin/LibraryBorrowed";

const LibraryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LibraryLayout />}>
        <Route index element={<LibraryDashboard />} />
        <Route path="books" element={<LibraryBooksTab />} />
        <Route path="students" element={<LibraryStudents />} />
        <Route path="borrowed" element={<LibraryBorrowed />} />
        <Route path="*" element={<LibraryDashboard />} />
      </Route>
    </Routes>
  );
};

export default LibraryRoutes;
