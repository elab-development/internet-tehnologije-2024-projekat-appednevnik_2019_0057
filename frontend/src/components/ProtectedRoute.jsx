import { Navigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [user] = useLocalStorage("user", null);
  if (!user) return <Navigate to="/login" replace />;

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role))
      return <Navigate to="/home" replace />;
  }

  return children;
}
