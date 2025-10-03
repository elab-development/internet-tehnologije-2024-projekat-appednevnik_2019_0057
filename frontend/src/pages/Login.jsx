import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { USERS } from "../data/users";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = USERS.find(
      (u) => u.username === username.trim() && u.password === password.trim()
    );

    if (!found) {
      setError("Pogrešno korisničko ime ili lozinka");
      return;
    }

    setUser(found);
    navigate("/home");
  };

  return (
    <div className="container page">
      <h1>Prijava</h1>
      <form onSubmit={handleSubmit}>
        <AppInput
          label="Korisničko ime"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <AppInput
          label="Lozinka"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        <AppButton type="submit" variant="primary">
          Prijavi se
        </AppButton>
      </form>
    </div>
  );
}
