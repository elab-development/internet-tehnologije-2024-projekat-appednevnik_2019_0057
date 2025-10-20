import { useEffect, useState, useMemo } from "react";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useLocalStorage } from "../hooks/useLocalStorage";
import api from "../api/axios";

export default function Student() {
  const [user] = useLocalStorage("user", null);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);

  const canEdit = user?.role === "roditelj";

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!user) return;
      setLoading(true);
      setMsg("");
      setErr("");

      try {
        const { data: me } = await api.get("/me");

        if (me.role === "ucenik" && me.student) {
          setChildren([]);
          setSelectedChildId(me.student.id);
        } else if (me.role === "roditelj") {
          const kids = Array.isArray(me.parent_model?.students)
            ? me.parent_model.students
            : [];
          setChildren(kids);
          setSelectedChildId(kids[0]?.id ?? null); // podrazumevano prvo dete
        } else {
          setChildren([]);
          setSelectedChildId(null);
        }

        if (!cancelled) setLoading(false);
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setErr("Greška pri učitavanju podataka.");
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    const loadStudent = async () => {
      if (!selectedChildId) {
        setStudent(null);
        return;
      }
      setLoading(true);
      setErr("");
      setMsg("");

      try {
        const { data: s } = await api.get(`/students/${selectedChildId}`);
        if (cancelled) return;

        setStudent(s);
        setEmail(s?.user?.email ?? "");
        setTelefon(s?.telefon ?? "");
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setErr("Nije pronađen učenik za prikaz.");
          setLoading(false);
        }
      }
    };

    loadStudent();
    return () => {
      cancelled = true;
    };
  }, [selectedChildId]);

  const avg = useMemo(() => {
    const gs = student?.grades ?? [];
    if (!gs.length) return "—";
    const sum = gs.reduce((acc, g) => acc + Number(g.ocena || 0), 0);
    return (sum / gs.length).toFixed(2);
  }, [student]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="container page">
        <p>Učitavanje…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container page">
        <p style={{ color: "#c00" }}>{err}</p>
      </div>
    );
  }

  if (!student)
    return (
      <div className="container page">
        <p>Nije pronađen učenik.</p>
      </div>
    );

  const handleSave = async () => {
    try {
      setMsg("");
      setErr("");

      const payload = {
        ...(email?.trim() ? { email: email.trim() } : {}),
        ...(telefon?.trim() ? { telefon: telefon.trim() } : {}),
      };

      const { data } = await api.put(`/students/${student.id}`, payload);
      setStudent(data.student);
      setEmail(data.student?.user?.email ?? email);
      setTelefon(data.student?.telefon ?? telefon);
      setMsg("Podaci deteta su sačuvani.");
    } catch (e) {
      console.error(e);
      const apiMsg =
        e?.response?.data?.message ||
        (e?.response?.data?.errors && JSON.stringify(e.response.data.errors)) ||
        "Greška pri čuvanju.";
      setErr(apiMsg);
    }
  };

  const name = student?.user?.name || student?.ime || "Učenik";

  return (
    <div className="container page">
      <h1>Učenik</h1>

      {user?.role === "roditelj" && children.length > 0 && (
        <div className="input-wrap" style={{ maxWidth: 360 }}>
          <label>Izaberi dete</label>
          <select
            className="input"
            value={selectedChildId ?? ""}
            onChange={(e) => setSelectedChildId(Number(e.target.value))}
          >
            {children.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.user?.name.trim() || `Učenik #${ch.id}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid">
        <AppCard title="Osnovni podaci">
          <p>
            <strong>Ime i prezime:</strong> {name}
          </p>
          <p>
            <strong>Razred:</strong> {student.razred ?? "-"}
          </p>
          <p>
            <strong>Prosek:</strong> {avg}
          </p>
        </AppCard>

        {canEdit ? (
          <>
            <AppCard title="Kontakt">
              <AppInput
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error=""
              />
              <AppInput
                label="Telefon"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                error=""
              />

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <AppButton variant="primary" onClick={handleSave}>
                  Sačuvaj
                </AppButton>
                <AppButton
                  variant="default"
                  onClick={() => {
                    setEmail(student?.user?.email ?? "");
                    setTelefon(student?.telefon ?? "");
                  }}
                >
                  Poništi promene
                </AppButton>
              </div>

              {msg && <p style={{ color: "green", marginTop: 8 }}>{msg}</p>}
              {err && <p style={{ color: "#c00", marginTop: 8 }}>{err}</p>}
            </AppCard>
          </>
        ) : (
          <AppCard title="Kontakt">
            <div className="input-wrap">
              <label>Email</label>
              <input className="input" value={email} readOnly />
            </div>
            <div className="input-wrap" style={{ marginTop: 12 }}>
              <label>Telefon</label>
              <input className="input" value={telefon} readOnly />
            </div>
          </AppCard>
        )}

        <AppCard title="Ocene">
          {!student.grades?.length ? (
            <p>Nema upisanih ocena.</p>
          ) : (
            <ul style={{ paddingLeft: 18 }}>
              {student.grades.map((g) => {
                const subj =
                  g?.teacher?.subject?.naziv ??
                  `#${g?.teacher?.subject_id ?? "?"}`;
                return (
                  <li key={g.id}>
                    {subj} — <strong>{g.ocena}</strong>{" "}
                    <span style={{ opacity: 0.7 }}>({g.datum})</span>
                  </li>
                );
              })}
            </ul>
          )}
        </AppCard>
      </div>
    </div>
  );
}
