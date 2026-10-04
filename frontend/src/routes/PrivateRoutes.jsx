import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import StudentRoutes from "./StudentRoutes";
import TeacherRoutes from "./TeacherRoutes";
import AdminRoutes from "./AdminRoutes";
import LibraryRoutes from "./LibraryRoutes";

const PrivateRoutes = () => {
  const { authUser } = useAuthStore();

  if (!authUser) return <Navigate to="/auth/login" replace />;

  return (
    <Routes>
      {authUser.role === "student" && (
        <Route path="student/*" element={<StudentRoutes />} />
      )}
      {authUser.role === "parent" && (
        <Route path="parent/*" element={<StudentRoutes />} />
      )}
      {authUser.role === "teacher" && (
        <Route path="teacher/*" element={<TeacherRoutes />} />
      )}
      {authUser.role === "admin" && (
        <Route path="admin/*" element={<AdminRoutes />} />
      )}
      {authUser.role === "library" && (
        <Route path="library/*" element={<LibraryRoutes />} />
      )}
      <Route
        path="*"
        element={
          authUser?.role ? (
            <Navigate to={authUser.role.toLowerCase()} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

    </Routes>
  );
};

export default PrivateRoutes;
