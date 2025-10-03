# Clustering Component for Geoportal Dashboard

This document describes the clustering functionality implemented for the Geoportal Dashboard, which groups nearby points and displays numbers when zoomed out.

## Overview

The clustering system automatically groups nearby points on the map based on zoom level and distance. When zoomed out, multiple points are combined into clusters showing the count of points within each cluster. As you zoom in, clusters break apart to show individual points.

## Components

### 1. ClusterLayer (`src/components/ClusterLayer.tsx`)
A React component that manages the clustering layer on the OpenLayers map.

**Props:**
- `map: Map | null` - The OpenLayers map instance
- `points: ClusterPoint[]` - Array of points to cluster
- `clusterRadius?: number` - Radius for clustering (default: 50km)
- `visible?: boolean` - Whether clusters are visible (default: true)

**Features:**
- Automatically updates clusters when zoom level changes
- Handles point data changes dynamically
- Manages layer lifecycle (add/remove from map)

### 2. ClusterMarker (`src/components/ClusterMarker.tsx`)
React components for rendering individual cluster markers.

**Components:**
- `ClusterMarker` - Full-featured cluster marker with hover effects
- `CompactClusterMarker` - Smaller version for mobile/small displays

**Props:**
- `cluster: Cluster` - Cluster data object
- `onClick?: (cluster: Cluster) => void` - Click handler
- `className?: string` - Additional CSS classes

**Features:**
- Dynamic sizing based on cluster count
- Color coding (green for single points, blue for clusters)
- Hover tooltips
- Pulse animation for multi-point clusters

### 3. ClusterDemo (`src/components/ClusterDemo.tsx`)
Demo component for testing clustering functionality with sample data.

**Props:**
- `onPointsChange: (points: ClusterPoint[]) => void` - Callback for point changes
- `onShowClustersChange: (show: boolean) => void` - Callback for visibility toggle
- `currentPoints: ClusterPoint[]` - Current points array
- `showClusters: boolean` - Current visibility state

**Features:**
- Generate random sample points within Chhattisgarh bounds
- Adjustable point count (10-200)
- Toggle clustering on/off
- Clear all points
- Real-time status display

## Utilities (`src/lib/mapUtils.ts`)

### Types
```typescript
interface ClusterPoint {
  id: string;
  coordinates: [number, number];
  properties?: Record<string, any>;
}

interface Cluster {
  center: [number, number];
  points: ClusterPoint[];
  count: number;
}
```

### Functions

#### `calculateDistance(point1, point2): number`
Calculates the distance between two geographic points using the Haversine formula.

#### `clusterPoints(points, clusterRadius): Cluster[]`
Groups nearby points into clusters based on the specified radius.

#### `createClusterStyle(cluster, zoom): Style`
Creates OpenLayers style for cluster markers with dynamic sizing and colors.

#### `createClusterLayer(points, clusterRadius): VectorLayer`
Creates a complete OpenLayers vector layer with clustering functionality.

## Usage

### Basic Integration

```typescript
import { ClusterLayer } from '@/components/ClusterLayer';
import { ClusterPoint } from '@/lib/mapUtils';

const MyMapComponent = () => {
  const [points, setPoints] = useState<ClusterPoint[]>([]);
  const [map, setMap] = useState<Map | null>(null);

  return (
    <div>
      <div ref={mapRef} className="map-container" />
      <ClusterLayer 
        map={map} 
        points={points} 
        clusterRadius={50}
        visible={true}
      />
    </div>
  );
};
```

### With Sample Data

```typescript
import { ClusterDemo } from '@/components/ClusterDemo';

const App = () => {
  const [clusterPoints, setClusterPoints] = useState<ClusterPoint[]>([]);
  const [showClusters, setShowClusters] = useState(true);

  return (
    <div>
      <ClusterDemo
        onPointsChange={setClusterPoints}
        onShowClustersChange={setShowClusters}
        currentPoints={clusterPoints}
        showClusters={showClusters}
      />
      <MapContainer 
        clusterPoints={clusterPoints}
        showClusters={showClusters}
      />
    </div>
  );
};
```

## Features

### Dynamic Clustering
- Clusters automatically adjust based on zoom level
- Higher zoom = smaller clusters, more individual points
- Lower zoom = larger clusters, fewer individual points

### Visual Design
- **Single Points**: Green circles with white numbers
- **Clusters**: Blue circles with white numbers
- **Sizing**: Proportional to point count (minimum 20px, maximum 60px)
- **Animation**: Pulse effect for multi-point clusters

### Performance
- Efficient distance calculations using Haversine formula
- Optimized clustering algorithm
- Dynamic radius adjustment based on zoom level
- Minimal re-renders with React optimization

### Responsive Design
- Compact markers for mobile devices
- Adaptive sizing based on screen size
- Touch-friendly interaction areas

## Configuration

### Cluster Radius
The default cluster radius is 50km, but can be adjusted:

```typescript
<ClusterLayer 
  map={map} 
  points={points} 
  clusterRadius={100} // 100km radius
/>
```

### Styling
Cluster appearance can be customized by modifying the `createClusterStyle` function:

```typescript
export const createClusterStyle = (cluster: Cluster, zoom: number) => {
  const size = Math.max(20, Math.min(60, cluster.count * 8));
  const color = cluster.count === 1 ? '#10b981' : '#3b82f6'; // Custom colors
  
  return new Style({
    // ... style configuration
  });
};
```

## Integration with MapContainer

The clustering functionality is fully integrated into the main `MapContainer` component:

```typescript
interface MapContainerProps {
  selectedLayers: string[];
  onLayerSelectionChange: (layers: string[]) => void;
  clusterPoints?: ClusterPoint[];      // New prop
  showClusters?: boolean;              // New prop
}
```

## Testing

Use the `ClusterDemo` component to test clustering functionality:

1. **Generate Points**: Click "Generate Points" to create sample data
2. **Adjust Count**: Use the slider to change the number of points (10-200)
3. **Toggle Clustering**: Use the switch to enable/disable clustering
4. **Zoom Testing**: Zoom in/out to see clustering behavior
5. **Clear Data**: Click "Clear All" to remove all points

## Browser Support

- Modern browsers with ES6+ support
- OpenLayers 10.6.1+
- React 19.1.1+

## Performance Considerations

- Clustering is performed on zoom changes, not on every map movement
- Distance calculations are optimized for geographic coordinates
- Memory usage scales linearly with point count
- Recommended maximum: 1000 points for optimal performance

## Future Enhancements

Potential improvements for the clustering system:

1. **Custom Clustering Algorithms**: Implement different clustering strategies
2. **Cluster Popups**: Show detailed information when clicking clusters
3. **Animation**: Smooth transitions when clusters break apart
4. **Custom Icons**: Support for different marker types
5. **Data Filtering**: Cluster only visible/selected points
6. **Export Functionality**: Export clustered data
7. **Real-time Updates**: Dynamic clustering for live data feeds



