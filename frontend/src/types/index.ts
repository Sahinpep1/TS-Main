/**
 * Shared TypeScript types for the Logistics Tracker.
 */

export interface Coordinate {
  id: number;
  name: string;
  sales_rep: string;
  Palet: number;
  Miktar: number;
  lng: number;
  lat: number;
  status: "pending" | "assigned" | "delivered";
  assigned_truck_id: number | null;
}
export interface Ambalaj {
  name: string;
  Miktar: number;
  Palet: number;
}
export interface SalesRepOption {
  sales_rep: string;
}
export interface Truck {
  id: number;
  Plaka: string;
  Driver: string;
  Capacity: number;
  Miktar: number;
  Palet: number;
  assigned_deliveries: number[];
  color: string;
  status: "idle" | "loading" | "en_route" | "returning";
  Default_Sales_Rep: string;
  Assigned_Route: string;
}

export interface TruckCapacity {
  truck_id: number;
  name: string;
  Palet_percent: number;
  delivery_count: number;
}

export interface LogisticsSummary {
  total_deliveries: number;
  assigned_deliveries: number;
  pending_deliveries: number;
  Miktar: number;
  Palet: number;
  Capacity: number;
  trucks_active: number;
  trucks_idle: number;
}

export interface AssignResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface AutoAssignResult {
  success: boolean;
  assigned: number;
  skipped: number;
  message: string;
}

/* ── Filter Types ─────────────────────────────────────────────── */


export type DeliveryStatus = "pending" | "assigned" | "delivered";

export interface MapFilters {
  statuses: Set<DeliveryStatus>;
  truckIds: Set<number>;
  saleReps: Set<string>;
  searchQuery: string;
  weightRange: [number, number];
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: Omit<MapFilters, "statuses" | "truckIds" | "saleReps"> & {
    statuses: DeliveryStatus[];
    truckIds: number[];
    saleReps: string[];
  };
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  color?: string;
  icon?: string;
}
