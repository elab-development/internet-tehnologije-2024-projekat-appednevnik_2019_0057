import AppCard from "../components/AppCard";
import { STUDENTS } from "../data/students";

export default function Students() {
  const handleDetails = (u) => alert(`Detalji:\n${u.ime} • ${u.razred} • Prosek: ${u.prosek}`);
  const handleMessage = (u) => alert(`Poruka poslata: ${u.email}`);

  return (
      <div className="container page">
        <h1>Učenici</h1>
        <div className="grid">
          {STUDENTS.map((u) => (
            <AppCard
              key={u.id}
              title={u.ime}
              actions={[
                { label: "Detalji", variant: "primary", onClick: () => handleDetails(u) },
                { label: "Poruka",  variant: "default", onClick: () => handleMessage(u) }
              ]}
            >
              <p><strong>Razred:</strong> {u.razred}</p>
              <p><strong>Prosek:</strong> {u.prosek.toFixed(2)}</p>
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Telefon:</strong> {u.telefon}</p>
            </AppCard>
          ))}
        </div>
      </div>
  );
}