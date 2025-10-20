import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import api, { setAuthToken } from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      const token = res.data.access_token;
      if (!token) throw new Error("Nije vraćen token.");

      localStorage.setItem("token", res.data.access_token || res.data.token);
      setAuthToken(token);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      setMsg(res.data.message || "Uspešna prijava.");
      navigate("/home", { replace: true });
    } catch (e) {
      const be = e?.response?.data;
      const beMsg = be?.message || be?.error || "Neuspešna prijava.";
      setError(beMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page">
      <h1>Prijava</h1>

      {error && (
        <p className="error-text" style={{ marginBottom: 8 }}>
          {error}
        </p>
      )}
      {msg && <p style={{ color: "green", marginBottom: 8 }}>{msg}</p>}

      <form onSubmit={handleSubmit}>
        <AppInput
          label="Korisničko ime"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AppInput
          label="Lozinka"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        <AppButton type="submit" variant="primary">
          {loading ? "Prijava..." : "Prijavi se"}
        </AppButton>
      </form>
    </div>
  );
}
