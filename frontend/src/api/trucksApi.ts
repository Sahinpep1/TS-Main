/**
 * Trucks API — fetches truck data and capacities from the backend.
 */

import axios from "axios";
import type { Truck, TruckCapacity } from "../types";

const BASE = "http://localhost:8000/api/trucks";

export async function fetchTrucks(): Promise<Truck[]> {
  const res = await axios.get<Truck[]>(BASE);
  return res.data;
}

export async function fetchTruckCapacities(): Promise<TruckCapacity[]> {
  const res = await axios.get<TruckCapacity[]>(`${BASE}/capacities`);
  return res.data;
}

export async function fetchTruckById(id: number): Promise<Truck> {
  const res = await axios.get<Truck>(`${BASE}/${id}`);
  return res.data;
}
