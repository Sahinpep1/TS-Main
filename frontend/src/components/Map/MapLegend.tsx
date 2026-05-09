/**
 * MapLegend — extracted map legend component showing priority and status colors.
 */

import "./MapLegend.css";

interface LegendItem {
  color: string;
  label: string;
  border?: boolean;
}

interface MapLegendProps {
  className?: string;
}

const ITEMS: LegendItem[] = [
  { color: "#ef4444", label: "High" },
  { color: "#f59e0b", label: "Medium" },
  { color: "#22c55e", label: "Low" },
  { color: "#6366f1", label: "Assigned", border: true },
];

export default function MapLegend({ className = "" }: MapLegendProps) {
  return (
    <div className={`map-legend ${className}`} id="map-legend">
      <div className="map-legend__title">Priority</div>
      {ITEMS.map((item) => (
        <div key={item.label} className="map-legend__item">
          <span
            className="map-legend__dot"
            style={{
              background: item.color,
              border: item.border ? "2px solid #fff" : undefined,
            }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}
