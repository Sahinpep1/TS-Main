/**
 * TruckCard — displays a single truck with real-time capacity bars.
 */

import type { Truck } from "../../types";
import "./TruckCard.css";

interface TruckCardProps {
  truck: Truck;
  isSelected: boolean;
  onSelect: (truckId: number) => void;
}

export default function TruckCard({ truck, isSelected, onSelect }: TruckCardProps) {
  const weightPct = Math.min(
    100,
    (truck.current_weight_kg / truck.max_weight_kg) * 100
  );
  const volumePct = Math.min(
    100,
    (truck.current_volume_m3 / truck.max_volume_m3) * 100
  );

  const getBarClass = (pct: number) => {
    if (pct >= 90) return "bar-fill bar-danger";
    if (pct >= 70) return "bar-fill bar-warning";
    return "bar-fill bar-ok";
  };

  const statusIcon: Record<string, string> = {
    idle: "⏸",
    loading: "📦",
    en_route: "🚛",
    returning: "↩️",
  };

  return (
    <div
      className={`truck-card ${isSelected ? "truck-card--selected" : ""}`}
      style={{ "--truck-color": truck.color } as React.CSSProperties}
      onClick={() => onSelect(truck.id)}
      id={`truck-card-${truck.id}`}
    >
      {/* Header */}
      <div className="truck-card__header">
        <div
          className="truck-card__indicator"
          style={{ background: truck.color }}
        />
        <div className="truck-card__info">
          <span className="truck-card__name">{truck.name}</span>
          <span className="truck-card__plate">{truck.plate}</span>
        </div>
        <div className="truck-card__status">
          <span className="truck-card__status-icon">
            {statusIcon[truck.status] || "⏸"}
          </span>
          <span className={`truck-card__status-label status--${truck.status}`}>
            {truck.status}
          </span>
        </div>
      </div>

      {/* Capacity Bars */}
      <div className="truck-card__bars">
        <div className="capacity-row">
          <div className="capacity-label">
            <span className="capacity-icon">⚖️</span>
            <span>Weight</span>
          </div>
          <div className="capacity-bar">
            <div
              className={getBarClass(weightPct)}
              style={{ width: `${weightPct}%` }}
            />
          </div>
          <span className="capacity-pct">{weightPct.toFixed(0)}%</span>
        </div>

        <div className="capacity-row">
          <div className="capacity-label">
            <span className="capacity-icon">📐</span>
            <span>Volume</span>
          </div>
          <div className="capacity-bar">
            <div
              className={getBarClass(volumePct)}
              style={{ width: `${volumePct}%` }}
            />
          </div>
          <span className="capacity-pct">{volumePct.toFixed(0)}%</span>
        </div>
      </div>

      {/* Footer stats */}
      <div className="truck-card__footer">
        <span className="truck-card__stat">
          {truck.current_weight_kg.toLocaleString()} / {truck.max_weight_kg.toLocaleString()} kg
        </span>
        <span className="truck-card__deliveries">
          {truck.assigned_deliveries.length} deliveries
        </span>
      </div>
    </div>
  );
}
