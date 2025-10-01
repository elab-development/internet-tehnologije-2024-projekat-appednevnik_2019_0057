import React from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main container page">
        <h2>Dobrodošli u e-Dnevnik</h2>
        <p>Sadrzaj</p>
      </main>
      <Footer />
    </div>
  );
}

export default App;


