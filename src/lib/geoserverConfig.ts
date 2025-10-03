// GeoServer Configuration for Preschool GeoPortal
// This file contains the complete layer configuration matching the GeoServer setup

export interface GeoServerLayerConfig {
  id: string;
  typeName: string;
  maxFeatures?: number;
  cqlFilter?: string;
  style: {
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
    fillOpacity?: number;
    color?: string;
  };
  description: string;
}

// Complete list of layers as per GeoServer configuration
export const geoserverLayers: Record<string, GeoServerLayerConfig> = {
  // 1. State Boundary Layer
  state: {
    id: 'state',
    typeName: 'ch_dep_data:cg_state_boundary',
    maxFeatures: 1,
    style: {
      stroke: '#000000',
      strokeWidth: 3,
      fill: '#f5f5f5',
      fillOpacity: 0.3,
      color: '#000000'
    },
    description: 'Chhattisgarh state outline'
  },

  // 2. District Boundary Layer
  district: {
    id: 'district',
    typeName: 'ch_dep_data:cg_district_boundary',
    maxFeatures: 50,
    style: {
      stroke: '#e53935',
      strokeWidth: 2,
      fill: 'transparent',
      fillOpacity: 0,
      color: '#e53935'
    },
    description: 'Administrative district boundaries'
  },

  // 3. Village Boundary Layer
  village: {
    id: 'village',
    typeName: 'ch_dep_data:cg_village_boundary',
    style: {
      stroke: '#1e88e5',
      strokeWidth: 1,
      fill: '#e3f2fd',
      fillOpacity: 0.3,
      color: '#1e88e5'
    },
    description: 'Village-level administrative boundaries'
  },

  // 4. Anganwadi Centers Layer
  anganwadi: {
    id: 'anganwadi',
    typeName: 'ch_dep_data:cg_aganwadi',
    style: {
      color: '#43a047',
      fill: '#43a047',
      fillOpacity: 0.8
    },
    description: 'Educational centers with service coverage'
  },

  // 5. Schools Layer
  schools: {
    id: 'schools',
    typeName: 'ch_dep_data:cg_school',
    cqlFilter: "category_o='Primary'",
    style: {
      color: '#2196f3',
      fill: '#2196f3',
      fillOpacity: 0.8
    },
    description: 'Primary schools'
  },

  // 6. Railway Layer
  rail: {
    id: 'rail',
    typeName: 'ch_dep_data:cg_rail_line',
    maxFeatures: 100000,
    style: {
      stroke: '#75120eff',
      strokeWidth: 2,
      color: '#75120eff'
    },
    description: 'Railway lines'
  },

  // 7. River Layer
  river: {
    id: 'river',
    typeName: 'ch_dep_data:cg_river_poly',
    maxFeatures: 100000,
    style: {
      stroke: '#64c6d3ff',
      strokeWidth: 1,
      fill: '#64c6d3ff',
      fillOpacity: 0.6,
      color: '#64c6d3ff'
    },
    description: 'River polygons'
  },

  // 8. Road Layer
  road: {
    id: 'road',
    typeName: 'ch_dep_data:cg_nh_sh_road',
    maxFeatures: 100000,
    style: {
      stroke: '#e283ceff',
      strokeWidth: 2,
      color: '#e283ceff'
    },
    description: 'National Highway and State Highway roads'
  }
};

// Helper function to get layer configuration
export const getLayerConfig = (layerId: string): GeoServerLayerConfig | undefined => {
  return geoserverLayers[layerId];
};

// Helper function to get all layer IDs
export const getAllLayerIds = (): string[] => {
  return Object.keys(geoserverLayers);
};

// Helper function to get layers by category
export const getLayersByCategory = (category: 'boundaries' | 'education' | 'infrastructure'): string[] => {
  const categories = {
    boundaries: ['state', 'district', 'village'],
    education: ['anganwadi', 'schools'],
    infrastructure: ['rail', 'river', 'road']
  };
  
  return categories[category] || [];
};
