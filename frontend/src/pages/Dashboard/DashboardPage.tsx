/**
 * DashboardPage — full order management view with KPIs, table, and fleet panel.
 */
import type { Coordinate, Truck, LogisticsSummary } from "../../types";
import { KpiCards } from "../../components/Dashboard/KpiCards";
import { OrdersTable } from "../../components/Dashboard/OrdersTable";
import { TruckPanel } from "../../components/Dashboard/TruckPanel";
import "./DashboardPage.css";

interface DashboardPageProps {
  coordinates: Coordinate[];
  trucks: Truck[];
  summary: LogisticsSummary | null;
  selectedTruckId: number | null;
  onSelectTruck: (id: number) => void;
  onAssign: (coordId: number, truckId: number) => Promise<unknown>;
  onUnassign: (coordId: number) => Promise<unknown>;
}

export function DashboardPage({
  coordinates,
  trucks,
  summary,
  selectedTruckId,
  onSelectTruck,
  onAssign,
  onUnassign,
}: DashboardPageProps) {
  return (
    <div className="dashboard" id="dashboard-page">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__heading">Order Management</h1>
          <p className="dashboard__sub">Assign and manage all deliveries</p>
        </div>
        <span className="dashboard__date">
          {new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      <KpiCards summary={summary} />

      <div className="dashboard__body">
        <OrdersTable
          coordinates={coordinates}
          trucks={trucks}
          onAssign={onAssign}
          onUnassign={onUnassign}
        />
        <TruckPanel
          trucks={trucks}
          selectedTruckId={selectedTruckId}
          onSelectTruck={onSelectTruck}
        />
      </div>
    </div>
  );
}
