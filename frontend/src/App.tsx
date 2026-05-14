/**
 * App — root component. Switches between MapView and DashboardPage.
 */

import { useState } from "react";
import { useLogistics } from "./hooks/useLogistics";
import { useMapFilters } from "./hooks/useMapFilters";
import { useMultiSelect } from "./hooks/useMultiSelect";

import Sidebar from "./components/Sidebar/Sidebar";
import MapView from "./components/Map/MapView";
import { MapFilterBar } from "./components/Map/MapFilterBar";
import { AppNav, type AppPage } from "./components/AppNav/AppNav";
import { QuickSwitch } from "./components/QuickSwitch/QuickSwitch";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";

import "./App.css";

export default function App() {
  const [page, setPage] = useState<AppPage>("map");

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
    handleUnassign,
    handleAutoAssign,
    handleReset,
    salesRepsData,
    ambalajData,
    st_bazliData
  } = useLogistics();

  const {
    filters,
    filteredCoordinates,
    activeFilterCount,
    truckOptions,
    toggleStatus,
    toggleTruckFilter,
    setStatuses,
    setTruckIds,
    setSaleReps,
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
    for (const coordId of coordSelection.selected) {
      await handleAssign(coordId, selectedTruckId);
    }
    coordSelection.deselectAll();
  };
  const renderPage = () => {
    switch (page) {
      case "map":
        return (
          <div className="app">
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
                salesRepsData={salesRepsData}
                toggleStatus={toggleStatus}
                toggleTruckFilter={toggleTruckFilter}
                setStatuses={setStatuses}
                setTruckIds={setTruckIds}
                setSaleReps={setSaleReps}
                resetFilters={resetFilters}
              />
              <MapView
                coordinates={filteredCoordinates}
                trucks={trucks}
                selectedTruckId={selectedTruckId}
                onAssign={handleMapAssign}
                selectedCoordIds={coordSelection.selected}
                onLassoSelection={(ids) => coordSelection.setSelected(ids)}
                salesRepsData={salesRepsData}
              />

              {/* Batch Assign Overlay */}
              {coordSelection.count > 0 && (
                <div className="batch-assign-overlay" style={{
                  position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)",
                  background: "rgba(15, 23, 42, 0.9)", padding: "12px 24px", borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.3)",
                  display: "flex", alignItems: "center", gap: "16px", zIndex: 1000, color: "white",
                  backdropFilter: "blur(12px)",
                }}>
                  <span><strong>{coordSelection.count}</strong> locations selected</span>
                  {selectedTruckId ? (
                    <button
                      onClick={handleBatchAssign}
                      style={{
                        background: "#6366f1", color: "white", border: "none", padding: "8px 16px",
                        borderRadius: "6px", fontWeight: "bold", cursor: "pointer",
                      }}
                    >
                      Assign to Truck #{selectedTruckId}
                    </button>
                  ) : (
                    <span style={{ color: "#94a3b8", fontSize: "14px" }}>Select a truck in sidebar</span>
                  )}
                  <button
                    onClick={coordSelection.deselectAll}
                    style={{ background: "transparent", border: "none", color: "#ff6b6b", cursor: "pointer", padding: "8px" }}
                  >
                    Clear
                  </button>
                </div>
              )}
            </main>
          </div>
        );

      case "dashboard":
        return (
          <DashboardPage
            coordinates={coordinates}
            trucks={trucks}
            summary={summary}
            selectedTruckId={selectedTruckId}
            onSelectTruck={handleSelectTruck}
            onAssign={handleAssign}
            onUnassign={handleUnassign}
          />
        );

      case "statistics": // YOUR NEW PAGE
        return (
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

            {/* Left Side: Ambalaj Data */}
            <div style={{ flex: 1, border: "1px solid #ccc", padding: "10px" }}>
              <h3>Packaging Data</h3>
              <ul>
                {ambalajData.map((c) => (
                  <li key={c.name}>
                    <pre style={{ fontSize: "12px" }}>{JSON.stringify(c, null, 2)}</pre>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side: Coordinate Data */}
            <div style={{ flex: 1, border: "1px solid #ccc", padding: "10px" }}>
              <h3>Coordinates</h3>
              <ul>
                {coordinates.map((c) => (
                  <li key={c.id}>
                    <pre style={{ fontSize: "12px" }}>{JSON.stringify(c, null, 2)}</pre>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right Side: Coordinate Data */}
            <div style={{ flex: 1, border: "1px solid #ccc", padding: "10px" }}>
              <h3>St_Bazlı</h3>
              <ul>
                {st_bazliData.map((c) => (
                  <li key={c.name}>
                    <pre style={{ fontSize: "12px" }}>{JSON.stringify(c, null, 2)}</pre>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };
  return (
    <div className="app-shell" id="logistics-app">
      <AppNav page={page} onChangePage={setPage} />
      {renderPage()}
    </div>
  );
}
