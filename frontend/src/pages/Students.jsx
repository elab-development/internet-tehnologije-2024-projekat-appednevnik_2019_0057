import { useState, useMemo, useEffect } from "react";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import AppModal from "../components/AppModal";
import AppButton from "../components/AppButton";
import { STUDENTS } from "../data/students";
import { DEFAULT_SUBJECTS } from "../data/subjects";
import { DEFAULT_GRADES_MAP } from "../data/grades";


const LS_SUBJECTS = "subjects";
const LS_GRADES = "grades";

function loadSubjects() {
  const raw = localStorage.getItem(LS_SUBJECTS);
  if (!raw) return DEFAULT_SUBJECTS;
  try { return JSON.parse(raw); } catch { return DEFAULT_SUBJECTS; }
}

function loadGradesMap() {
  try { return JSON.parse(localStorage.getItem(LS_GRADES) || "{}"); }
  catch { return {}; }
}
function saveGradesMap(map) {
  localStorage.setItem(LS_GRADES, JSON.stringify(map));
}

export default function Students() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const perPage = 4;

  const [subjects, setSubjects] = useState(loadSubjects());
  const [gradesMap, setGradesMap] = useState(loadGradesMap());

  const [predmetId, setPredmetId] = useState("");
  const [ocena, setOcena] = useState("5");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = String(user?.role || "").trim().toLowerCase();
  const canSeeStudents = role === "nastavnik";

  useEffect(() => {
  const raw = localStorage.getItem(LS_GRADES);
  if (!raw) {
    localStorage.setItem(LS_GRADES, JSON.stringify(DEFAULT_GRADES_MAP));
    setGradesMap(DEFAULT_GRADES_MAP);
  }
}, []);

  useEffect(() => {
    const sub = loadSubjects();
    setSubjects(sub);
  }, []);

  useEffect(() => {
    saveGradesMap(gradesMap);
  }, [gradesMap]);

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

  const gradesFor = (studentId) => gradesMap[String(studentId)] || [];

  const avgFor = (studentId) => {
    const gs = gradesFor(studentId);
    if (!gs.length) return "—";
    const sum = gs.reduce((acc, g) => acc + Number(g.ocena || 0), 0);
    return (sum / gs.length).toFixed(2);
  };

  const addGrade = () => {
    if (!selectedStudent) return;
    const sid = String(selectedStudent.id);
    const pid = Number(predmetId);
    const oc = Number(ocena);

    if (!pid || !oc) { alert("Izaberi predmet i ocenu."); return; }

    const now = new Date().toISOString().slice(0, 10);
    const entry = { predmetId: pid, ocena: oc, datum: now };

    setGradesMap(prev => {
      const copy = { ...prev };
      copy[sid] = [...(copy[sid] || []), entry];
      return copy;
    });

    setPredmetId("");
    setOcena("5");
  };

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
                  onClick: () => {
                    setSelectedStudent(u);
                    setPredmetId("");
                    setOcena("5");
                  },
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
                <strong>Prosek:</strong> {avgFor(u.id)}
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
            <p><strong>Razred:</strong> {selectedStudent.razred}</p>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <p><strong>Telefon:</strong> {selectedStudent.telefon}</p>

            <hr style={{ margin: "12px 0", opacity: .3 }} />

            <h4>Ocene</h4>
            {gradesFor(selectedStudent.id).length === 0 ? (
              <p>Nema upisanih ocena.</p>
            ) : (
              <ul style={{ paddingLeft: 18 }}>
                {gradesFor(selectedStudent.id).map((g, idx) => {
                  const subj = subjects.find(s => s.id === g.predmetId)?.naziv || `#${g.predmetId}`;
                  return (
                    <li key={idx}>
                      {subj} — <strong>{g.ocena}</strong> <span style={{ opacity: .7 }}>({g.datum})</span>
                    </li>
                  );
                })}
              </ul>
            )}

            <p style={{ marginTop: 8 }}>
              <strong>Prosek:</strong> {avgFor(selectedStudent.id)}
            </p>

            {canSeeStudents && (<>
            <div className="input-wrap" style={{ marginTop: 12 }}>
              <label>Predmet</label>
              <select
                className="input"
                value={predmetId}
                onChange={(e) => setPredmetId(e.target.value)}
              >
                <option value="">— izaberi predmet —</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.naziv}</option>
                ))}
              </select>
            </div>

            <div className="input-wrap" style={{ marginTop: 12 }}>
              <label>Ocena</label>
              <select
                className="input"
                value={ocena}
                onChange={(e) => setOcena(e.target.value)}
              >
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <AppButton variant="primary" onClick={addGrade}>Dodaj ocenu</AppButton>
            </div>
            </>)}
          </>
        )}
      </AppModal>
    </div>
  );
}
