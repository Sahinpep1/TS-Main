/**
 * App — root component wiring Sidebar + MapView with the useLogistics hook.
 */

import { useLogistics } from "./hooks/useLogistics";
import Sidebar from "./components/Sidebar/Sidebar";
import MapView from "./components/Map/MapView";
import SidebarOC from "./components/SidebarOpenClose/SidebarOC"
import "./App.css";

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
      <main className="app__main">
        <MapView
          coordinates={coordinates}
          trucks={trucks}
          selectedTruckId={selectedTruckId}
          onAssign={handleMapAssign}
        />
      </main>
      <SidebarOC
        trucks={trucks}
        summary={summary}
        selectedTruckId={selectedTruckId}
        onSelectTruck={handleSelectTruck}
        onAutoAssign={handleAutoAssign}
        onReset={handleReset}
      />
    </div>
  );
}
