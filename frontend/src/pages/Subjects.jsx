import { useEffect, useState } from "react";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import api from "../api/axios";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [naziv, setNaziv] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  async function fetchSubjects() {
    try {
      setLoading(true);
      setMsg("");
      setError("");
      const { data } = await api.get("/subjects");
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setSubjects(list);
      setSubjects(list.sort((a, b) => a.id - b.id));
    } catch (e) {
      console.error(e);
      setError("Greška pri učitavanju predmeta.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    fetchSubjects();
  }, [isAdmin]);

  const handleAdd = async () => {
    const name = naziv.trim();
    setError("");
    setMsg("");
    if (!name) {
      setError("Naziv je obavezan.");
      return;
    }

    try {
      const { data: created } = await api.post("/subjects", { naziv: name });
      setSubjects((prev) => [...prev, created].sort((a, b) => a.id - b.id));
      setNaziv("");
      setMsg("Predmet je dodat.");
    } catch (e) {
      console.error(e);
      const v = e?.response?.data;
      if (v?.errors?.naziv?.length) setError(v.errors.naziv[0]);
      else setError(v?.message || "Greška pri dodavanju predmeta.");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Obrisati predmet? Ovo će ukloniti i ocene za taj predmet."
      )
    )
      return;
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      setMsg("Predmet je obrisan.");
      setError("");
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || "Greška pri brisanju predmeta.");
    }
  };

  return (
    <div className="container page">
      <h1>Predmeti</h1>

      {!isAdmin && (
        <p style={{ color: "#c00" }}>
          Samo administrator može da pristupi ovoj stranici.
        </p>
      )}

      {isAdmin && (
        <>
          <AppCard title="Dodaj predmet">
            <div className="inline-form">
              <AppInput
                label="Naziv predmeta"
                value={naziv}
                onChange={(e) => setNaziv(e.target.value)}
                error={error}
              />
              <AppButton variant="primary" onClick={handleAdd}>
                Dodaj
              </AppButton>
            </div>
            {msg && <p style={{ color: "green", marginTop: 8 }}>{msg}</p>}
          </AppCard>

          {loading ? (
            <p>Učitavanje…</p>
          ) : (
            <div className="grid" style={{ marginTop: 16 }}>
              {subjects.map((s) => (
                <AppCard
                  key={s.id}
                  title={s.naziv}
                  actions={[
                    {
                      label: "Obriši",
                      variant: "danger",
                      onClick: () => handleDelete(s.id),
                    },
                  ]}
                >
                  <p>
                    <strong>ID:</strong> {s.id}
                  </p>
                </AppCard>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
