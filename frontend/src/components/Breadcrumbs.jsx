import { Link, useLocation } from "react-router-dom";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const user = getUser();
  const homeHref = user ? "/home" : "/login";

  const ROUTE_MAP = {
    "/home": [{ href: "/home", label: "Početna" }],
    "/students": [
      { href: "/home", label: "Početna" },
      { href: "/students", label: "Učenici" },
    ],
    "/student": [
      { href: "/home", label: "Početna" },
      { href: "/student", label: "Učenik" },
    ],
    "/profile": [
      { href: "/home", label: "Početna" },
      { href: "/profile", label: "Profil" },
    ],
    "/subjects": [
      { href: "/home", label: "Početna" },
      { href: "/subjects", label: "Predmeti" },
    ],
    "/login": [{ href: "/login", label: "Prijava" }],
    "/register": [
      { href: "/login", label: "Prijava" },
      { href: "/register", label: "Registracija" },
    ],
  };

  const clean = pathname.replace(/\/+$/, "") || "/";

  const matchKey =
    Object.keys(ROUTE_MAP)
      .sort((a, b) => b.length - a.length)
      .find((key) => clean === key || clean.startsWith(key + "/")) ||
    (user ? "/home" : "/login");

  if (matchKey === "/login") return null;

  const itemsRaw = ROUTE_MAP[matchKey] || ROUTE_MAP["/home"];
  const items = itemsRaw.map((it, idx) =>
    idx === 0 ? { ...it, href: homeHref } : it
  );

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
