/**
 * MapLegend — dynamic map legend.
 * Accepts explicit `items` + `title` props so it can reflect
 * whichever colour mode is currently active (status or sales_rep).
 * Falls back to the original static status items when used without props.
 */

import "./MapLegend.css";

interface LegendItem {
  color: string;
  label: string;
}

interface MapLegendProps {
  className?: string;
  title?: string;
  items?: LegendItem[];
}

const DEFAULT_ITEMS: LegendItem[] = [
  { color: "#ef4444", label: "Delivered" },
  { color: "#22c55e", label: "Pending" },
  { color: "#6366f1", label: "Assigned" },
];

export default function MapLegend({
  className = "",
  title = "Status",
  items = DEFAULT_ITEMS,
}: MapLegendProps) {
  return (
    <div className={`map-legend ${className}`} id="map-legend">
      <div className="map-legend__title">{title}</div>
      {items.map((item) => (
        <div key={item.label} className="map-legend__item">
          <span
            className="map-legend__dot"
            style={{ background: item.color }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}
