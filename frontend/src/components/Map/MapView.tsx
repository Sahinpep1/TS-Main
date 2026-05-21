/**
 * MapView — Leaflet map component displaying delivery coordinates.
 * Supports two colour modes for markers:
 *   • "status"   — colour by delivery status / assigned truck (default)
 *   • "sales_rep" — each sales rep gets a unique colour
 */

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState, useMemo } from "react";
import { Palette } from "lucide-react";
import type { Coordinate, Truck, SalesRepOption } from "../../types";
import MapMarker from "./MapMarker";
import type { ColorMode } from "./MapMarker";
import MapLegend from "./MapLegend";
import { MapToolbar } from "./MapToolbar";
import { MapLassoControl } from "./MapLassoControl";
import { MapHeatmapLayer } from "./MapHeatmapLayer";
import "./MapView.css";

interface MapViewProps {
  coordinates: Coordinate[];
  trucks: Truck[];
  selectedTruckId: number | null;
  onAssign: (coordId: number, truckId: number) => void;
  selectedCoordIds?: Set<number>;
  onLassoSelection?: (ids: number[]) => void;
  salesRepsData: SalesRepOption[];
}

/** Palette of distinct colours used for sales-rep mode. */
const SALES_REP_PALETTE = [
  "#f97316", // orange
  "#06b6d4", // cyan
  "#a855f7", // violet
  "#ec4899", // pink
  "#84cc16", // lime
  "#eab308", // yellow
  "#14b8a6", // teal
  "#f43f5e", // rose
  "#8b5cf6", // purple
  "#0ea5e9", // sky
  "#10b981", // emerald
  "#fb923c", // light-orange
];

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
  selectedCoordIds = new Set(),
  onLassoSelection,
  salesRepsData,
}: MapViewProps) {
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
  const [colorMode, setColorMode] = useState<ColorMode>("status");

  /** Build rep → colour mapping once; stable as long as salesRepsData doesn't change. */
  const salesRepColorMap = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    salesRepsData.forEach((rep, idx) => {
      map[rep.sales_rep] = SALES_REP_PALETTE[idx % SALES_REP_PALETTE.length];
    });
    return map;
  }, [salesRepsData]);

  /** Legend items that reflect the active colour mode. */
  const legendItems = useMemo(() => {
    if (colorMode === "sales_rep") {
      return salesRepsData.map((rep) => ({
        color: salesRepColorMap[rep.sales_rep] ?? "#94a3b8",
        label: rep.sales_rep,
      }));
    }
    return [
      { color: "#ef4444", label: "Delivered" },
      { color: "#22c55e", label: "Pending" },
      { color: "#6366f1", label: "Assigned" },
    ];
  }, [colorMode, salesRepsData, salesRepColorMap]);

  return (
    <div className="map-container" id="logistics-map">
      <MapContainer
        center={[39.5, 32.5]}
        zoom={6}
        scrollWheelZoom={true}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />        <FitBounds coordinates={coordinates} />

        {isHeatmapVisible && (
          <MapHeatmapLayer coordinates={coordinates} />
        )}

        {!isHeatmapVisible && coordinates.map((coord) => (
          <MapMarker
            key={coord.id}
            coordinate={coord}
            trucks={trucks}
            selectedTruckIds={new Set(selectedTruckId !== null ? [selectedTruckId] : [])}
            isHighlighted={selectedCoordIds.has(coord.id)}
            onAssign={onAssign}
            colorMode={colorMode}
            salesRepColorMap={salesRepColorMap}
          />
        ))}

        {onLassoSelection && (
          <MapLassoControl
            coordinates={coordinates}
            onSelection={onLassoSelection}
          />
        )}
      </MapContainer>

      <MapToolbar
        onZoomToFit={() => {
          // Trigger fit bounds again if needed
        }}
        onToggleHeatmap={() => setIsHeatmapVisible(!isHeatmapVisible)}
        isHeatmapActive={isHeatmapVisible}
      />

      {/* ── Colour-mode toggle ─────────────────────────────────── */}
      <div className="color-mode-toggle" id="color-mode-toggle">
        <span className="color-mode-toggle__label">
          <Palette size={13} />
          Colour by
        </span>
        <div className="color-mode-toggle__options">
          <button
            id="color-mode-status"
            className={`color-mode-btn ${colorMode === "status" ? "active" : ""}`}
            onClick={() => setColorMode("status")}
            title="Colour markers by delivery status"
          >
            Status
          </button>
          <button
            id="color-mode-sales-rep"
            className={`color-mode-btn ${colorMode === "sales_rep" ? "active" : ""}`}
            onClick={() => setColorMode("sales_rep")}
            title="Colour markers by sales representative"
          >
            Sales Rep
          </button>
        </div>
      </div>

      {/* Legend — updates dynamically based on active colour mode */}
      <MapLegend
        items={legendItems}
        title={colorMode === "sales_rep" ? "Sales Rep" : "Status"}
      />
    </div>
  );
}
