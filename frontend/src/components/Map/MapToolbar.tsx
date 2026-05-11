import React from "react";
import { Maximize, Layers, Flame } from "lucide-react";
import "./MapToolbar.css";

interface MapToolbarProps {
  onZoomToFit?: () => void;
  onToggleClustering?: () => void;
  isClusteringEnabled?: boolean;
  onToggleHeatmap?: () => void;
  isHeatmapActive?: boolean;
}

export function MapToolbar({
  onZoomToFit,
  onToggleClustering,
  isClusteringEnabled = false,
  onToggleHeatmap,
  isHeatmapActive = false,
}: MapToolbarProps) {
  return (
    <div className="map-toolbar">
      <button 
        className="map-toolbar-btn" 
        onClick={onZoomToFit} 
        title="Zoom to Fit"
      >
        <Maximize size={20} />
      </button>

      <button 
        className={`map-toolbar-btn ${isClusteringEnabled ? 'active' : ''}`} 
        onClick={onToggleClustering} 
        title="Toggle Clustering"
      >
        <Layers size={20} />
      </button>

      <button 
        className={`map-toolbar-btn ${isHeatmapActive ? 'active' : ''}`} 
        onClick={onToggleHeatmap} 
        title="Toggle Heat Map"
        style={{ color: isHeatmapActive ? '#ef4444' : 'inherit' }}
      >
        <Flame size={20} />
      </button>
    </div>
  );
}
