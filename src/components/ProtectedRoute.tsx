import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "admin" | "client";
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { session } = useAuth();

  if (!session.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (session.userRole !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    if (session.userRole === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/client" replace />;
  }

  return <>{children}</>;
};
