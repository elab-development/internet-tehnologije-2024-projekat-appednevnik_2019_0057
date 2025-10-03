import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";

export default function Profile() {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || "");
  const [telefon, setTelefon] = useState(user?.telefon || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSave = () => {
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Email je obavezan");
      return;
    }
    if (!validateEmail(email.trim())) {
      setError("Unesite ispravan email (npr. ime@domen.com)");
      return;
    }

    if (!telefon.trim()) {
      setError("Telefon je obavezan");
      return;
    }

    const updated = { ...user, email: email.trim(), telefon: telefon.trim() };
    setUser(updated);
    setMessage("Podaci su sačuvani.");
  };

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
      <p style={{ opacity: 0.8, marginTop: 4 }}>
        Ulogovani korisnik: <strong>{user.name}</strong>
      </p>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h3 className="card-title">Osnovni podaci</h3>
          <div className="card-body">
            <div className="input-wrap">
              <label>Ime i prezime</label>
              <input className="input" value={user.name} readOnly />
            </div>

            <div className="input-wrap" style={{ marginTop: 12 }}>
              <label>Uloga</label>
              <input className="input" value={user.role} readOnly />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Kontakt</h3>
          <div className="card-body">
            <AppInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />
            <AppInput
              label="Telefon"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <AppButton variant="primary" onClick={handleSave}>
                Sačuvaj
              </AppButton>
              <AppButton
                variant="default"
                onClick={() => {
                  setEmail(user.email || "");
                  setTelefon(user.telefon || "");
                }}
              >
                Poništi promene
              </AppButton>
            </div>

            {message && (
              <p style={{ color: "green", marginTop: 10 }}>{message}</p>
            )}
          </div>
        </div>
      </div>

      <AppButton variant="danger" onClick={handleLogout}>
        Odjavi se
      </AppButton>
    </div>
  );
}
