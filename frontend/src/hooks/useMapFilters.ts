/**
 * useMapFilters — manages all map filtering state and returns
 * the filtered coordinates. No API calls — purely client-side filtering.
 */

import { useState, useMemo, useCallback } from "react";
import type { Coordinate, Truck, MapFilters, Priority, DeliveryStatus } from "../types";
import { useDebounce } from "./useDebounce";

const ALL_PRIORITIES: Priority[] = ["high", "medium", "low"];
const ALL_STATUSES: DeliveryStatus[] = ["pending", "assigned", "delivered"];

function createDefaultFilters(): MapFilters {
  return {
    priorities: new Set<Priority>(ALL_PRIORITIES),
    statuses: new Set<DeliveryStatus>(ALL_STATUSES),
    truckIds: new Set<number>(),
    searchQuery: "",
    weightRange: [0, Infinity],
  };
}

export function useMapFilters(coordinates: Coordinate[], trucks: Truck[]) {
  const [filters, setFilters] = useState<MapFilters>(createDefaultFilters);

  const debouncedSearch = useDebounce(filters.searchQuery, 250);

  /* ── Setters ─────────────────────────────────────────────── */

  const togglePriority = useCallback((p: Priority) => {
    setFilters((prev) => {
      const next = new Set(prev.priorities);
      next.has(p) ? next.delete(p) : next.add(p);
      return { ...prev, priorities: next };
    });
  }, []);

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

  const setPriorities = useCallback((priorities: Priority[]) => {
    setFilters((prev) => ({ ...prev, priorities: new Set(priorities) }));
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

  const setWeightRange = useCallback((range: [number, number]) => {
    setFilters((prev) => ({ ...prev, weightRange: range }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(createDefaultFilters());
  }, []);

  /* ── Filtered output ─────────────────────────────────────── */

  const filteredCoordinates = useMemo(() => {
    return coordinates.filter((c) => {
      // Priority filter
      if (!filters.priorities.has(c.priority)) return false;

      // Status filter
      if (!filters.statuses.has(c.status)) return false;

      // Truck filter (empty set = show all)
      if (filters.truckIds.size > 0) {
        if (c.assigned_truck_id === null) return false;
        if (!filters.truckIds.has(c.assigned_truck_id)) return false;
      }

      // Search filter
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (!c.label.toLowerCase().includes(q)) return false;
      }

      // Weight range
      const [min, max] = filters.weightRange;
      if (c.weight_kg < min || c.weight_kg > max) return false;

      return true;
    });
  }, [coordinates, filters.priorities, filters.statuses, filters.truckIds, filters.weightRange, debouncedSearch]);

  /* ── Stats ───────────────────────────────────────────────── */

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priorities.size < ALL_PRIORITIES.length) count++;
    if (filters.statuses.size < ALL_STATUSES.length) count++;
    if (filters.truckIds.size > 0) count++;
    if (filters.searchQuery.length > 0) count++;
    if (filters.weightRange[0] > 0 || filters.weightRange[1] < Infinity) count++;
    return count;
  }, [filters]);

  /* ── Truck options for the filter UI ─────────────────────── */

  const truckOptions = useMemo(
    () =>
      trucks.map((t) => ({
        value: t.id,
        label: `${t.name} (${t.plate})`,
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
    togglePriority,
    toggleStatus,
    toggleTruckFilter,
    setPriorities,
    setStatuses,
    setTruckIds,
    setSearchQuery,
    setWeightRange,
    resetFilters,
  };
}
