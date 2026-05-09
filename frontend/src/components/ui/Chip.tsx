/**
 * Chip — removable tag showing an active filter or selection.
 * Click the × to dismiss.
 */

import "./Chip.css";

interface ChipProps {
  label: string;
  color?: string;
  onRemove?: () => void;
  size?: "sm" | "md";
  className?: string;
}

export default function Chip({
  label,
  color,
  onRemove,
  size = "sm",
  className = "",
}: ChipProps) {
  return (
    <span className={`chip chip--${size} ${className}`}>
      {color && (
        <span className="chip__dot" style={{ background: color }} />
      )}
      <span className="chip__label">{label}</span>
      {onRemove && (
        <button
          className="chip__remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
