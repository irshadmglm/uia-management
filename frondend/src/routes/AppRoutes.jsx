import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import RoleBasedRoutes from "./RoleBasedRoutes";
import NotFound from "../pages/NotFound"; // Your custom 404 page

const AppRoutes = () => {
  return (
    <Routes>
      {/* Role-Based Routing: when visiting "/" redirect based on user role */}
      <Route path="/" element={<RoleBasedRoutes />} />

      {/* Public Routes (Login & Signup) */}
      <Route path="/auth/*" element={<PublicRoutes />} />

      {/* Private Routes (Authenticated Users Only) */}
      <Route path="/dashboard/*" element={<PrivateRoutes />} />

      {/* 404 Not Found Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
