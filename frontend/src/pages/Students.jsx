import { useState, useEffect, useCallback } from "react";
import AppCard from "../components/AppCard";
import AppInput from "../components/AppInput";
import AppModal from "../components/AppModal";
import AppButton from "../components/AppButton";
import api from "../api/axios";

export default function Students() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 4;

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [adding, setAdding] = useState(false);
  const [ocena, setOcena] = useState("5");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = String(user?.role || "")
    .trim()
    .toLowerCase();
  const canAddGrade = role === "nastavnik";
  const canExport = role === "nastavnik" || role === "admin";

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");
      const { data } = await api.get("/students", {
        params: { q: search, page, per_page: perPage },
      });
      const list = Array.isArray(data) ? data : data.data ?? [];
      setItems(list);
      setMeta({
        current_page: data.current_page ?? 1,
        last_page: data.last_page ?? 1,
        total: data.total ?? list.length,
      });
    } catch (e) {
      console.error(e);
      setErr("Greška pri učitavanju učenika.");
    } finally {
      setLoading(false);
    }
  }, [search, page, perPage]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchStudents();
    }, 300);
    return () => clearTimeout(t);
  }, [search, fetchStudents]);

  const openDetails = async (student) => {
    try {
      setErr("");
      const { data } = await api.get(`/students/${student.id}`);
      setSelectedStudent(data);
      setOcena("5");
    } catch (e) {
      console.error(e);
      setErr("Greška pri učitavanju detalja učenika.");
    }
  };

  const closeDetails = () => setSelectedStudent(null);

  const avgFor = (student) => {
    const gs = student?.grades ?? [];
    if (!gs.length) return "—";
    const sum = gs.reduce((acc, g) => acc + Number(g.ocena || 0), 0);
    return (sum / gs.length).toFixed(2);
  };

  const addGrade = async () => {
    if (!selectedStudent) return;
    try {
      setAdding(true);
      setErr("");

      const payload = {
        student_id: selectedStudent.id,
        ocena: Number(ocena),
      };
      await api.post("/grades", payload);

      const { data } = await api.get(`/students/${selectedStudent.id}`);
      setSelectedStudent(data);
      setOcena("5");
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        (e?.response?.data?.errors && JSON.stringify(e.response.data.errors)) ||
        "Greška pri dodavanju ocene.";
      setErr(msg);
    } finally {
      setAdding(false);
    }
  };

  const handleExport = async (student) => {
    try {
      setErr("");
      const res = await api.get(`/students/${student.id}/export`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "text/csv;charset=utf-8;",
      });

      const filenameSafeName = (student?.user?.name || "ucenik").replace(
        /\s+/g,
        "_"
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ocene_${filenameSafeName}_${student.id}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setErr(
        e?.response?.data?.message ||
          "Greška pri eksportu CSV fajla za učenika."
      );
    }
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
          }}
        />
      </div>

      {err && <p style={{ color: "#c00" }}>{err}</p>}
      {loading ? (
        <p>Učitavanje…</p>
      ) : (
        <>
          <div className="grid">
            {items.length > 0 ? (
              items.map((u) => {
                const actions = [
                  {
                    label: "Detalji",
                    variant: "primary",
                    onClick: () => openDetails(u),
                  },
                ];

                return (
                  <AppCard key={u.id} title={u.user?.name} actions={actions}>
                    <p>
                      <strong>Razred:</strong> {u.razred ?? "-"}
                    </p>
                    <p>
                      <strong>Prosek:</strong> {avgFor(u)}
                    </p>
                    <p>
                      <strong>Email:</strong> {u.user?.email ?? "-"}
                    </p>
                    <p>
                      <strong>Telefon:</strong> {u.telefon ?? "-"}
                    </p>
                  </AppCard>
                );
              })
            ) : (
              <p>Nema učenika koji odgovaraju pretrazi.</p>
            )}
          </div>
          <div className="pagination">
            <button
              disabled={meta.current_page <= 1 || items.length === 0}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="btn"
            >
              Prethodna
            </button>

            <span>
              Strana {items.length === 0 ? 0 : meta.current_page} /{" "}
              {items.length === 0 ? 0 : meta.last_page}
            </span>

            <button
              disabled={
                meta.current_page >= meta.last_page || items.length === 0
              }
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              className="btn"
            >
              Sledeća
            </button>
          </div>
        </>
      )}

      <AppModal
        open={!!selectedStudent}
        onClose={closeDetails}
        title={selectedStudent?.user?.name || "Učenik"}
      >
        {selectedStudent && (
          <>
            <p>
              <strong>Razred:</strong> {selectedStudent.razred ?? "-"}
            </p>
            <p>
              <strong>Email:</strong> {selectedStudent.user?.email ?? "-"}
            </p>
            <p>
              <strong>Telefon:</strong> {selectedStudent.telefon ?? "-"}
            </p>

            <hr style={{ margin: "12px 0", opacity: 0.3 }} />

            <h4>Ocene</h4>
            {!selectedStudent.grades?.length ? (
              <p>Nema upisanih ocena.</p>
            ) : (
              <ul style={{ paddingLeft: 18 }}>
                {selectedStudent.grades.map((g) => {
                  const subj =
                    g?.teacher?.subject?.naziv ??
                    `#${g?.teacher?.subject_id ?? "?"}`;
                  return (
                    <li key={g.id}>
                      {subj} — <strong>{g.ocena}</strong>{" "}
                      <span style={{ opacity: 0.7 }}>({g.datum})</span>
                    </li>
                  );
                })}
              </ul>
            )}

            <p style={{ marginTop: 8 }}>
              <strong>Prosek:</strong> {avgFor(selectedStudent)}
            </p>

            {canExport && (
              <div style={{ marginTop: 12 }}>
                <AppButton
                  variant="default"
                  onClick={() => handleExport(selectedStudent)}
                >
                  Export CSV
                </AppButton>
              </div>
            )}

            {canAddGrade && (
              <>
                <div className="input-wrap" style={{ marginTop: 12 }}>
                  <label>Ocena</label>
                  <select
                    className="input"
                    value={ocena}
                    onChange={(e) => setOcena(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <AppButton
                    variant="primary"
                    onClick={addGrade}
                    disabled={adding}
                  >
                    {adding ? "Dodavanje ocene…" : "Dodaj ocenu"}
                  </AppButton>
                </div>
              </>
            )}
          </>
        )}
      </AppModal>
    </div>
  );
}
