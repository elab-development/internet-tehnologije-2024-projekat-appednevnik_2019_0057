import { Navigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function GuestRoute({ children }) {
  const [user] = useLocalStorage("user", null);
  return user ? <Navigate to="/profile" replace /> : children;
}
