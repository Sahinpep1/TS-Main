import { NavLink } from "react-router-dom";
import { Map, LayoutDashboard, Columns, BarChart2 } from "lucide-react";
import "./AppNav.css";

export function AppNav() {
  return (
    <nav className="app-nav" id="app-nav">
      <div className="app-nav__brand">
        <span className="app-nav__logo">⚡</span>
        <span className="app-nav__title">Logistics Tracker</span>
      </div>
      <div className="app-nav__tabs">
        <NavLink 
          to="/workspace" 
          className={({ isActive }) => `app-nav__tab ${isActive ? "app-nav__tab--active" : ""}`}
        >
          <Columns size={16} />
          Workspace
        </NavLink>
        <NavLink 
          to="/map" 
          className={({ isActive }) => `app-nav__tab ${isActive ? "app-nav__tab--active" : ""}`}
        >
          <Map size={16} />
          Map View
        </NavLink>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `app-nav__tab ${isActive ? "app-nav__tab--active" : ""}`}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>
        <NavLink 
          to="/statistics" 
          className={({ isActive }) => `app-nav__tab ${isActive ? "app-nav__tab--active" : ""}`}
        >
          <BarChart2 size={16} />
          Statistics
        </NavLink>
      </div>
      <div className="app-nav__spacer" />
    </nav>
  );
}
