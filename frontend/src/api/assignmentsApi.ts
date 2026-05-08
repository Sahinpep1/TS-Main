/**
 * Assignments API — assign/unassign deliveries and get summaries.
 */

import axios from "axios";
import type { AssignResult, AutoAssignResult, LogisticsSummary } from "../types";

const BASE = "http://localhost:8000/api/assignments";

export async function assignDelivery(
  coordinateId: number,
  truckId: number
): Promise<AssignResult> {
  const res = await axios.post<AssignResult>(`${BASE}/assign`, {
    coordinate_id: coordinateId,
    truck_id: truckId,
  });
  return res.data;
}

export async function unassignDelivery(
  coordId: number
): Promise<AssignResult> {
  const res = await axios.post<AssignResult>(`${BASE}/unassign/${coordId}`);
  return res.data;
}

export async function autoAssign(): Promise<AutoAssignResult> {
  const res = await axios.post<AutoAssignResult>(`${BASE}/auto-assign`);
  return res.data;
}

export async function resetAll(): Promise<AssignResult> {
  const res = await axios.post<AssignResult>(`${BASE}/reset`);
  return res.data;
}

export async function fetchSummary(): Promise<LogisticsSummary> {
  const res = await axios.get<LogisticsSummary>(`${BASE}/summary`);
  return res.data;
}
