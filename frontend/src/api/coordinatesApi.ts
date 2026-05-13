/**
 * Coordinates API — fetches delivery point data from the backend.
 */

import axios from "axios";
import type { Coordinate } from "../types";

const BASE = "http://localhost:8000/api/coordinates";

export async function fetchCoordinates(): Promise<Coordinate[]> {
  const res = await axios.get<Coordinate[]>(BASE);
  return res.data;
}

export async function fetchCoordinatesByStatus(
  status: string
): Promise<Coordinate[]> {
  const res = await axios.get<Coordinate[]>(BASE, { params: { status } });
  return res.data;
}

export async function fetchCoordinateById(id: number): Promise<Coordinate> {
  const res = await axios.get<Coordinate>(`${BASE}/${id}`);
  return res.data;
}

export async function get_sale_rep_list(): Promise<string[]> {
  const res = await axios.get<string[]>(`${BASE}/sale-rep_list`);
  return res.data;
}