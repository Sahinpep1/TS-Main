import React from "react";
import "./Sidebar.css";

interface ActionBarProps {
  onAutoAssign: () => void;
  onReset: () => void;
  isAssigning?: boolean;
}

export default function ActionBar({ onAutoAssign, onReset, isAssigning }: ActionBarProps) {
  return (
    <div className="sidebar__actions">
      <button
        className="action-btn action-btn--primary"
        onClick={onAutoAssign}
        id="btn-auto-assign"
        disabled={isAssigning}
      >
        <span className="action-btn__icon">⚡</span>
        {isAssigning ? "Assigning..." : "Auto Assign"}
      </button>
      <button
        className="action-btn action-btn--ghost"
        onClick={onReset}
        id="btn-reset"
        disabled={isAssigning}
      >
        <span className="action-btn__icon">↻</span>
        Reset
      </button>
    </div>
  );
}
