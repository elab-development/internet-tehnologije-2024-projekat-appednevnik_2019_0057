import React from "react";

export default function AppButton({ children, variant = "default", onClick, type = "button", disabled = false }) {
  return (
    <button
      type={type}
      className={`btn ${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}