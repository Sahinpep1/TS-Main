import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import type { Coordinate } from "../../types";

interface MapHeatmapLayerProps {
  coordinates: Coordinate[];
  intensity?: number;
}

export function MapHeatmapLayer({ coordinates, intensity = 0.5 }: MapHeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length === 0) return;

    // Prepare data: [[lat, lng, intensity], ...]
    const heatData: [number, number, number][] = coordinates.map(c => [
      c.lat, 
      c.lng, 
      intensity
    ]);

    const heatLayer = (L as any).heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, coordinates, intensity]);

  return null;
}
