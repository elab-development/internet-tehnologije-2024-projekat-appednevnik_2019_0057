import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState(""); 

  const [telefon, setTelefon] = useState(""); 
  const [razred, setRazred] = useState(""); 
  const [parentId, setParentId] = useState(""); 

  const [childId, setChildId] = useState(""); 
  const [subjectId, setSubjectId] = useState(""); 

  const [students, setStudents] = useState([]); 
  const [subjects, setSubjects] = useState([]); 

  const [loadingLists, setLoadingLists] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); 


  useEffect(() => {
    const fetchData = async () => {
      setErr("");
      setFieldErrors({});
      setLoadingLists(true);

      try {
        if (role === "roditelj") {
          const { data } = await api.get("/public/students-free");
          setStudents(Array.isArray(data) ? data : []);
        } else {
          setStudents([]);
          setChildId("");
        }

        if (role === "nastavnik") {
          const { data } = await api.get("/subjects", {
            params: { per_page: 1000 },
          });
          const list = Array.isArray(data) ? data : data.data ?? [];
          setSubjects(list);
        } else {
          setSubjects([]);
          setSubjectId("");
        }
      } catch (e) {
        console.error(e);
        setErr("Greška pri učitavanju podataka za registraciju.");
      } finally {
        setLoadingLists(false);
      }
    };

    if (role) fetchData();
    setTelefon("");
    setRazred("");
    setParentId("");
    setChildId("");
    setSubjectId("");
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setFieldErrors({});
    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password: password, 
        role,
      };

      if (telefon.trim()) payload.telefon = telefon.trim();

      if (role === "roditelj") {
        if (childId) payload.child_id = Number(childId);
      }

      if (role === "nastavnik") {
        if (subjectId) payload.subject_id = Number(subjectId);
      }

      if (role === "ucenik") {
        if (razred.trim()) payload.razred = razred.trim();
      }

      const { data } = await api.post("/register", payload);

      alert("Registracija uspešna. Prijavite se svojim nalogom.");
      navigate("/login");
    } catch (e) {
      console.error(e);
      const res = e?.response?.data;
      if (res?.errors) {
        setFieldErrors(res.errors);
      } else {
        setErr(res?.message || "Greška prilikom registracije.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page">
      <h1>Registracija</h1>

      {err && <p style={{ color: "#c00", marginBottom: 12 }}>{err}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <AppInput
          label="Ime i prezime"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name?.[0]}
        />

        <AppInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email?.[0]}
        />

        <AppInput
          label="Lozinka"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password?.[0]}
        />

        {/* Rola */}
        <div className="input-wrap" style={{ marginTop: 12 }}>
          <label>Uloga</label>
          <select
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">— izaberite ulogu —</option>
            <option value="ucenik">Učenik</option>
            <option value="roditelj">Roditelj</option>
            <option value="nastavnik">Nastavnik</option>
          </select>
          {fieldErrors.role && (
            <span className="error-text">{fieldErrors.role[0]}</span>
          )}
        </div>

        {(role === "roditelj" || role === "ucenik") && (
          <AppInput
            label="Telefon"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            error={fieldErrors.telefon?.[0]}
          />
        )}

        {role === "roditelj" && (
          <div className="input-wrap" style={{ marginTop: 12 }}>
            <label>Dete (učenik bez roditelja)</label>
            <select
              className="input"
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              disabled={loadingLists || students.length === 0}
            >
              <option value="">
                {loadingLists
                  ? "Učitavanje..."
                  : students.length === 0
                  ? "Nema učenika bez dodeljenog roditelja"
                  : "— izaberite dete —"}
              </option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user?.name || `Učenik #${s.id}`}
                </option>
              ))}
            </select>
            {fieldErrors.child_id && (
              <span className="error-text">{fieldErrors.child_id[0]}</span>
            )}
          </div>
        )}

        {role === "nastavnik" && (
          <div className="input-wrap" style={{ marginTop: 12 }}>
            <label>Predmet</label>
            <select
              className="input"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={loadingLists}
            >
              <option value="">
                {loadingLists ? "Učitavanje..." : "— izaberite predmet —"}
              </option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.naziv}
                </option>
              ))}
            </select>
            {fieldErrors.subject_id && (
              <span className="error-text">{fieldErrors.subject_id[0]}</span>
            )}
          </div>
        )}

        {role === "ucenik" && (
          <AppInput
            label="Razred (npr. I-1)"
            value={razred}
            onChange={(e) => setRazred(e.target.value)}
            error={fieldErrors.razred?.[0]}
          />
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <AppButton type="submit" variant="primary" onClick={undefined}>
            {submitting ? "Slanje…" : "Registruj se"}
          </AppButton>

          <Link to="/login" className="btn">
            Nazad na prijavu
          </Link>
        </div>
      </form>
    </div>
  );
}
