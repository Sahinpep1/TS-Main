import React, { useState } from "react";
import type { Truck } from "../../types";
import TruckCard from "../TruckCard/TruckCard";
import "./Sidebar.css";
import SearchInput from "../ui/SearchInput";

interface TruckListProps {
  trucks: Truck[];
  selectedTruckId: number | null;
  onSelectTruck: (truckId: number) => void;
}

export default function TruckList({ trucks, selectedTruckId, onSelectTruck }: TruckListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrucks = trucks.filter(t => 
    t.plate.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sidebar__truck-list-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div className="sidebar__section-header" style={{ flexShrink: 0, paddingBottom: '12px' }}>
        <h2 className="sidebar__section-title">Fleet ({filteredTrucks.length})</h2>
        {selectedTruckId && (
          <span className="sidebar__selection-hint">
            Selected: #{selectedTruckId}
          </span>
        )}
      </div>

      <div style={{ padding: '0 20px 12px 20px', flexShrink: 0 }}>
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search trucks..."
        />
      </div>

      <div className="sidebar__trucks" style={{ flex: 1, overflowY: 'auto' }}>
        {filteredTrucks.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#a1a1aa' }}>
            No trucks found
          </div>
        ) : (
          filteredTrucks.map((truck) => (
            <TruckCard
              key={truck.id}
              truck={truck}
              isSelected={selectedTruckId === truck.id}
              onSelect={onSelectTruck}
            />
          ))
        )}
      </div>
    </div>
  );
}
