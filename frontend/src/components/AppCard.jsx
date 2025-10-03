import React from "react";
import AppButton from "./AppButton";

export default function AppCard({ title, children, actions, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-body">{children}</div>
      {actions && (
        <div className="card-actions">
          {actions.map((action, idx) => (
            <AppButton
              key={idx}
              variant={action.variant || "default"}
              onClick={action.onClick}
            >
              {action.label}
            </AppButton>
          ))}
        </div>
      )}
    </div>
  );
}
