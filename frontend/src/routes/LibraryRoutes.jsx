import { Routes, Route } from "react-router-dom";
import LibraryLayout from "../components/LibraryLayout";
import AdminLibraryPage from "../pages/admin/AdminLibraryPage";

const LibraryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LibraryLayout />}>
        <Route index element={<AdminLibraryPage />} />
        <Route path="*" element={<AdminLibraryPage />} />
      </Route>
    </Routes>
  );
};

export default LibraryRoutes;
