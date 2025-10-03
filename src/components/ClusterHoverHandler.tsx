import React, { useEffect, useRef } from 'react';
import { Map } from 'ol';
import { ClusterPoint } from '@/lib/mapUtils';

interface ClusterHoverHandlerProps {
  map: Map | null;
  onPointHover: (point: ClusterPoint, pixel: [number, number]) => void;
  onPointLeave: () => void;
}

export const ClusterHoverHandler: React.FC<ClusterHoverHandlerProps> = ({
  map,
  onPointHover,
  onPointLeave
}) => {
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!map) return;

    const handlePointerMove = (event: any) => {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      const features = map.getFeaturesAtPixel(event.pixel);
      
      if (features && features.length > 0) {
        const feature = features[0];
        const cluster = feature.get('cluster');
        
        if (cluster) {
          // If it's a single point cluster, show hover for that point
          if (cluster.count === 1 && cluster.points.length === 1) {
            const point = cluster.points[0];
            onPointHover(point, event.pixel);
            return;
          }
          
          // For multi-point clusters, show hover for the first point as representative
          if (cluster.points.length > 0) {
            const representativePoint = cluster.points[0];
            onPointHover(representativePoint, event.pixel);
            return;
          }
        }
      }
      
      // No cluster found, hide hover popup after a short delay
      hoverTimeoutRef.current = setTimeout(() => {
        onPointLeave();
      }, 100);
    };

    const handlePointerLeave = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      onPointLeave();
    };

    // Add event listeners
    map.on('pointermove', handlePointerMove);
    map.on('pointerleave', handlePointerLeave);

    return () => {
      // Cleanup
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      
      map.un('pointermove', handlePointerMove);
      map.un('pointerleave', handlePointerLeave);
    };
  }, [map, onPointHover, onPointLeave]);

  return null; // This component doesn't render anything visible
};



