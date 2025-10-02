import { Navigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function RequireAuth({ children }) {
  const [user] = useLocalStorage("user", null);
  return user ? children : <Navigate to="/login" replace />;
}
