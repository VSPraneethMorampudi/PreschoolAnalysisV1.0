import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { OSM, TileWMS, XYZ } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { Point, Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import { GeoJSON } from 'ol/format';
import { LayerConfig } from './layerData';

// Chhattisgarh center coordinates
export const CHHATTISGARH_CENTER = [82.1409, 21.2787];
export const CHHATTISGARH_EXTENT = [80.0, 17.5, 84.5, 24.5];

// Test GeoServer WFS service
export const testGeoServerWFS = async (layerId: string, typeName: string) => {
  const testUrl = `http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${typeName}&maxFeatures=5&outputFormat=application%2Fjson`;
  
  try {
    console.log(`Testing WFS for ${layerId}: ${testUrl}`);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error(`HTTP error for ${layerId}: ${response.status} ${response.statusText}`);
      return false;
    }
    
    const data = await response.json();
    console.log(`✅ WFS layer ${layerId} loaded successfully:`, data);
    
    if (data.features && data.features.length > 0) {
      console.log(`📊 Found ${data.features.length} features in ${layerId}`);
      return true;
    } else {
      console.warn(`⚠️ No features found in ${layerId}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Network error for ${layerId}:`, error);
    return false;
  }
};

// Chhattisgarh state boundary coordinates (approximate polygon)
export const CHHATTISGARH_BOUNDARY = [
  [80.0, 17.5], [84.5, 17.5], [84.5, 24.5], [80.0, 24.5], [80.0, 17.5]
];

// Create a mask layer to grey out areas outside Chhattisgarh
export const createStateMaskLayer = (): VectorLayer<VectorSource> => {
  const source = new VectorSource();
  
  // Create a more precise mask using multiple polygons to cover areas outside Chhattisgarh
  const maskPolygons = [
    // North mask (above Chhattisgarh)
    [[-180, 24.5], [180, 24.5], [180, 90], [-180, 90], [-180, 24.5]],
    // South mask (below Chhattisgarh)
    [[-180, -90], [180, -90], [180, 17.5], [-180, 17.5], [-180, -90]],
    // West mask (left of Chhattisgarh)
    [[-180, 17.5], [80.0, 17.5], [80.0, 24.5], [-180, 24.5], [-180, 17.5]],
    // East mask (right of Chhattisgarh)
    [[84.5, 17.5], [180, 17.5], [180, 24.5], [84.5, 24.5], [84.5, 17.5]]
  ];
  
  maskPolygons.forEach(polygonCoords => {
    const polygon = new Polygon([polygonCoords.map(coord => fromLonLat(coord))]);
    const maskFeature = new Feature({
      geometry: polygon
    });
    source.addFeature(maskFeature);
  });
  
  const maskLayer = new VectorLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: 'rgba(128, 128, 128, 0.8)' // More opaque grey
      })
    }),
    zIndex: 1000 // High z-index to appear above basemap
  });
  
  maskLayer.set('id', 'state_mask');
  maskLayer.set('title', 'State Mask');
  
  return maskLayer;
};

// Basemap configurations
export const createBasemapLayer = (basemapId: string): TileLayer => {
  switch (basemapId) {
    case 'osm':
      const osmLayer = new TileLayer({
        source: new OSM(),
        visible: true
      });
      osmLayer.set('id', 'base');
      osmLayer.set('title', 'OpenStreetMap');
      return osmLayer;
    
    case 'satellite':
      const satelliteLayer = new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          maxZoom: 19,
        }),
        visible: true
      });
      satelliteLayer.set('id', 'base');
      satelliteLayer.set('title', 'Satellite');
      return satelliteLayer;
    
    case 'terrain':
      const terrainLayer = new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          maxZoom: 19,
        }),
        visible: true
      });
      terrainLayer.set('id', 'base');
      terrainLayer.set('title', 'Terrain');
      return terrainLayer;
    
    case 'hybrid':
      const hybridLayer = new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
          maxZoom: 19,
        }),
        visible: true
      });
      hybridLayer.set('id', 'base');
      hybridLayer.set('title', 'Hybrid');
      return hybridLayer;
    
    default:
      const defaultLayer = new TileLayer({
        source: new OSM(),
        visible: true
      });
      defaultLayer.set('id', 'base');
      defaultLayer.set('title', 'OpenStreetMap');
      return defaultLayer;
  }
};

export const initializeOpenLayersMap = (target: HTMLElement, basemapId: string = 'osm'): Map => {
  const chhattisgarhCenter = fromLonLat(CHHATTISGARH_CENTER);
  
  // Base layer - create based on basemapId
  const baseLayer = createBasemapLayer(basemapId);
  
  // Create state mask layer
  const maskLayer = createStateMaskLayer();

  // Initialize map
  const map = new Map({
    target: target,
    layers: [baseLayer, maskLayer],
    view: new View({
      center: chhattisgarhCenter,
      zoom: 6.8,
      minZoom: 6,
      maxZoom: 18,
    }),
    controls: defaultControls({
      attribution: false,
      zoom: false,
      rotate: false,
    }),
  });

  return map;
};

export const createLayerFromConfig = (config: LayerConfig): TileLayer<TileWMS> | VectorLayer<VectorSource> => {
  switch (config.type) {
    case 'wms':
      return new TileLayer({
        source: new TileWMS({
          url: config.url,
          params: {
            'LAYERS': config.layers,
            'TILED': true,
            'FORMAT': 'image/png',
            'TRANSPARENT': true,
          },
          serverType: 'geoserver',
        }),
        opacity: config.opacity || 1,
        visible: false,
      });
    case 'wfs':
      const wfsSource = new VectorSource({
        format: new GeoJSON(),
        url: config.url,
        strategy: function(extent, resolution) {
          // Use a simple strategy to load all features
          return [extent];
        }
      });
      
      // Test the URL accessibility
      fetch(config.url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      })
        .then(response => {
          if (!response.ok) {
            console.error(`HTTP error for ${config.id}: ${response.status} ${response.statusText}`);
            console.error(`URL: ${config.url}`);
          } else {
            console.log(`URL accessible for ${config.id}`);
            return response.json();
          }
        })
        .then(data => {
          if (data && data.features) {
            console.log(`WFS layer ${config.id} has ${data.features.length} features`);
          }
        })
        .catch(error => {
          console.error(`Network error for ${config.id}:`, error);
          console.error(`URL: ${config.url}`);
        });
      
      const wfsLayer = new VectorLayer({
        source: wfsSource,
        opacity: config.opacity || 1,
        visible: false,
        style: new Style({
          fill: new Fill({
            color: config.color ? config.color + '40' : '#3b82f640',
          }),
          stroke: new Stroke({
            color: config.color || '#3b82f6',
            width: 2,
          }),
        }),
      });
      
      return wfsLayer;
    default:
      throw new Error(`Unsupported layer type: ${config.type}`);
  }
};

export const updateLayerVisibility = (map: Map, selectedLayers: string[]): void => {
  map.getLayers().forEach((layer) => {
    const layerId = layer.get('id');
    if (layerId && layerId !== 'base') {
      layer.setVisible(selectedLayers.includes(layerId));
    }
  });
};

export const switchBasemap = (map: Map, basemapId: string): void => {
  // Remove existing base layer
  const layers = map.getLayers();
  const baseLayerIndex = layers.getArray().findIndex(layer => layer.get('id') === 'base');
  
  if (baseLayerIndex !== -1) {
    layers.removeAt(baseLayerIndex);
  }
  
  // Add new base layer
  const newBaseLayer = createBasemapLayer(basemapId);
  layers.insertAt(0, newBaseLayer);
};

// Clustering utilities
export interface ClusterPoint {
  id: string;
  coordinates: [number, number];
  properties?: Record<string, any>;
}

export interface Cluster {
  center: [number, number];
  points: ClusterPoint[];
  count: number;
}

export const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (point2[1] - point1[1]) * Math.PI / 180;
  const dLon = (point2[0] - point1[0]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1[1] * Math.PI / 180) * Math.cos(point2[1] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const clusterPoints = (points: ClusterPoint[], clusterRadius: number = 50): Cluster[] => {
  const clusters: Cluster[] = [];
  const processed = new Set<string>();

  points.forEach(point => {
    if (processed.has(point.id)) return;

    const cluster: Cluster = {
      center: point.coordinates,
      points: [point],
      count: 1
    };

    // Find nearby points to cluster
    points.forEach(otherPoint => {
      if (otherPoint.id === point.id || processed.has(otherPoint.id)) return;
      
      const distance = calculateDistance(point.coordinates, otherPoint.coordinates);
      if (distance <= clusterRadius) {
        cluster.points.push(otherPoint);
        cluster.count++;
        processed.add(otherPoint.id);
      }
    });

    // Calculate cluster center
    if (cluster.count > 1) {
      const avgLon = cluster.points.reduce((sum, p) => sum + p.coordinates[0], 0) / cluster.count;
      const avgLat = cluster.points.reduce((sum, p) => sum + p.coordinates[1], 0) / cluster.count;
      cluster.center = [avgLon, avgLat];
    }

    clusters.push(cluster);
    processed.add(point.id);
  });

  return clusters;
};

export const createClusterStyle = (cluster: Cluster, zoom: number) => {
  const size = Math.max(20, Math.min(60, cluster.count * 8));
  const color = cluster.count === 1 ? '#10b981' : '#3b82f6';
  
  return new Style({
    image: new Circle({
      radius: size / 2,
      fill: new Fill({
        color: color + '80' // Add transparency
      }),
      stroke: new Stroke({
        color: color,
        width: 2
      })
    }),
    text: new Text({
      text: cluster.count.toString(),
      font: 'bold 14px Arial',
      fill: new Fill({
        color: '#ffffff'
      }),
      stroke: new Stroke({
        color: '#000000',
        width: 1
      }),
      offsetY: 2
    })
  });
};

export const createClusterLayer = (
  points: ClusterPoint[], 
  clusterRadius: number = 50,
  onPointHover?: (point: ClusterPoint, pixel: [number, number]) => void,
  onPointLeave?: () => void
): VectorLayer<VectorSource> => {
  const source = new VectorSource();
  
  const updateClusters = (zoom: number) => {
    source.clear();
    
    // Adjust cluster radius based on zoom level
    const adjustedRadius = clusterRadius * Math.pow(2, 7 - zoom);
    const clusters = clusterPoints(points, adjustedRadius);
    
    clusters.forEach(cluster => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(cluster.center)),
        cluster: cluster
      });
      
      feature.setStyle(createClusterStyle(cluster, zoom));
      source.addFeature(feature);
    });
  };

  const layer = new VectorLayer({
    source: source
  });
  layer.set('id', 'clusters');
  layer.set('title', 'Clustered Points');

  // Store the update function on the layer for external access
  (layer as any).updateClusters = updateClusters;

  // Add hover functionality if callbacks are provided
  if (onPointHover && onPointLeave) {
    (layer as any).onPointHover = onPointHover;
    (layer as any).onPointLeave = onPointLeave;
  }

  return layer;
};