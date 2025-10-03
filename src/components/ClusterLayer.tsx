import React, { useEffect, useRef } from 'react';
import { Map } from 'ol';
import { ClusterPoint, createClusterLayer } from '@/lib/mapUtils';

interface ClusterLayerProps {
  map: Map | null;
  points: ClusterPoint[];
  clusterRadius?: number;
  visible?: boolean;
  onPointHover?: (point: ClusterPoint, pixel: [number, number]) => void;
  onPointLeave?: () => void;
}

export const ClusterLayer: React.FC<ClusterLayerProps> = ({
  map,
  points,
  clusterRadius = 50,
  visible = true,
  onPointHover,
  onPointLeave
}) => {
  const clusterLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;

    // Remove existing cluster layer if it exists
    if (clusterLayerRef.current) {
      map.removeLayer(clusterLayerRef.current);
    }

    // Create new cluster layer with hover callbacks
    const clusterLayer = createClusterLayer(
      points, 
      clusterRadius, 
      onPointHover, 
      onPointLeave
    );
    clusterLayer.setVisible(visible);
    clusterLayerRef.current = clusterLayer;
    map.addLayer(clusterLayer);

    // Initial cluster update
    const zoom = map.getView().getZoom();
    if (zoom !== undefined && clusterLayer.updateClusters) {
      clusterLayer.updateClusters(zoom);
    }

    // Listen for zoom changes to update clusters
    const handleZoomChange = () => {
      const currentZoom = map.getView().getZoom();
      if (currentZoom !== undefined && clusterLayer.updateClusters) {
        clusterLayer.updateClusters(currentZoom);
      }
    };

    map.getView().on('change:resolution', handleZoomChange);

    return () => {
      if (clusterLayerRef.current) {
        map.removeLayer(clusterLayerRef.current);
        clusterLayerRef.current = null;
      }
      map.getView().un('change:resolution', handleZoomChange);
    };
  }, [map, points, clusterRadius, onPointHover, onPointLeave]);

  useEffect(() => {
    if (clusterLayerRef.current) {
      clusterLayerRef.current.setVisible(visible);
    }
  }, [visible]);

  // Update clusters when points change
  useEffect(() => {
    if (clusterLayerRef.current && map) {
      const zoom = map.getView().getZoom();
      if (zoom !== undefined && clusterLayerRef.current.updateClusters) {
        clusterLayerRef.current.updateClusters(zoom);
      }
    }
  }, [points, map]);

  return null; // This component doesn't render anything visible
};
