import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";

interface MapLassoControlProps {
  onSelection: (selectedIds: number[]) => void;
  coordinates: any[];
}

export function MapLassoControl({ onSelection, coordinates }: MapLassoControlProps) {
  const map = useMap();

  useEffect(() => {
    // Add Geoman controls
    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawPolygon: true,
      drawCircle: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: true,
    });

    // Set global options
    map.pm.setGlobalOptions({ 
      pinning: true,
      snappable: true,
      allowSelfIntersection: false
    });

    const handleCreate = (e: any) => {
      const { shape, layer } = e;
      const selectedIds: number[] = [];

      // Check which coordinates are inside the drawn shape
      coordinates.forEach(c => {
        const point = L.latLng(c.lat, c.lng);
        let isInside = false;

        if (shape === 'Rectangle' || shape === 'Polygon') {
          // Use Leaflet's contains or Geoman's utils
          // For simplicity and accuracy, we use layer.getBounds().contains for rect
          // or a polygon check for polygon.
          if (shape === 'Rectangle') {
            isInside = layer.getBounds().contains(point);
          } else {
            // Polygon check
            const latLngs = layer.getLatLngs()[0];
            isInside = isPointInPolygon(point, latLngs);
          }
        }

        if (isInside) {
          selectedIds.push(c.id);
        }
      });

      onSelection(selectedIds);
      
      // Remove the drawn shape after selection to keep map clean
      setTimeout(() => {
        map.removeLayer(layer);
      }, 500);
    };

    map.on('pm:create', handleCreate);

    return () => {
      map.off('pm:create', handleCreate);
      if (map.pm) {
        map.pm.removeControls();
      }
    };
  }, [map, coordinates, onSelection]);

  return null;
}

/** Utility to check if a point is inside a polygon */
function isPointInPolygon(point: L.LatLng, polygon: L.LatLng[]) {
  const x = point.lat, y = point.lng;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
