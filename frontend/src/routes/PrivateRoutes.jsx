import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import StudentRoutes from "./StudentRoutes";
import TeacherRoutes from "./TeacherRoutes";
import AdminRoutes from "./AdminRoutes";
import InstallPrompt from "../components/InstallPrompt";



const PrivateRoutes = () => {
  const { authUser } = useAuthStore();
  const [showPrompt, setShowPrompt] = useState(true);

  if (!authUser) return <Navigate to="/auth/login" replace />;

  // Show install prompt once after login
  // You can also enhance this to save in localStorage so it doesn't keep showing

  return (
    <>
      {showPrompt && <InstallPrompt onClose={() => setShowPrompt(false)} />}
      {!showPrompt && (
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
      )}
    </>
  );
};

export default PrivateRoutes;
