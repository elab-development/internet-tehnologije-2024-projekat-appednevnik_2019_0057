import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import AppCard from "../components/AppCard";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState("");

  return (
    <section className="container page">
      <h1>Dobrodošli u e-Dnevnik</h1>
      <p>Test reusable komponente:</p>

      <AppInput
        label="Ime učenika"
        placeholder="Unesi ime..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={value === "" ? "Ovo polje je obavezno" : ""}
      />

      <AppButton variant="primary" onClick={() => alert(`Uneto: ${value}`)}>
        Pošalji
      </AppButton>
      
      <AppCard
        title="Primer kartice"
        actions={[
          { label: "Detalji", variant: "primary", onClick: () => alert("Klik na detalje") },
          { label: "Obriši", variant: "danger", onClick: () => alert("Klik na obriši") }
        ]}
      >
        <p>Kartica</p>
      </AppCard>
    </section>
  );
}