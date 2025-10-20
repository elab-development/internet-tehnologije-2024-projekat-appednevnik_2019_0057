import AppCard from "../components/AppCard";
import { useMemo, useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import api from "../api/axios";

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

export default function Home() {
  const [userLS] = useLocalStorage("user", null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [grades, setGrades] = useState([]);

  const today = new Date().toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        const { data: meData } = await api.get("/me");
        if (cancelled) return;
        setMe(meData);

        if (meData.role === "nastavnik") {
          const { data } = await api.get("/grades", {
            params: { per_page: 1000 },
          });
          const list = Array.isArray(data) ? data : data.data ?? [];
          if (cancelled) return;
          setGrades(list);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setErr("Greška pri učitavanju podataka.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [userLS]);

  const subjectByClass = useMemo(() => {
    if (!me || me.role !== "nastavnik" || !grades.length)
      return { subjectName: "", rows: [] };

    const myTeacherId = me?.teacher?.id;
    const subjectName = me?.teacher?.subject?.naziv || "Moj predmet";

    const byClass = new Map();
    grades.forEach((g) => {
      if (!g?.teacher || g.teacher.id !== myTeacherId) return;
      const razred = g?.student?.razred || "—";
      const ocena = Number(g?.ocena || 0);
      if (!ocena) return;

      const rec = byClass.get(razred) || { sum: 0, cnt: 0 };
      rec.sum += ocena;
      rec.cnt += 1;
      byClass.set(razred, rec);
    });

    const rows = Array.from(byClass.entries())
      .map(([razred, { sum, cnt }]) => ({
        razred,
        avg: (sum / cnt).toFixed(2),
        cnt,
      }))
      .sort((a, b) => a.razred.localeCompare(b.razred, "sr"));

    return { subjectName, rows };
  }, [me, grades]);

  return (
    <section className="container page">
      <h1>Dobrodošli u e-Dnevnik</h1>
      <p style={{ opacity: 0.8, marginTop: 4 }}>
        {today}
        {me?.name ? ` • Prijavljeni korisnik: ${me.name}` : ""}
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

      {loading && <p style={{ marginTop: 16 }}>Učitavanje…</p>}
      {err && <p style={{ color: "#c00", marginTop: 16 }}>{err}</p>}

      {!loading && !err && me?.role === "nastavnik" && (
        <>
          <h3 style={{ marginTop: "1.5rem" }}>
            Prosek po odeljenjima — {subjectByClass.subjectName}
          </h3>

          {subjectByClass.rows.length === 0 ? (
            <p>Nema dovoljno podataka za statistiku.</p>
          ) : (
            <div className="grid" style={{ marginTop: 12 }}>
              {subjectByClass.rows.map((row) => (
                <AppCard key={row.razred} title={`Razred: ${row.razred}`}>
                  <p>
                    <strong>Prosečna ocena:</strong> {row.avg}
                  </p>
                  <p style={{ opacity: 0.8 }}>
                    <strong>Ukupno ocena:</strong> {row.cnt}
                  </p>
                </AppCard>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
