import { Navigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function RequireGuest({ children }) {
  const [user] = useLocalStorage("user", null);
  return user ? <Navigate to="/profile" replace /> : children;
}
