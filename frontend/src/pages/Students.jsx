import { useState, useMemo } from "react";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import { STUDENTS } from "../data/students";

export default function Students() {
  const [query, setQuery] = useState("");

  const handleDetails = (u) =>
    alert(`Detalji:\n${u.ime} • ${u.razred} • Prosek: ${u.prosek}`);
  const handleMessage = (u) => alert(`Poruka poslata: ${u.email}`);

  const filtered = useMemo(() => {
    return STUDENTS.filter(
      (u) =>
        u.ime.toLowerCase().includes(query.toLowerCase()) ||
        u.razred.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="container page">
      <h1>Učenici</h1>

      <div style={{ margin: "16px 0" }}>
        <AppInput
          label="Pretraga učenika"
          placeholder="Unesi ime ili razred..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid">
        {filtered.length > 0 ? (
          filtered.map((u) => (
            <AppCard
              key={u.id}
              title={u.ime}
              actions={[
                {
                  label: "Detalji",
                  variant: "primary",
                  onClick: () => handleDetails(u),
                },
                {
                  label: "Poruka",
                  variant: "default",
                  onClick: () => handleMessage(u),
                },
              ]}
            >
              <p>
                <strong>Razred:</strong> {u.razred}
              </p>
              <p>
                <strong>Prosek:</strong> {u.prosek.toFixed(2)}
              </p>
              <p>
                <strong>Email:</strong> {u.email}
              </p>
              <p>
                <strong>Telefon:</strong> {u.telefon}
              </p>
            </AppCard>
          ))
        ) : (
          <p>Nema učenika koji odgovaraju pretrazi.</p>
        )}
      </div>
    </div>
  );
}
