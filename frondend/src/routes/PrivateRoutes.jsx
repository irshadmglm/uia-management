import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import StudentRoutes from "./StudentRoutes";
import TeacherRoutes from "./TeacherRoutes";
import AdminRoutes from "./AdminRoutes";

const PrivateRoutes = () => {
  const { authUser } = useAuthStore();

  // If not authenticated, redirect to login
  if (!authUser) return <Navigate to="/auth/login" replace />;

  return (
    <Routes>
      {authUser.role === "student" && (
        <Route path="student/*" element={<StudentRoutes />} />
      )}
      {authUser.role === "teacher" && (
        <Route path="teacher/*" element={<TeacherRoutes />} />
      )}
      {authUser.role === "admin" && (
        <Route path="admin/*" element={<AdminRoutes />} />
      )}
      {/* Fallback: if none of the above match, redirect to the proper role's base */}
      <Route
        path="*"
        element={<Navigate to={authUser.role.toLowerCase()} replace />}
      />
    </Routes>
  );
};

export default PrivateRoutes;
