import { Navigate } from "react-router-dom";
import { authAPI } from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Array<"ADMIN" | "EDITOR" | "VIEWER">;
}

/**
 * Protected Route Component
 * 
 * Wraps admin routes to ensure only authenticated users can access them.
 */
const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const isAuthenticated = authAPI.isAuthenticated();
  const user = authAPI.getCurrentUser();

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

