/**
 * QuickSwitch — floating pill toggle for fast Map ↔ Dashboard switching.
 * Keyboard shortcut: Alt + V
 */
import { useEffect } from "react";
import { Map, LayoutDashboard } from "lucide-react";
import type { AppPage } from "../AppNav/AppNav";
import "./QuickSwitch.css";

interface QuickSwitchProps {
  page: AppPage;
  onChangePage: (page: AppPage) => void;
}

export function QuickSwitch({ page, onChangePage }: QuickSwitchProps) {
  // Keyboard shortcut: Alt+V toggles between views
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "v") {
        e.preventDefault();
        onChangePage(page === "map" ? "dashboard" : "map");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [page, onChangePage]);

  return (
    <div className="quick-switch" id="quick-switch" role="navigation" aria-label="Quick view switch">
      <div className="quick-switch__track">
        {/* Sliding highlight */}
        <div className={`quick-switch__slider ${page === "dashboard" ? "quick-switch__slider--right" : ""}`} />

        <button
          id="qs-map"
          className={`quick-switch__btn ${page === "map" ? "quick-switch__btn--active" : ""}`}
          onClick={() => onChangePage("map")}
          title="Map View (Alt+V)"
        >
          <Map size={14} />
          <span>Map</span>
        </button>

        <button
          id="qs-dashboard"
          className={`quick-switch__btn ${page === "dashboard" ? "quick-switch__btn--active" : ""}`}
          onClick={() => onChangePage("dashboard")}
          title="Dashboard (Alt+V)"
        >
          <LayoutDashboard size={14} />
          <span>Dashboard</span>
        </button>
      </div>

      <span className="quick-switch__hint">Alt+V</span>
    </div>
  );
}
