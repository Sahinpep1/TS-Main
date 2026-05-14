/**
 * AppNav — top navigation bar for page switching.
 */
import { Map, LayoutDashboard } from "lucide-react";
import "./AppNav.css";

export type AppPage = "map" | "dashboard" | "statistics";

interface AppNavProps {
  page: AppPage;
  onChangePage: (page: AppPage) => void;
}

export function AppNav({ page, onChangePage }: AppNavProps) {
  return (
    <nav className="app-nav" id="app-nav">
      <div className="app-nav__brand">
        <span className="app-nav__logo">⚡</span>
        <span className="app-nav__title">Logistics Tracker</span>
      </div>
      <div className="app-nav__tabs">
        <button
          id="nav-tab-map"
          className={`app-nav__tab ${page === "map" ? "app-nav__tab--active" : ""}`}
          onClick={() => onChangePage("map")}
        >
          <Map size={16} />
          Map View
        </button>
        <button
          id="nav-tab-dashboard"
          className={`app-nav__tab ${page === "dashboard" ? "app-nav__tab--active" : ""}`}
          onClick={() => onChangePage("dashboard")}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </button>
        <button
          id="nav-tab-statistics"
          className={`app-nav__tab ${page === "statistics" ? "app-nav__tab--active" : ""}`}
          onClick={() => onChangePage("statistics")}
        >
          <LayoutDashboard size={16} />
          Statistics
        </button>
      </div>
      <div className="app-nav__spacer" />
    </nav>
  );
}
