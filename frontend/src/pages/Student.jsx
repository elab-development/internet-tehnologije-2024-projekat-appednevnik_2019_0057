import { useEffect, useState, useMemo } from "react";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getStudentById, updateStudent, ensureStudentsSeeded } from "../data/studentsStore";
import { DEFAULT_SUBJECTS } from "../data/subjects";

const LS_GRADES = "grades";

function loadGradesMap() {
  try { return JSON.parse(localStorage.getItem(LS_GRADES) || "{}"); }
  catch { return {}; }
}

export default function Student() {
  const [user] = useLocalStorage("user", null);

  const studentId = useMemo(() => {
    if (!user) return null;
    if (user.role === "ucenik")   return user.studentId; 
    if (user.role === "roditelj") return user.childId;   
    return null;
  }, [user]);

  const [student, setStudent] = useState(null);

  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [msg, setMsg] = useState("");

  const canEdit = user?.role === "roditelj";

  const [gradesMap, setGradesMap] = useState({});
  const subjects = DEFAULT_SUBJECTS;

  useEffect(() => {
    ensureStudentsSeeded(); 
    setGradesMap(loadGradesMap());
  }, []);

  useEffect(() => {
    if (studentId) {
      const s = getStudentById(studentId);
      setStudent(s);
      setEmail(s?.email || "");
      setTelefon(s?.telefon || "");
    }
  }, [studentId]);

  const gradesFor = (sid) => gradesMap[String(sid)] || [];
  const avgFor = (sid) => {
    const gs = gradesFor(sid);
    if (!gs.length) return "—";
    const sum = gs.reduce((acc, g) => acc + Number(g.ocena || 0), 0);
    return (sum / gs.length).toFixed(2);
    };

  if (!user) return null;            
  if (!student) return <div className="container page"><p>Nije pronađen učenik.</p></div>;

  const handleSave = () => {
    setMsg("");
    const ok = updateStudent(student.id, { email: email.trim(), telefon: telefon.trim() });
    if (ok) {
      const s = getStudentById(student.id);
      setStudent(s);
      setMsg("Podaci deteta su sačuvani.");
    } else {
      setMsg("Greška pri čuvanju.");
    }
  };

  return (
    <div className="container page">
      <h1>Učenik</h1>

      <div className="grid">
        <AppCard title="Osnovni podaci">
          <p><strong>Ime i prezime:</strong> {student.ime}</p>
          <p><strong>Razred:</strong> {student.razred}</p>
          <p><strong>Prosek:</strong> {avgFor(student.id)}</p>
        </AppCard>

        {canEdit && (<>
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
                    <AppButton variant="primary" onClick={handleSave}>Sačuvaj</AppButton>
                    <AppButton variant="default" onClick={() => {
                        setEmail(student.email || "");
                        setTelefon(student.telefon || "");
                    }}>
                        Poništi promene
                    </AppButton>
                </div>

            {msg && <p style={{ color: "green", marginTop: 8 }}>{msg}</p>}
            </AppCard>          
        </>)}

        <AppCard title="Ocene">
          {gradesFor(student.id).length === 0 ? (
            <p>Nema upisanih ocena.</p>
          ) : (
            <ul style={{ paddingLeft: 18 }}>
              {gradesFor(student.id).map((g, idx) => {
                const subj = subjects.find(s => s.id === g.predmetId)?.naziv || `#${g.predmetId}`;
                return (
                  <li key={idx}>
                    {subj} — <strong>{g.ocena}</strong>{" "}
                    <span style={{ opacity: .7 }}>({g.datum})</span>
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