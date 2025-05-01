import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import LoginPage from "../pages/LoginPage";

const PublicRoutes = () => {
  const { authUser } = useAuthStore();

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="login" replace />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
