import React from "react";

export default function AppButton({ children, variant = "default", onClick, type = "button" }) {
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