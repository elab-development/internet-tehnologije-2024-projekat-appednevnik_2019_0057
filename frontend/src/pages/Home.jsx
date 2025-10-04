import AppCard from "../components/AppCard";
import { useMemo, useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STUDENTS } from "../data/students";
import { DEFAULT_GRADES_MAP } from "../data/grades";

const OBAVESTENJA = [
  {
    id: 1,
    naslov: "Roditeljski sastanak",
    tekst: "Petak, 06.10. u 18:00, učionica 3-2.",
    tip: "warning",
    datum: "2025-10-06",
  },
  {
    id: 2,
    naslov: "Kontrolni iz matematike",
    tekst: "Četvrtak, 12.10. — oblasti: razlomci i procenti.",
    tip: "danger",
    datum: "2025-10-12",
  },
  {
    id: 3,
    naslov: "Sportski dan",
    tekst: "Utorak, 17.10. — okupljanje u 09:00 na školskom igralištu.",
    tip: "info",
    datum: "2025-10-17",
  },
];

const tipToClass = {
  info: "card-info",
  warning: "card-warning",
  danger: "card-danger",
};

const LS_GRADES = "grades";

export default function Home() {
  const [user] = useLocalStorage("user", null);
  const [gradesMap, setGradesMap] = useState({});

  const today = new Date().toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
    const load = () => {
      try {
       const raw = localStorage.getItem(LS_GRADES);
       setGradesMap(raw ? JSON.parse(raw) : DEFAULT_GRADES_MAP);
      } catch {
        setGradesMap({});
      }
    };

    load();

    const onStorage = (e) => {
      if (e.key === LS_GRADES) {
       load();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const stats = useMemo(() => {
    const total = STUDENTS.length;
    let sum = 0;
    let count = 0;

    STUDENTS.forEach((u) => {
      const gs = gradesMap[String(u.id)] || [];
      if (gs.length) {
        sum += gs.reduce((acc, g) => acc + Number(g.ocena || 0), 0);
        count += gs.length;
      }
    });

    const avg = count > 0 ? (sum / count) : 0;
    const gradesCount = new Set(STUDENTS.map((u) => u.razred)).size;

    return {
      total,
      avg: avg.toFixed(2),
      gradesCount,
    };
  }, [gradesMap]);

  return (
    <section className="container page">
      <h1>Dobrodošli u e-Dnevnik</h1>
      <p style={{ opacity: 0.8, marginTop: 4 }}>
        {today}
        {user?.name ? ` • Prijavljeni korisnik: ${user.name}` : ""}
      </p>
      <h2 style={{ marginTop: "2rem" }}>Obaveštenja / Najave</h2>
      <div className="grid">
        {OBAVESTENJA.map((o) => (
          <AppCard key={o.id} title={o.naslov} className={tipToClass[o.tip]}>
            <p>{o.tekst}</p>
            {o.datum && (
              <p style={{ opacity: 0.8, fontSize: 14, marginTop: 8 }}>
                Datum: {o.datum}
              </p>
            )}
          </AppCard>
        ))}
      </div>
     
     {(user?.role === "nastavnik" || user?.role === "admin") && (
        <>
      <h3 style={{ marginTop: "1.25rem" }}>Statistika</h3>
      <div className="stats-grid">
        <div className="stat">
          <div className="stat-label">Ukupno učenika</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Prosečna ocena</div>
          <div className="stat-value">{stats.avg}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Broj razreda</div>
          <div className="stat-value">{stats.gradesCount}</div>
        </div>
      </div>
      </>
      )}
    </section>
  );
}
