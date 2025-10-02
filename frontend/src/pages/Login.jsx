import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Login() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() === "") return alert("Unesi korisničko ime!");
    setUser({ name: username });
    navigate("/home", { replace: true });
  };

  return (
    <div className="container page">
      <h1>Prijava</h1>
      <AppInput
        label="Korisničko ime"
        placeholder="Unesi ime..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <AppButton variant="primary" onClick={handleLogin}>
        Prijavi se
      </AppButton>
    </div>
  );
}
