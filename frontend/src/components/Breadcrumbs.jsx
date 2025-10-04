import { Link, useLocation } from "react-router-dom";

function getUser() {
  try { return JSON.parse(localStorage.getItem("user") || "null"); }
  catch { return null; }
}

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const user = getUser();
  const homeHref = user ? "/home" : "/login";

  const ROUTE_MAP = {
    "/home":    [{ href: homeHref, label: "Početna" }],
    "/students":[{ href: homeHref, label: "Početna" }, { href: "/students", label: "Učenici" }],
    "/student": [{ href: homeHref, label: "Početna" }, { href: "/student",  label: "Učenik" }],
    "/profile": [{ href: homeHref, label: "Početna" }, { href: "/profile",  label: "Profil" }],
    "/subjects":[{ href: homeHref, label: "Početna" }, { href: "/subjects", label: "Predmeti" }],
    "/login":   [{ href: "/login", label: "Prijava" }],
  };

  const clean = pathname.replace(/\/+$/, "") || "/";

  const matchKey =
    Object.keys(ROUTE_MAP)
      .sort((a, b) => b.length - a.length)
      .find((key) => clean === key || clean.startsWith(key + "/")) || (user ? "/home" : "/login");

  const items = ROUTE_MAP[matchKey] || [{ href: homeHref, label: "Početna" }];

  if (pathname === "/login") return null;

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
