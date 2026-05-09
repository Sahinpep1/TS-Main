import { useState } from "react"; //
import type { Truck, LogisticsSummary } from "../../types";
import TruckCard from "../TruckCard/TruckCard";
import "./SidebarOC.css";

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
  // Local state to manage visibility
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`sidebar ${isCollapsed ? "sidebar--collapsed" : ""}`}
      id="logistics-sidebar"
    >
      {/* ── Toggle Button ─────────────────────────────────── */}
      <button
        className="sidebar__toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Open Sidebar" : "Close Sidebar"}
      >
        {isCollapsed ? "AÇ" : "KAPA"}
      </button>

      {/* Wrap content in a container to handle fading during collapse */}
      {/* ── Summary Cards ──────────────────────────────────── */}
      {summary && (
        <div className="sidebar__summary">
          <div className="summary-card summary-card--deliveries">
            <span className="summary-card__value">{summary.total_deliveries}</span>
            <span className="summary-card__label">Total</span>
          </div>
          <div className="summary-card summary-card--assigned">
            <span className="summary-card__value">{summary.assigned_deliveries}</span>
            <span className="summary-card__label">Assigned</span>
          </div>
          <div className="summary-card summary-card--pending">
            <span className="summary-card__value">{summary.pending_deliveries}</span>
            <span className="summary-card__label">Pending</span>
          </div>
          <div className="summary-card summary-card--weight">
            <span className="summary-card__value">
              {(summary.total_weight_kg / 1000).toFixed(1)}t
            </span>
            <span className="summary-card__label">Weight</span>
          </div>
        </div>
      )}

      {/* ── Action Buttons ─────────────────────────────────── */}
      <div className="sidebar__actions">
        <button
          className="action-btn action-btn--primary"
          onClick={onAutoAssign}
          id="btn-auto-assign"
        >
          <span className="action-btn__icon">⚡</span>
          Auto Assign
        </button>
        <button
          className="action-btn action-btn--ghost"
          onClick={onReset}
          id="btn-reset"
        >
          <span className="action-btn__icon">↻</span>
          Reset
        </button>
      </div>

      {/* ── Truck List ─────────────────────────────────────── */}
      <div className="sidebar__section-header">
        <h2 className="sidebar__section-title">Fleet ({trucks.length})</h2>
        {selectedTruckId && (
          <span className="sidebar__selection-hint">
            Selected: #{selectedTruckId}
          </span>
        )}
      </div>

      <div className="sidebar__trucks">
        {trucks.map((truck) => (
          <TruckCard
            key={truck.id}
            truck={truck}
            isSelected={selectedTruckId === truck.id}
            onSelect={onSelectTruck}
          />
        ))}
      </div>
    </aside>
  );
}