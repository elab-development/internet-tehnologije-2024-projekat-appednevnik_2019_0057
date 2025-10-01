import React from "react";

export default function AppInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error
}) {
  return (
    <div className="input-wrap">
      {label && <label>{label}</label>}
      <input
        className={`input ${error ? "input-error" : ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}