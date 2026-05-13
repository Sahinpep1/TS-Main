/**
 * useMapFilters — manages all map filtering state and returns
 * the filtered coordinates. No API calls — purely client-side filtering.
 */

import { useState, useMemo, useCallback } from "react";
import type { Coordinate, Truck, MapFilters, DeliveryStatus  } from "../types";
import { useDebounce } from "./useDebounce";


const ALL_STATUSES: DeliveryStatus[] = ["pending", "assigned", "delivered"];
const ALL_SALE_REPS: string[] = []; // This will be populated from the API in useLogistics and passed down

function createDefaultFilters(): MapFilters { 
  return {
    statuses: new Set<DeliveryStatus>(ALL_STATUSES),
    truckIds: new Set<number>() ,
    saleReps: new Set<string>(ALL_SALE_REPS),
    searchQuery: "",
    weightRange: [0, Infinity],
  };
}

export function useMapFilters(coordinates: Coordinate[], trucks: Truck[]) {
  const [filters, setFilters] = useState<MapFilters>(createDefaultFilters);

  const debouncedSearch = useDebounce(filters.searchQuery, 250);

  /* ── Setters ─────────────────────────────────────────────── */



  const toggleStatus = useCallback((s: DeliveryStatus) => {
    setFilters((prev) => {
      const next = new Set(prev.statuses);
      next.has(s) ? next.delete(s) : next.add(s);
      return { ...prev, statuses: next };
    });
  }, []);

  const toggleTruckFilter = useCallback((id: number) => {
    setFilters((prev) => {
      const next = new Set(prev.truckIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...prev, truckIds: next };
    });
  }, []);
  const toggleSaleRepFilter = useCallback((rep: string) => {
    setFilters((prev) => {
      const next = new Set(prev.saleReps);
      next.has(rep) ? next.delete(rep) : next.add(rep);
      return { ...prev, saleReps: next };
    });
  }, []);



  const setStatuses = useCallback((statuses: DeliveryStatus[]) => {
    setFilters((prev) => ({ ...prev, statuses: new Set(statuses) }));
  }, []);

  const setTruckIds = useCallback((ids: number[]) => {
    setFilters((prev) => ({ ...prev, truckIds: new Set(ids) }));
  }, []);

  const setSearchQuery = useCallback((q: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: q }));
  }, []);

  const setSaleReps = useCallback((reps: string[]) => {
    setFilters((prev) => ({ ...prev, saleReps: new Set(reps) }));
  }, []);
  const setWeightRange = useCallback((range: [number, number]) => {
    setFilters((prev) => ({ ...prev, weightRange: range }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(createDefaultFilters());
  }, []);

  /* ── Filtered output ─────────────────────────────────────── */

  const filteredCoordinates = useMemo(() => {
    return coordinates.filter((c) => {

      // CRITICAL: Leaflet safety check
      if (
        c.lat === null || c.lat === undefined ||
        c.lng === null || c.lng === undefined ||
        isNaN(c.lat) || isNaN(c.lng)
      ) {
        return false;
      }
      // Status filter
      if (!filters.statuses.has(c.status)) return false;

      // Truck filter (empty set = show all)
      if (filters.truckIds.size > 0) {
        if (c.assigned_truck_id === null) return false;
        if (!filters.truckIds.has(c.assigned_truck_id)) return false;
      }
      
      // Sales rep filter (empty set = show all)
      if (filters.saleReps.size > 0) {
        if (!filters.saleReps.has(c.sales_rep)) return false;
      }

      // Search filter
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (!c.name.toLowerCase().includes(q)) return false;
      }

      // Weight range
      const [min, max] = filters.weightRange;
      if (c.Miktar < min || c.Miktar > max) return false;

      return true;
    });
  }, [coordinates, filters.statuses, filters.truckIds, filters.saleReps, filters.weightRange, debouncedSearch]);

  /* ── Stats ───────────────────────────────────────────────── */

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.statuses.size < ALL_STATUSES.length) count++;
    if (filters.truckIds.size > 0) count++;
    if (filters.saleReps.size > 0) count++;
    if (filters.searchQuery.length > 0) count++;
    if (filters.weightRange[0] > 0 || filters.weightRange[1] < Infinity) count++;
    return count;
  }, [filters]);

  /* ── Truck options for the filter UI ─────────────────────── */

  const truckOptions = useMemo(
    () =>
      trucks.map((t) => ({
        value: t.id,
        label: `${t.Driver} (${t.Plaka})`,
        color: t.color,
      })),
    [trucks]
  );

  return {
    filters,
    filteredCoordinates,
    activeFilterCount,
    truckOptions,
    // setters
    toggleStatus,
    toggleTruckFilter,
    toggleSaleRepFilter,
    setStatuses,
    setTruckIds,
    setSearchQuery,
    setSaleReps,
    setWeightRange,
    resetFilters,
    
  };
}
