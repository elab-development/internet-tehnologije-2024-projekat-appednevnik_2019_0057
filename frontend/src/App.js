import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Breadcrumbs from "./components/Breadcrumbs";
import Students from "./pages/Students";
import Student from "./pages/Student";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Subjects from "./pages/Subjects";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useEffect } from "react";
import api, { setAuthToken } from "./api/axios";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    const t = localStorage.getItem("token");
    setAuthToken(t);
  }, []);

  useEffect(() => {
    document.title = "e-Dnevnik";
  }, []);

  const [user] = useLocalStorage("user", null);

  return (
    <div className="app-shell">
      <NavBar />

      {pathname !== "/login" && (
        <div className="breadcrumbs-bar">
          <div className="container">
            <Breadcrumbs />
          </div>
        </div>
      )}

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />{" "}
              </GuestRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                {" "}
                <Home />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={["nastavnik", "admin"]}>
                {" "}
                <Students />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["ucenik", "roditelj"]}>
                {" "}
                <Student />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                {" "}
                <Subjects />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {" "}
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
