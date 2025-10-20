import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import api from "../api/axios";
import { useEffect } from "react";

async function fetchMyParentId() {
  const res = await api.get("/parents", { params: { per_page: 1000 } });
  const list = res?.data?.data ?? res?.data ?? [];
  const me = JSON.parse(localStorage.getItem("user") || "null");
  const found = list.find(
    (p) => p?.user?.id === me?.id || p?.user_id === me?.id
  );
  return found?.id;
}

async function fetchMyTeacherId() {
  const res = await api.get("/teachers", { params: { per_page: 1000 } });
  const list = res?.data?.data ?? res?.data ?? [];
  const me = JSON.parse(localStorage.getItem("user") || "null");
  const found = list.find(
    (t) => t?.user?.id === me?.id || t?.user_id === me?.id
  );
  return found?.id;
}

export default function Profile() {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || "");
  const [telefon, setTelefon] = useState(user?.telefon || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [initial, setInitial] = useState({ email: "", telefon: "" });

  const unavailable = user?.role === "ucenik" || user?.role === "admin";

  useEffect(() => {
    if (!user) return;

    const loadContact = async () => {
      try {
        const { data: me } = await api.get("/me");

        if (me.role === "roditelj" && me.parent_model) {
          setEmail(me.email || "");
          setTelefon(me.parent_model.telefon || "");
          setInitial({ email: me.email, telefon: me.parent_model.telefon });
        } else if (me.role === "nastavnik" && me.teacher) {
          setEmail(me.email || "");
          setTelefon(me.teacher.telefon || "");
          setInitial({ email: me.email, telefon: me.teacher.telefon });
        } else if (me.role === "ucenik" && me.student) {
          setEmail(me.email || "");
          setTelefon(me.student.telefon || "");
          setInitial({ email: me.email, telefon: me.student.telefon });
        } else {
          setEmail(me.email || "");
          setTelefon("");
          setInitial({ email: "", telefon: "" });
        }
      } catch (e) {
        console.error("Greška pri učitavanju profila:", e);
      }
    };

    loadContact();
  }, [user]);

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSave = async () => {
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

    try {
      if (user.role === "roditelj") {
        const parentId = await fetchMyParentId();
        if (!parentId) {
          setError("Nije pronađen nalog roditelja za ovog korisnika.");
          return;
        }
        await api.put(`/parents/${parentId}`, {
          email: email.trim(),
          telefon: telefon.trim(),
        });
      } else if (user.role === "nastavnik") {
        const teacherId = await fetchMyTeacherId();
        if (!teacherId) {
          setError("Nije pronađen nalog nastavnika za ovog korisnika.");
          return;
        }
        await api.put(`/teachers/${teacherId}`, {
          email: email.trim(),
          telefon: telefon.trim(),
        });
      }

      const updated = { ...user, email: email.trim(), telefon: telefon.trim() };
      setUser(updated);
      setInitial({ email: email, telefon: telefon });
      setMessage("Podaci su sačuvani.");
    } catch (e) {
      const apiErr = e?.response?.data;
      if (apiErr?.errors) {
        const firstKey = Object.keys(apiErr.errors)[0];
        setError(apiErr.errors[firstKey]?.[0] || "Greška pri čuvanju.");
      } else if (apiErr?.message) {
        setError(apiErr.message);
      } else {
        setError("Greška pri čuvanju.");
      }
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
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

        {unavailable ? (
          <>
            <div className="card">
              <h3 className="card-title">Kontakt</h3>
              <div className="card-body">
                <div className="input-wrap">
                  <label>Email</label>
                  <input className="input" value={email} readOnly />
                </div>

                <div className="input-wrap" style={{ marginTop: 12 }}>
                  <label>Telefon</label>
                  <input className="input" value={telefon} readOnly />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      <AppButton variant="danger" onClick={handleLogout}>
        Odjavi se
      </AppButton>
    </div>
  );
}
