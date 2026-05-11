/**
 * MapView — Leaflet map component displaying 100 delivery coordinates.
 */

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import type { Coordinate, Truck } from "../../types";
import MapMarker from "./MapMarker";
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
}

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
}: MapViewProps) {
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);

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
      
      {/* Legend */}
      <MapLegend />
    </div>
  );
}
