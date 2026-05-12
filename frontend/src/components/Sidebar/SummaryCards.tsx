import React from "react";
import type { LogisticsSummary } from "../../types";
import "./Sidebar.css"; // Reuse existing styles for now

interface SummaryCardsProps {
  summary: LogisticsSummary | null;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  if (!summary) return null;

  return (
    <div className="sidebar__summary">
      <div className="summary-card summary-card--deliveries">
        <span className="summary-card__value">{summary.total_deliveries}</span>
        <span className="summary-card__label">Total</span>
      </div>
      <div className="summary-card summary-card--assigned">
        <span className="summary-card__value">{summary.assigned_deliveries}</span>
        <span className="summary-card__label">Assigned</span>
      </div>
      <div className="summary-card summary-card--pending">
        <span className="summary-card__value">{summary.pending_deliveries}</span>
        <span className="summary-card__label">Pending</span>
      </div>
      <div className="summary-card summary-card--weight">
        <span className="summary-card__value">
          {(summary.Palet_Sayısı)}
        </span>
        <span className="summary-card__label">Pallets</span>
      </div>
    </div>
  );
}
