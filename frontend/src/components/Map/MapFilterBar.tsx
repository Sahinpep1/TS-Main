import React from "react";
import "./MapFilterBar.css";
import { MultiSelect, type Option } from "../ui/MultiSelect";
import type { Priority, DeliveryStatus } from "../../types";

interface MapFilterBarProps {
  filters: any;
  activeFilterCount: number;
  truckOptions: Option<number>[];
  togglePriority: (p: Priority) => void;
  toggleStatus: (s: DeliveryStatus) => void;
  toggleTruckFilter: (id: number) => void;
  setPriorities: (priorities: Priority[]) => void;
  setStatuses: (statuses: DeliveryStatus[]) => void;
  setTruckIds: (ids: number[]) => void;
  resetFilters: () => void;
}

const PRIORITY_OPTIONS: Option<Priority>[] = [
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
];

const STATUS_OPTIONS: Option<DeliveryStatus>[] = [
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "delivered", label: "Delivered" },
];

export function MapFilterBar({
  filters,
  activeFilterCount,
  truckOptions,
  togglePriority,
  toggleStatus,
  toggleTruckFilter,
  setPriorities,
  setStatuses,
  setTruckIds,
  resetFilters,
}: MapFilterBarProps) {
  return (
    <div className="map-filter-bar">
      <div className="map-filter-bar-inner">
        <div className="map-filter-group">
          <MultiSelect<Priority>
            label="Priority"
            options={PRIORITY_OPTIONS}
            selected={filters.priorities}
            onChange={(selected) => setPriorities(Array.from(selected))}
            searchable={false}
          />
        </div>

        <div className="map-filter-divider" />

        <div className="map-filter-group">
          <MultiSelect<DeliveryStatus>
            label="Status"
            options={STATUS_OPTIONS}
            selected={filters.statuses}
            onChange={(selected) => setStatuses(Array.from(selected))}
            searchable={false}
          />
        </div>

        <div className="map-filter-divider" />

        <div className="map-filter-group">
          <MultiSelect<number>
            label="Truck"
            options={truckOptions}
            selected={filters.truckIds}
            onChange={(selected) => setTruckIds(Array.from(selected))}
            searchable={true}
          />
        </div>

        {activeFilterCount > 0 && (
          <>
            <div className="map-filter-divider" />
            <button className="map-filter-reset" onClick={resetFilters}>
              Reset Filters ({activeFilterCount})
            </button>
          </>
        )}
      </div>
    </div>
  );
}
