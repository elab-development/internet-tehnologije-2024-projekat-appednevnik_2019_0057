import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Breadcrumbs from "./components/Breadcrumbs";
import Students from "./pages/Students";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useEffect } from "react";

function App() {
    useEffect(() => {
      document.title = "e-Dnevnik";
    }, []);
  const [user] = useLocalStorage("user", null);

  return (
 <div className="app-shell">
      <NavBar />

      {window.location.pathname !== "/login" && (
        <div className="breadcrumbs-bar">
          <div className="container">
            <Breadcrumbs />
          </div>
        </div>
      )}

      <main className="app-main">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}/>
          <Route path="/login" element={<GuestRoute><Login /> </GuestRoute>} />
          <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute> } />
          <Route path="/students" element={<ProtectedRoute allowedRoles={["nastavnik", "admin"]}> <Students /> </ProtectedRoute> } />
          <Route path="/profile" element={<ProtectedRoute> <Profile /></ProtectedRoute> } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;