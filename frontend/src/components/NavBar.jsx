import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = String(user?.role || "").trim().toLowerCase();
  const canSeeStudents = role === "nastavnik" || role === "admin";

  if (pathname === "/login") {
    return (
      <nav className="navbar">
        <h1 className="brand">e-Dnevnik</h1>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <h1 className="brand">e-Dnevnik</h1>
      <ul className="nav">
        <li><NavLink to="/home">Početna</NavLink></li>
        {canSeeStudents && (
          <li><NavLink to="/students">Učenici</NavLink></li>
        )}
        <li> <NavLink to="/profile">Profil</NavLink></li>
      </ul>
    </nav>
  );
}
