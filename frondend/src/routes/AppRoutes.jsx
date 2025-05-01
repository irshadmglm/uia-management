import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import RoleBasedRoutes from "./RoleBasedRoutes";
import NotFound from "../pages/NotFound"; 

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RoleBasedRoutes />} />

      <Route path="/auth/*" element={<PublicRoutes />} />

      <Route path="/dashboard/*" element={<PrivateRoutes />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
