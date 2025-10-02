import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import AppButton from "../components/AppButton";

export default function Profile() {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="container page">
      <h1>Profil korisnika</h1>
      <p>
        <strong>Korisničko ime:</strong> {user.name}
      </p>
      <AppButton variant="danger" onClick={handleLogout}>
        Odjavi se
      </AppButton>
    </div>
  );
}
