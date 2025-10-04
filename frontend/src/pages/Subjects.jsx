import { useEffect, useMemo, useState } from "react";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { DEFAULT_SUBJECTS } from "../data/subjects";

const LS_SUBJECTS = "subjects";
const LS_GRADES = "grades"; 

function loadSubjects() {
  const raw = localStorage.getItem(LS_SUBJECTS);
  if (!raw) return DEFAULT_SUBJECTS;
  try { return JSON.parse(raw); } catch { return DEFAULT_SUBJECTS; }
}

function saveSubjects(list) {
  localStorage.setItem(LS_SUBJECTS, JSON.stringify(list));
}

function loadGradesMap() {
  try { return JSON.parse(localStorage.getItem(LS_GRADES) || "{}"); }
  catch { return {}; }
}

function saveGradesMap(map) {
  localStorage.setItem(LS_GRADES, JSON.stringify(map));
}

function removeSubjectFromGrades(subjectId) {
  const grades = loadGradesMap();
  let changed = false;
  for (const sid of Object.keys(grades)) {
    const before = grades[sid]?.length || 0;
    grades[sid] = (grades[sid] || []).filter(g => g.predmetId !== subjectId);
    if (grades[sid].length !== before) changed = true;
  }
  if (changed) saveGradesMap(grades);
}

function subjectAverage(subjectId) {
  const grades = loadGradesMap(); 
  const all = [];

  for (const sid of Object.keys(grades)) {
    for (const g of (grades[sid] || [])) {
      if (g.predmetId === subjectId) all.push(Number(g.ocena));
    }
  }

  if (!all.length) return "—";
  const avg = all.reduce((a, b) => a + b, 0) / all.length;
  return avg.toFixed(2);
}

export default function Subjects() {
  const [subjects, setSubjects] = useState(loadSubjects());
  const [naziv, setNaziv] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { saveSubjects(subjects); }, [subjects]);

  const nextId = useMemo(() => {
    return subjects.length ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
  }, [subjects]);

  const handleAdd = () => {
    const name = naziv.trim();
    setError("");
    if (!name) { setError("Naziv je obavezan."); return; }
    if (subjects.some(s => s.naziv.toLowerCase() === name.toLowerCase())) {
      setError("Predmet sa tim nazivom već postoji.");
      return;
    }
    setSubjects(prev => [...prev, { id: nextId, naziv: name }]);
    setNaziv("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Obrisati predmet? Ovo će ukloniti i ocene za taj predmet.")) return;
    setSubjects(prev => prev.filter(s => s.id !== id));
    removeSubjectFromGrades(id);
  };

  return (
    <div className="container page">
      <h1>Predmeti</h1>

      <AppCard title="Dodaj predmet">
        <div className="inline-form">
          <AppInput
            label="Naziv predmeta"
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
            error={error}
          />
          <AppButton variant="primary" onClick={handleAdd}>Dodaj</AppButton>
        </div>
      </AppCard>

      <div className="grid" style={{ marginTop: 16 }}>
        {subjects.map((s) => (
          <AppCard
            key={s.id}
            title={s.naziv}
            actions={[
              { label: "Obriši", variant: "danger", onClick: () => handleDelete(s.id) }
            ]}
          >
            <p><strong>ID:</strong> {s.id}</p>
            <p><strong>Prosek ocena (svi učenici):</strong> {subjectAverage(s.id)}</p>
          </AppCard>
        ))}
      </div>
    </div>
  );
}