/**
 * MapMarker — renders a single delivery point on the map.
 * Extracted from MapView for modularity and multi-select support.
 */

import { CircleMarker, Popup } from "react-leaflet";
import type { Coordinate, Truck } from "../../types";
import Badge from "../ui/Badge";

interface MapMarkerProps {
  coordinate: Coordinate;
  trucks: Truck[];
  selectedTruckIds: Set<number>;
  isHighlighted: boolean;
  onAssign: (coordId: number, truckId: number) => void;
  onToggleSelect?: (coordId: number) => void;
}

const STATUS_COLORS: Record<string, string> = {
  delivered: "#ef4444",
  assigned: "#f59e0b",
  pending: "#22c55e",
};

export default function MapMarker({
  coordinate: c,
  trucks,
  selectedTruckIds,
  isHighlighted,
  onAssign,
  onToggleSelect,
}: MapMarkerProps) {
  const isAssigned = c.status === "assigned";
  const truckColor =
    c.assigned_truck_id !== null
      ? trucks.find((t) => t.id === c.assigned_truck_id)?.color
      : undefined;

  const fillColor = isAssigned
    ? truckColor || "#6366f1"
    : STATUS_COLORS[c.status] || "#94a3b8";

  // Pick the first selected truck for the assign button
  const assignableTruckId =
    selectedTruckIds.size === 1 ? [...selectedTruckIds][0] : null;

  return (
    <CircleMarker
      center={[c.lat, c.lng]}
      radius={isHighlighted ? 11 : isAssigned ? 7 : 9}
      pathOptions={{
        fillColor,
        fillOpacity: isAssigned ? 0.9 : 0.75,
        color: isHighlighted
          ? "#facc15"
          : isAssigned
            ? "#fff"
            : "rgba(255,255,255,0.3)",
        weight: isHighlighted ? 3 : isAssigned ? 2 : 1,
      }}
      eventHandlers={{
        click: (e) => {
          if (e.originalEvent.ctrlKey && onToggleSelect) {
            e.originalEvent.stopPropagation();
            onToggleSelect(c.id);
          }
        },
      }}
    >
      <Popup className="custom-popup">
        <div className="popup-content">
          <h4>{c.name}</h4>
          <div className="popup-grid">
            <span className="popup-label">Weight</span>
            <span className="popup-value">{c.Miktar} kg</span>
            <span className="popup-label">Volume</span>
            <span className="popup-value">{c.Palet_Sayısı} m³</span>
            <span className="popup-label">Status</span>
            <Badge variant={c.status}>{c.status}</Badge>
            <span className="popup-label">Status</span>
            <Badge variant={c.status}>{c.status}</Badge>
          </div>
          {!isAssigned && assignableTruckId && (
            <button
              className="popup-assign-btn"
              onClick={() => onAssign(c.id, assignableTruckId)}
            >
              Assign to Truck #{assignableTruckId}
            </button>
          )}
        </div>
      </Popup>
    </CircleMarker>
  );
}
