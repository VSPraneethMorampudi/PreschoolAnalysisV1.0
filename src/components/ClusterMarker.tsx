import React from "react";
import { Cluster } from "@/lib/mapUtils";

interface ClusterMarkerProps {
  cluster: Cluster;
  onClick?: (cluster: Cluster) => void;
  className?: string;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  cluster,
  onClick,
  className = "",
}) => {
  const size = Math.max(40, Math.min(80, cluster.count * 10));
  const color = cluster.count === 1 ? "bg-blue-500" : "bg-blue-600";

  return (
    <div
      className={`
        relative flex items-center justify-center rounded-full border-2 border-white shadow-lg cursor-pointer
        ${color} ${className}
        hover:scale-110 transition-transform duration-200
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: "40px",
        minHeight: "40px",
      }}
      onClick={() => onClick?.(cluster)}
      title={`${cluster.count} point${cluster.count > 1 ? "s" : ""}`}
    >
      <span className="text-white font-bold text-sm drop-shadow-sm">
        {cluster.count}
      </span>

      {/* Pulse animation for clusters with multiple points */}
      {cluster.count > 1 && (
        <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30"></div>
      )}

      {/* Tooltip-like info on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {cluster.count} point{cluster.count > 1 ? "s" : ""}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

// Alternative compact version for smaller displays
export const CompactClusterMarker: React.FC<ClusterMarkerProps> = ({
  cluster,
  onClick,
  className = "",
}) => {
  const size = Math.max(24, Math.min(40, cluster.count * 6));
  const color = cluster.count === 1 ? "bg-blue-500" : "bg-blue-600";

  return (
    <div
      className={`
        relative flex items-center justify-center rounded-full border border-white shadow-md cursor-pointer
        ${color} ${className}
        hover:scale-110 transition-transform duration-200
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: "24px",
        minHeight: "24px",
      }}
      onClick={() => onClick?.(cluster)}
      title={`${cluster.count} point${cluster.count > 1 ? "s" : ""}`}
    >
      <span className="text-white font-semibold text-xs">{cluster.count}</span>
    </div>
  );
};
