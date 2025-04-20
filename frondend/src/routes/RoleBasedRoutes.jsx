import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const RoleBasedRoutes = () => {
  const { authUser } = useAuthStore();

  // If not logged in, redirect to login
  if (!authUser) return <Navigate to="/auth/login" replace />;

  // Redirect based on role (ensure roles are in lowercase for consistency)
  switch (authUser.role.toLowerCase()) {
    case "admin":
      return <Navigate to="/dashboard/admin" replace />;
    case "teacher":
      return <Navigate to="/dashboard/teacher" replace />;
    case "student":
      return <Navigate to="/dashboard/student" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default RoleBasedRoutes;
