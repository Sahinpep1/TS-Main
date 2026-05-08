/**
 * Shared TypeScript types for the Logistics Tracker.
 */

export interface Coordinate {
  id: number;
  lat: number;
  lng: number;
  label: string;
  weight_kg: number;
  volume_m3: number;
  priority: "high" | "medium" | "low";
  status: "pending" | "assigned" | "delivered";
  assigned_truck_id: number | null;
}

export interface Truck {
  id: number;
  name: string;
  plate: string;
  max_weight_kg: number;
  max_volume_m3: number;
  current_weight_kg: number;
  current_volume_m3: number;
  assigned_deliveries: number[];
  color: string;
  status: "idle" | "loading" | "en_route" | "returning";
}

export interface TruckCapacity {
  truck_id: number;
  name: string;
  weight_percent: number;
  volume_percent: number;
  delivery_count: number;
}

export interface LogisticsSummary {
  total_deliveries: number;
  assigned_deliveries: number;
  pending_deliveries: number;
  total_weight_kg: number;
  total_volume_m3: number;
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
