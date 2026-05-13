/**
 * TruckPanel — right-side fleet panel with capacity bars.
 */
import type { Truck } from "../../types";
import "./Dashboard.css";

interface TruckPanelProps {
  trucks: Truck[];
  selectedTruckId: number | null;
  onSelectTruck: (id: number) => void;
}

export function TruckPanel({ trucks, selectedTruckId, onSelectTruck }: TruckPanelProps) {
  return (
    <div className="truck-panel">
      <div className="truck-panel__header">
        <h3 className="truck-panel__title">Fleet</h3>
        <span className="truck-panel__count">{trucks.length} trucks</span>
      </div>
      <div className="truck-panel__list">
        {trucks.map((truck) => {
          const pct = truck.Capacity > 0
            ? Math.round((truck.Palet / truck.Capacity) * 100)
            : 0;
          const isSelected = truck.id === selectedTruckId;
          const barColor = pct > 90 ? "#ef4444" : pct > 70 ? "#f59e0b" : "#22c55e";

          return (
            <div
              key={truck.id}
              id={`truck-panel-card-${truck.id}`}
              className={`truck-panel__card ${isSelected ? "truck-panel__card--selected" : ""}`}
              onClick={() => onSelectTruck(truck.id)}
              style={{ borderLeftColor: truck.color }}
            >
              <div className="truck-panel__row">
                <span className="truck-panel__plaka">{truck.Plaka}</span>
                <span className="truck-panel__pct" style={{ color: barColor }}>{pct}%</span>
              </div>
              <span className="truck-panel__driver">{truck.Driver}</span>
              {truck.Default_Sales_Rep && (
                <span className="truck-panel__rep">{truck.Default_Sales_Rep}</span>
              )}
              <div className="truck-panel__bar-bg">
                <div
                  className="truck-panel__bar-fill"
                  style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }}
                />
              </div>
              <div className="truck-panel__stats">
                <span>{truck.Palet} / {truck.Capacity} plt</span>
                <span>{truck.assigned_deliveries.length} orders</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
