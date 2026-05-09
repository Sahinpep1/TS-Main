import React, { useState } from "react";
import type { Truck, LogisticsSummary } from "../../types";
import SummaryCards from "./SummaryCards";
import ActionBar from "./ActionBar";
import TruckList from "./TruckList";
import "./Sidebar.css";

interface SidebarProps {
  trucks: Truck[];
  summary: LogisticsSummary | null;
  selectedTruckId: number | null;
  onSelectTruck: (truckId: number) => void;
  onAutoAssign: () => void;
  onReset: () => void;
}

export default function Sidebar({
  trucks,
  summary,
  selectedTruckId,
  onSelectTruck,
  onAutoAssign,
  onReset,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${isCollapsed ? "sidebar--collapsed" : ""}`} id="logistics-sidebar">
      {/* ── Toggle Button ─────────────────────────────────── */}
      <button
        className="sidebar__toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Open Sidebar" : "Close Sidebar"}
      >
        {isCollapsed ? "❯" : "❮"}
      </button>

      {!isCollapsed && (
        <div className="sidebar__content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* ── Header ─────────────────────────────────────────── */}
          <div className="sidebar__header" style={{ flexShrink: 0 }}>
            <div className="sidebar__brand">
              <span className="sidebar__logo">🚛</span>
              <div>
                <h1 className="sidebar__title">Logistics Tracker</h1>
                <p className="sidebar__subtitle">Fleet Management</p>
              </div>
            </div>
          </div>

          <div style={{ flexShrink: 0 }}>
            <SummaryCards summary={summary} />
            <ActionBar onAutoAssign={onAutoAssign} onReset={onReset} />
          </div>

          <TruckList 
            trucks={trucks} 
            selectedTruckId={selectedTruckId} 
            onSelectTruck={onSelectTruck} 
          />
        </div>
      )}
    </aside>
  );
}
