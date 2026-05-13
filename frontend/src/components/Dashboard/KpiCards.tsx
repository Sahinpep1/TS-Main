/**
 * KpiCards — four summary stat cards for the Dashboard.
 */
import { Package, CheckCircle, Clock, Truck } from "lucide-react";
import type { LogisticsSummary } from "../../types";
import "./Dashboard.css";

interface KpiCardsProps {
  summary: LogisticsSummary | null;
}

const CARDS = [
  { key: "total_deliveries",  label: "Total Orders",    icon: Package,     color: "#6366f1", bg: "rgba(99,102,241,0.15)"  },
  { key: "assigned_deliveries", label: "Assigned",      icon: CheckCircle, color: "#22c55e", bg: "rgba(34,197,94,0.15)"   },
  { key: "pending_deliveries",  label: "Pending",       icon: Clock,       color: "#f59e0b", bg: "rgba(245,158,11,0.15)"  },
  { key: "trucks_active",       label: "Active Trucks", icon: Truck,       color: "#38bdf8", bg: "rgba(56,189,248,0.15)"  },
] as const;

export function KpiCards({ summary }: KpiCardsProps) {
  return (
    <div className="kpi-grid">
      {CARDS.map(({ key, label, icon: Icon, color, bg }) => (
        <div key={key} className="kpi-card">
          <div className="kpi-icon" style={{ background: bg }}>
            <Icon size={20} color={color} />
          </div>
          <div className="kpi-content">
            <span className="kpi-value">
              {(summary?.[key] ?? 0).toLocaleString()}
            </span>
            <span className="kpi-label">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
