import { Link, useLocation } from "react-router-dom";

const ROUTE_MAP = {
  "/": [{ href: "/", label: "Početna" }],
  "/home": [{ href: "/home", label: "Početna" }],
  "/students": [
    { href: "/", label: "Početna" },
    { href: "/students", label: "Učenici" },
  ],
  "/profile": [
    { href: "/", label: "Početna" },
    { href: "/profile", label: "Profil" },
  ],
  "/subjects": [
    { href: "/", label: "Početna" },
    { href: "/subjects", label: "Predmeti" },
  ],
  "/login": [
    { href: "/", label: "Početna" },
    { href: "/login", label: "Prijava" },
  ],
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();

  const clean = pathname.replace(/\/+$/, "") || "/";

  const matchKey =
    Object.keys(ROUTE_MAP)
      .sort((a, b) => b.length - a.length)
      .find((key) => clean === key || clean.startsWith(key + "/")) || "/";

  const items = ROUTE_MAP[matchKey] || ROUTE_MAP["/"];

  if (window.location.pathname === "/login") return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className={`crumb ${isLast ? "current" : ""}`}>
              {isLast ? (
                <span>{item.label}</span>
              ) : (
                <Link to={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
