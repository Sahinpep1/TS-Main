import React from "react";
import "./MapToolbar.css";

interface MapToolbarProps {
  onZoomToFit?: () => void;
  onToggleClustering?: () => void;
  isClusteringEnabled?: boolean;
}

export function MapToolbar({
  onZoomToFit,
  onToggleClustering,
  isClusteringEnabled = false,
}: MapToolbarProps) {
  return (
    <div className="map-toolbar">
      <button 
        className="map-toolbar-btn" 
        onClick={onZoomToFit} 
        title="Zoom to Fit"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </button>

      <button 
        className={`map-toolbar-btn ${isClusteringEnabled ? 'active' : ''}`} 
        onClick={onToggleClustering} 
        title="Toggle Clustering"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19 5c-1.5 0-2.8 1.4-3 3M5 19c1.5 0 2.8-1.4 3-3M5 5c1.5 0 2.8 1.4 3 3M19 19c-1.5 0-2.8-1.4-3-3" />
        </svg>
      </button>
    </div>
  );
}
