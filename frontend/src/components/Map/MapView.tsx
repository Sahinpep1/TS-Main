/**
 * MapView — Leaflet map component displaying 100 delivery coordinates.
 */

import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { Coordinate, Truck } from "../../types";
import "./MapView.css";

interface MapViewProps {
  coordinates: Coordinate[];
  trucks: Truck[];
  selectedTruckId: number | null;
  onAssign: (coordId: number, truckId: number) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

/** Fit bounds whenever coordinates change. */
function FitBounds({ coordinates }: { coordinates: Coordinate[] }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = coordinates.map(
        (c) => [c.lat, c.lng] as [number, number]
      );
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [coordinates, map]);
  return null;
}

export default function MapView({
  coordinates,
  trucks,
  selectedTruckId,
  onAssign,
}: MapViewProps) {
  const getTruckColor = (truckId: number | null) => {
    if (truckId === null) return undefined;
    return trucks.find((t) => t.id === truckId)?.color;
  };

  return (
    <div className="map-container" id="logistics-map">
      <MapContainer
        center={[39.5, 32.5]}
        zoom={6}
        scrollWheelZoom={true}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds coordinates={coordinates} />

        {coordinates.map((coord) => {
          const isAssigned = coord.status === "assigned";
          const truckColor = getTruckColor(coord.assigned_truck_id);
          const fillColor = isAssigned
            ? truckColor || "#6366f1"
            : PRIORITY_COLORS[coord.priority] || "#94a3b8";

          return (
            <CircleMarker
              key={coord.id}
              center={[coord.lat, coord.lng]}
              radius={isAssigned ? 7 : 9}
              pathOptions={{
                fillColor,
                fillOpacity: isAssigned ? 0.9 : 0.75,
                color: isAssigned ? "#fff" : "rgba(255,255,255,0.3)",
                weight: isAssigned ? 2 : 1,
              }}
            >
              <Popup className="custom-popup">
                <div className="popup-content">
                  <h4>{coord.label}</h4>
                  <div className="popup-grid">
                    <span className="popup-label">Weight</span>
                    <span className="popup-value">{coord.weight_kg} kg</span>
                    <span className="popup-label">Volume</span>
                    <span className="popup-value">{coord.volume_m3} m³</span>
                    <span className="popup-label">Priority</span>
                    <span
                      className={`popup-badge priority-${coord.priority}`}
                    >
                      {coord.priority}
                    </span>
                    <span className="popup-label">Status</span>
                    <span className={`popup-badge status-${coord.status}`}>
                      {coord.status}
                    </span>
                  </div>
                  {!isAssigned && selectedTruckId && (
                    <button
                      className="popup-assign-btn"
                      onClick={() => onAssign(coord.id, selectedTruckId)}
                    >
                      Assign to Truck #{selectedTruckId}
                    </button>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="map-legend">
        <div className="legend-title">Priority</div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#ef4444" }} />
          High
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#f59e0b" }} />
          Medium
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#22c55e" }} />
          Low
        </div>
        <div className="legend-item">
          <span
            className="legend-dot"
            style={{ background: "#6366f1", border: "2px solid #fff" }}
          />
          Assigned
        </div>
      </div>
    </div>
  );
}
