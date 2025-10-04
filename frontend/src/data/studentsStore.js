import { STUDENTS as SEED_STUDENTS } from "./students";

const LS_STUDENTS = "students_data";

export function ensureStudentsSeeded() {
  if (!localStorage.getItem(LS_STUDENTS)) {
    localStorage.setItem(LS_STUDENTS, JSON.stringify(SEED_STUDENTS));
  }
}

export function getAllStudents() {
  ensureStudentsSeeded();
  try {
    return JSON.parse(localStorage.getItem(LS_STUDENTS)) || [];
  } catch {
    return [];
  }
}

export function getStudentById(id) {
  const all = getAllStudents();
  return all.find(s => s.id === Number(id)) || null;
}

export function updateStudent(id, patch) {
  const all = getAllStudents();
  const idx = all.findIndex(s => s.id === Number(id));
  if (idx === -1) return false;

  all[idx] = { ...all[idx], ...patch };
  localStorage.setItem(LS_STUDENTS, JSON.stringify(all));
  return true;
}

export function resetStudentsToSeed() {
  localStorage.setItem(LS_STUDENTS, JSON.stringify(SEED_STUDENTS));
}