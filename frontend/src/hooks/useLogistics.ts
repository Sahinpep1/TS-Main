/**
 * useLogistics — custom hook managing all logistics state and API calls.
 */

import { useState, useEffect, useCallback } from "react";
import type { Coordinate, Truck, LogisticsSummary, SalesRepOption } from "../types";
import {
  fetchCoordinates,
  fetchTrucks,
  fetchSummary,
  assignDelivery,
  unassignDelivery,
  autoAssign,
  resetAll,
  get_sale_rep_list,
  } from "../api";

export function useLogistics() {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [summary, setSummary] = useState<LogisticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTruckId, setSelectedTruckId] = useState<number | null>(null);
  const [salesRepsData, setSalesRepsData] = useState<SalesRepOption[]>([]);
  const [selectedSaleRepIds, setSelectedSaleRepIds] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const [coords, tks, sum,reps] = await Promise.all([
        fetchCoordinates(),
        fetchTrucks(),
        fetchSummary(),
        get_sale_rep_list(),
      ]);
      setCoordinates(coords);
      setTrucks(tks);
      setSummary(sum);
      setSalesRepsData(reps);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch data";
      setError(msg);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const handleAssign = useCallback(
    async (coordId: number, truckId: number) => {
      const result = await assignDelivery(coordId, truckId);
      if (result.success) await refresh();
      return result;
    },
    [refresh]
  );

  const handleUnassign = useCallback(
    async (coordId: number) => {
      const result = await unassignDelivery(coordId);
      if (result.success) await refresh();
      return result;
    },
    [refresh]
  );

  const handleAutoAssign = useCallback(async () => {
    const result = await autoAssign();
    if (result.success) await refresh();
    return result;
  }, [refresh]);

  const handleReset = useCallback(async () => {
    await resetAll();
    await refresh();
  }, [refresh]);

  return {
    coordinates,
    trucks,
    summary,
    loading,
    error,
    selectedTruckId,
    setSelectedTruckId,
    refresh,
    handleAssign,
    handleUnassign,
    handleAutoAssign,
    handleReset,
    selectedSaleRepIds,
    salesRepsData,
  };
}
