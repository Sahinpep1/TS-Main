import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-lasso";

interface MapLassoControlProps {
  onSelection: (selectedIds: number[]) => void;
  coordinates: any[];
}

export function MapLassoControl({ onSelection, coordinates }: MapLassoControlProps) {
  const map = useMap();

  useEffect(() => {
    // Add the control
    const lassoControl = (L.control as any).lasso({
      position: 'topleft',
      intersect: true,
    }).addTo(map);

    // Listen to the finished event
    const handleLassoFinished = (event: any) => {
      const selectedLayers = event.layers;
      const selectedIds: number[] = [];

      selectedLayers.forEach((layer: any) => {
        // A circle marker layer's center can be compared or we can pass custom options.
        // The easiest way is to find the matching coordinate from the layers lat/lng.
        if (layer instanceof L.CircleMarker && layer.getLatLng) {
          const latLng = layer.getLatLng();
          const match = coordinates.find(c => 
            Math.abs(c.lat - latLng.lat) < 0.0001 && 
            Math.abs(c.lng - latLng.lng) < 0.0001
          );
          if (match) {
            selectedIds.push(match.id);
          }
        }
      });

      onSelection(selectedIds);
    };

    map.on('lasso.finished', handleLassoFinished);

    return () => {
      map.off('lasso.finished', handleLassoFinished);
      map.removeControl(lassoControl);
    };
  }, [map, coordinates, onSelection]);

  return null;
}
