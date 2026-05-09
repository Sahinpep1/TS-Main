/**
 * App — root component wiring Sidebar + MapView with the useLogistics hook.
 */

import { useLogistics } from "./hooks/useLogistics";
import Sidebar from "./components/Sidebar/Sidebar";
import MapView from "./components/Map/MapView";
import "./App.css";
import { useMapFilters } from "./hooks/useMapFilters";
import { useMultiSelect } from "./hooks/useMultiSelect";
import { MapFilterBar } from "./components/Map/MapFilterBar";

export default function App() {
  const {
    coordinates,
    trucks,
    summary,
    loading,
    error,
    selectedTruckId,
    setSelectedTruckId,
    refresh,
    handleAssign,
    handleAutoAssign,
    handleReset,
  } = useLogistics();

  const {
    filters,
    filteredCoordinates,
    activeFilterCount,
    truckOptions,
    togglePriority,
    toggleStatus,
    toggleTruckFilter,
    setPriorities,
    setStatuses,
    setTruckIds,
    resetFilters,
  } = useMapFilters(coordinates, trucks);

  const coordSelection = useMultiSelect<number>();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <span>Loading logistics data…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <span>⚠️ {error}</span>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }

  const handleSelectTruck = (truckId: number) => {
    setSelectedTruckId((prev) => (prev === truckId ? null : truckId));
  };

  const handleMapAssign = async (coordId: number, truckId: number) => {
    await handleAssign(coordId, truckId);
    coordSelection.deselect(coordId);
  };

  const handleBatchAssign = async () => {
    if (!selectedTruckId || coordSelection.count === 0) return;
    
    // Assign all selected coordinates to the selected truck one by one
    // In a real app you'd add a batchAssign API endpoint.
    for (const coordId of coordSelection.selected) {
      await handleAssign(coordId, selectedTruckId);
    }
    coordSelection.deselectAll();
  };

  return (
    <div className="app" id="logistics-app">
      <Sidebar
        trucks={trucks}
        summary={summary}
        selectedTruckId={selectedTruckId}
        onSelectTruck={handleSelectTruck}
        onAutoAssign={handleAutoAssign}
        onReset={handleReset}
      />
      <main className="app__main" style={{ position: "relative" }}>
        <MapFilterBar
          filters={filters}
          activeFilterCount={activeFilterCount}
          truckOptions={truckOptions}
          togglePriority={togglePriority}
          toggleStatus={toggleStatus}
          toggleTruckFilter={toggleTruckFilter}
          setPriorities={setPriorities}
          setStatuses={setStatuses}
          setTruckIds={setTruckIds}
          resetFilters={resetFilters}
        />
        <MapView
          coordinates={filteredCoordinates}
          trucks={trucks}
          selectedTruckId={selectedTruckId}
          onAssign={handleMapAssign}
          selectedCoordIds={coordSelection.selected}
          onLassoSelection={(ids) => coordSelection.setSelected(ids)}
        />
        
        {/* Batch Assign Overlay */}
        {coordSelection.count > 0 && (
          <div className="batch-assign-overlay" style={{
            position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.9)', padding: '12px 24px', borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1000, color: 'white',
            backdropFilter: 'blur(12px)'
          }}>
            <span><strong>{coordSelection.count}</strong> locations selected</span>
            {selectedTruckId ? (
              <button 
                onClick={handleBatchAssign}
                style={{
                  background: '#6366f1', color: 'white', border: 'none', padding: '8px 16px',
                  borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                Assign to Truck #{selectedTruckId}
              </button>
            ) : (
              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Select a truck in sidebar</span>
            )}
            <button 
              onClick={coordSelection.deselectAll}
              style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '8px' }}
            >
              Clear
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
