import React from "react";
import "./MapFilterBar.css";
import { MultiSelect, type Option } from "../ui/MultiSelect";
import type { DeliveryStatus ,SalesRepOption } from "../../types";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"

interface MapFilterBarProps {
  filters: any;
  activeFilterCount: number;
  truckOptions: Option<number>[];
  salesRepsData: SalesRepOption[];
  toggleStatus: (s: DeliveryStatus) => void;
  toggleTruckFilter: (id: number) => void;
  setStatuses: (statuses: DeliveryStatus[]) => void;
  setTruckIds: (ids: number[]) => void;
  setSaleReps: (reps: string[]) => void;
  resetFilters: () => void;
}



const STATUS_OPTIONS: Option<DeliveryStatus>[] = [
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "delivered", label: "Delivered" },
];

export function MapFilterBar({
  filters,
  activeFilterCount,
  truckOptions,
  toggleStatus,
  toggleTruckFilter,
  setStatuses,
  setTruckIds,
  setSaleReps,
  resetFilters,
  salesRepsData,
}: MapFilterBarProps) {
  return (
    <div className="map-filter-bar">
      <div className="map-filter-bar-inner">


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
       {/* Updated NativeSelect Implementation */}
        
        <div className="map-filter-group">
          <MultiSelect<string>
            label="Sales Rep"
            options={salesRepsData.map((rep) => ({ value: rep.sales_rep, label: rep.sales_rep }))}
            selected={filters.saleReps}
            onChange={(selected) => setSaleReps(Array.from(selected))}
            searchable={true}
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
