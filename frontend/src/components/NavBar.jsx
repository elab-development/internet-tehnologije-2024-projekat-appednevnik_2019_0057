import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <h1 className="brand">e-Dnevnik</h1>
      <ul className="nav">
        <li>
          <NavLink to="/" end>
            Početna
          </NavLink>
        </li>
        <li>
          <NavLink to="/students">Učenici</NavLink>
        </li>
        <li>
          <NavLink to="/profile">Profil</NavLink>
        </li>
      </ul>
    </nav>
  );
}