import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function NavBar() {
  const [user] = useLocalStorage("user", null);
  return (
    <nav className="navbar">
      <h1 className="brand">e-Dnevnik</h1>
      <ul className="nav">
        <li>
          <NavLink to="/home">Početna</NavLink>
        </li>
        {user && (user.role === "nastavnik" || user.role === "admin") && (
          <li><NavLink to="/students">Učenici</NavLink></li>
        )}
        <li>
          <NavLink to="/profile">Profil</NavLink>
        </li>
      </ul>
    </nav>
  );
}
