import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

const PublicRoutes = () => {
  const { authUser } = useAuthStore();

  // If user is already authenticated, redirect to home (role‑based)
  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="login" element={<LoginPage />} />
        {/* For any unmatched /auth route, redirect to login */}
        <Route path="*" element={<Navigate to="login" replace />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
