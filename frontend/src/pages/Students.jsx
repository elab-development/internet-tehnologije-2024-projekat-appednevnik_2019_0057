import { useState, useMemo } from "react";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import AppModal from "../components/AppModal";
import { STUDENTS } from "../data/students";

export default function Students() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const perPage = 4;

  const filtered = useMemo(() => {
    return STUDENTS.filter(
      (u) =>
        u.ime.toLowerCase().includes(search.toLowerCase()) ||
        u.razred.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const currentPageStudents = useMemo(() => {
    const startIndex = (safePage - 1) * perPage;
    return filtered.slice(startIndex, startIndex + perPage);
  }, [filtered, safePage]);

  return (
    <div className="container page">
      <h1>Učenici</h1>

      <div style={{ margin: "16px 0" }}>
        <AppInput
          label="Pretraga učenika"
          placeholder="Unesi ime ili razred..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="grid">
        {filtered.length > 0 ? (
          currentPageStudents.map((u) => (
            <AppCard
              key={u.id}
              title={u.ime}
              actions={[
                {
                  label: "Detalji",
                  variant: "primary",
                  onClick: () => setSelectedStudent(u),
                },
                {
                  label: "Poruka",
                  variant: "default",
                  onClick: () => alert(`Poruka poslata: ${u.email}`),
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
      <div className="pagination">
        <button
          disabled={safePage === 1 || filtered.length === 0}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="btn"
        >
          Prethodna
        </button>

        <span>
          Strana {filtered.length === 0 ? 0 : safePage} /{" "}
          {filtered.length === 0 ? 0 : totalPages}
        </span>

        <button
          disabled={safePage === totalPages || filtered.length === 0}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="btn"
        >
          Sledeća
        </button>
      </div>

      <AppModal
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent?.ime}
      >
        {selectedStudent && (
          <>
            <p>
              <strong>Razred:</strong> {selectedStudent.razred}
            </p>
            <p>
              <strong>Prosek:</strong> {selectedStudent.prosek.toFixed(2)}
            </p>
            <p>
              <strong>Email:</strong> {selectedStudent.email}
            </p>
            <p>
              <strong>Telefon:</strong> {selectedStudent.telefon}
            </p>
          </>
        )}
      </AppModal>
    </div>
  );
}
