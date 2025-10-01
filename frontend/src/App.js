import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Breadcrumbs from "./components/Breadcrumbs";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  return (
 <div className="app-shell">
      <NavBar />

      <div className="breadcrumbs-bar">
        <div className="container">
          <Breadcrumbs />
        </div>
      </div>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;


