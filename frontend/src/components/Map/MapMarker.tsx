/**
 * MapMarker — renders a single delivery point on the map.
 * Extracted from MapView for modularity and multi-select support.
 */

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Package, Truck as TruckIcon, MapPin } from "lucide-react";
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
  assigned: "#6366f1",
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
  const truck = c.assigned_truck_id !== null
    ? trucks.find((t) => t.id === c.assigned_truck_id)
    : undefined;
  
  const color = isAssigned
    ? truck?.color || "#6366f1"
    : STATUS_COLORS[c.status] || "#94a3b8";

  // Create a custom divIcon with Lucide Icon
  const iconHtml = renderToStaticMarkup(
    <div className={`custom-marker ${isHighlighted ? 'highlighted' : ''}`} style={{ 
      backgroundColor: color,
      color: 'white',
      width: isHighlighted ? '40px' : '32px',
      height: isHighlighted ? '40px' : '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `2px solid ${isHighlighted ? '#facc15' : 'white'}`,
      boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
      transition: 'all 0.2s ease-in-out'
    }}>
      {isAssigned ? (
        <TruckIcon size={isHighlighted ? 22 : 18} />
      ) : c.status === 'delivered' ? (
        <MapPin size={isHighlighted ? 22 : 18} />
      ) : (
        <Package size={isHighlighted ? 22 : 18} />
      )}
    </div>
  );

  const customIcon = L.divIcon({
    html: iconHtml,
    className: 'custom-div-icon',
    iconSize: isHighlighted ? [40, 40] : [32, 32],
    iconAnchor: isHighlighted ? [20, 20] : [16, 16],
  });

  // Pick the first selected truck for the assign button
  const assignableTruckId =
    selectedTruckIds.size === 1 ? [...selectedTruckIds][0] : null;

  return (
    <Marker
      position={[c.lat, c.lng]}
      icon={customIcon}
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
            {isAssigned && truck && (
              <>
                <span className="popup-label">Assigned Truck</span>
                <span className="popup-value" style={{ color: truck.color, fontWeight: 'bold' }}>
                  {truck.plate} ({truck.name})
                </span>
              </>
            )}
          </div>
          {!isAssigned && assignableTruckId && (
            <button
              className="popup-assign-btn"
              onClick={() => onAssign(c.id, assignableTruckId)}
              style={{ marginTop: '12px', width: '100%' }}
            >
              Assign to Truck #{assignableTruckId}
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
