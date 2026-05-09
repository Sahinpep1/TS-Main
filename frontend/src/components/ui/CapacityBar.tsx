/**
 * CapacityBar — reusable progress bar with color thresholds.
 * Extracted from TruckCard for reuse across the app.
 */

import "./CapacityBar.css";

interface CapacityBarProps {
  label: string;
  icon?: string;
  current: number;
  max: number;
  unit?: string;
  showPercentage?: boolean;
  showValues?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CapacityBar({
  label,
  icon,
  current,
  max,
  unit = "",
  showPercentage = true,
  showValues = false,
  size = "md",
  className = "",
}: CapacityBarProps) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0;

  const getLevel = () => {
    if (pct >= 90) return "danger";
    if (pct >= 70) return "warning";
    return "ok";
  };

  return (
    <div className={`cap-bar cap-bar--${size} ${className}`}>
      <div className="cap-bar__header">
        <div className="cap-bar__label">
          {icon && <span className="cap-bar__icon">{icon}</span>}
          <span>{label}</span>
        </div>
        {showPercentage && (
          <span className="cap-bar__pct">{pct.toFixed(0)}%</span>
        )}
      </div>
      <div className="cap-bar__track">
        <div
          className={`cap-bar__fill cap-bar__fill--${getLevel()}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showValues && (
        <div className="cap-bar__values">
          {current.toLocaleString()}{unit} / {max.toLocaleString()}{unit}
        </div>
      )}
    </div>
  );
}
