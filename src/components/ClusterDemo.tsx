import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DraggablePanel } from '@/components/DraggablePanel';
import { ClusterPoint } from '@/lib/mapUtils';

// Sample data for demonstration
const generateSamplePoints = (count: number = 50): ClusterPoint[] => {
  const points: ClusterPoint[] = [];
  
  // Generate random points within Chhattisgarh bounds
  const minLon = 80.0;
  const maxLon = 84.5;
  const minLat = 17.5;
  const maxLat = 24.5;
  
  const pointTypes = ['mining', 'agriculture', 'forest', 'water', 'urban'];
  const miningNames = ['Iron Ore Mine', 'Coal Mine', 'Bauxite Mine', 'Limestone Quarry', 'Gold Mine'];
  const agricultureNames = ['Rice Field', 'Wheat Farm', 'Cotton Field', 'Sugarcane Plantation', 'Vegetable Farm'];
  const forestNames = ['Teak Forest', 'Sal Forest', 'Bamboo Grove', 'Mixed Forest', 'Protected Area'];
  const waterNames = ['River', 'Lake', 'Pond', 'Reservoir', 'Waterfall'];
  const urbanNames = ['City Center', 'Industrial Area', 'Residential Zone', 'Commercial District', 'Transport Hub'];
  
  const getNameForType = (type: string, index: number) => {
    switch (type) {
      case 'mining': return miningNames[index % miningNames.length];
      case 'agriculture': return agricultureNames[index % agricultureNames.length];
      case 'forest': return forestNames[index % forestNames.length];
      case 'water': return waterNames[index % waterNames.length];
      case 'urban': return urbanNames[index % urbanNames.length];
      default: return `Sample Point ${index + 1}`;
    }
  };
  
  for (let i = 0; i < count; i++) {
    const lon = minLon + Math.random() * (maxLon - minLon);
    const lat = minLat + Math.random() * (maxLat - minLat);
    const type = pointTypes[Math.floor(Math.random() * pointTypes.length)];
    
    const baseProperties = {
      name: getNameForType(type, i),
      type: type,
      value: Math.floor(Math.random() * 1000) + 100,
      area: Math.floor(Math.random() * 500) + 10, // hectares
      status: Math.random() > 0.3 ? 'active' : 'inactive',
      created: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0]
    };
    
    // Add type-specific properties
    if (type === 'mining') {
      baseProperties.mineral = ['Iron', 'Coal', 'Bauxite', 'Limestone', 'Gold'][Math.floor(Math.random() * 5)];
      baseProperties.production = Math.floor(Math.random() * 10000) + 1000; // tons
    } else if (type === 'agriculture') {
      baseProperties.crop = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Vegetables'][Math.floor(Math.random() * 5)];
      baseProperties.yield = Math.floor(Math.random() * 50) + 5; // tons/hectare
    } else if (type === 'forest') {
      baseProperties.treeSpecies = ['Teak', 'Sal', 'Bamboo', 'Mixed', 'Protected'][Math.floor(Math.random() * 5)];
      baseProperties.coverage = Math.floor(Math.random() * 100) + 10; // percentage
    } else if (type === 'water') {
      baseProperties.depth = Math.floor(Math.random() * 50) + 5; // meters
      baseProperties.quality = ['Excellent', 'Good', 'Fair', 'Poor'][Math.floor(Math.random() * 4)];
    } else if (type === 'urban') {
      baseProperties.population = Math.floor(Math.random() * 100000) + 1000;
      baseProperties.infrastructure = ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)];
    }
    
    points.push({
      id: `point-${i}`,
      coordinates: [lon, lat],
      properties: baseProperties
    });
  }
  
  return points;
};

interface ClusterDemoProps {
  onPointsChange: (points: ClusterPoint[]) => void;
  onShowClustersChange: (show: boolean) => void;
  currentPoints: ClusterPoint[];
  showClusters: boolean;
  visible?: boolean;
  onClose?: () => void;
}

export const ClusterDemo: React.FC<ClusterDemoProps> = ({
  onPointsChange,
  onShowClustersChange,
  currentPoints,
  showClusters,
  visible = true,
  onClose
}) => {
  const [pointCount, setPointCount] = useState(50);

  const handleGeneratePoints = () => {
    const newPoints = generateSamplePoints(pointCount);
    onPointsChange(newPoints);
  };

  const handleClearPoints = () => {
    onPointsChange([]);
  };

  if (!visible) return null;

  return (
    <DraggablePanel
      title="Cluster Demo"
      defaultPosition={{ x: 0, y: 0 }}
      onClose={onClose}
      minWidth={320}
      minHeight={400}
      panelType="cluster-demo"
      panelIndex={0}
    >
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-3">
          Generate sample points to test clustering functionality
        </div>

        <div className="space-y-2">
          <Label htmlFor="point-count">Number of Points</Label>
          <div className="flex items-center space-x-2">
            <input
              id="point-count"
              type="range"
              min="10"
              max="200"
              value={pointCount}
              onChange={(e) => setPointCount(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12">{pointCount}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleGeneratePoints} className="flex-1">
            Generate Points
          </Button>
          <Button onClick={handleClearPoints} variant="outline" className="flex-1">
            Clear All
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="show-clusters"
            checked={showClusters}
            onCheckedChange={onShowClustersChange}
          />
          <Label htmlFor="show-clusters">Show Clusters</Label>
        </div>

        <div className="text-sm text-gray-600">
          <p>Current points: {currentPoints.length}</p>
          <p>Status: {showClusters ? 'Clustering enabled' : 'Clustering disabled'}</p>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Instructions:</strong></p>
          <p>• Generate points to see clustering in action</p>
          <p>• Zoom out to see more clustering</p>
          <p>• Zoom in to see individual points</p>
          <p>• Toggle clustering on/off</p>
        </div>
      </div>
    </DraggablePanel>
  );
};
