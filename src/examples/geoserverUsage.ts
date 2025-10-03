// Example usage of GeoServer configuration and WFS utility
import { wfsUrl, fetchJSON } from '@/components/utils/wfs';
import { getLayerConfig, getAllLayerIds } from '@/lib/geoserverConfig';

// Example: Fetch state boundary data
export const fetchStateBoundary = async () => {
  const url = wfsUrl({
    typeName: 'ch_dep_data:cg_state_boundary',
    maxFeatures: 1
  });
  
  try {
    const data = await fetchJSON(url);
    console.log('State boundary data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching state boundary:', error);
    throw error;
  }
};

// Example: Fetch district boundaries
export const fetchDistrictBoundaries = async () => {
  const url = wfsUrl({
    typeName: 'ch_dep_data:cg_district_boundary',
    maxFeatures: 50
  });
  
  try {
    const data = await fetchJSON(url);
    console.log('District boundaries data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching district boundaries:', error);
    throw error;
  }
};

// Example: Fetch schools with CQL filter
export const fetchPrimarySchools = async () => {
  const url = wfsUrl({
    typeName: 'ch_dep_data:cg_school',
    cql: "category_o='Primary'"
  });
  
  try {
    const data = await fetchJSON(url);
    console.log('Primary schools data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching primary schools:', error);
    throw error;
  }
};

// Example: Fetch anganwadi centers
export const fetchAnganwadiCenters = async () => {
  const url = wfsUrl({
    typeName: 'ch_dep_data:cg_aganwadi'
  });
  
  try {
    const data = await fetchJSON(url);
    console.log('Anganwadi centers data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching anganwadi centers:', error);
    throw error;
  }
};

// Example: Fetch railway data
export const fetchRailwayData = async () => {
  const url = wfsUrl({
    typeName: 'ch_dep_data:cg_rail_line',
    maxFeatures: 100000
  });
  
  try {
    const data = await fetchJSON(url);
    console.log('Railway data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching railway data:', error);
    throw error;
  }
};

// Example: Fetch river data
export const fetchRiverData = async () => {
  const url = wfsUrl({
    typeName: 'ch_dep_data:cg_river_poly',
    maxFeatures: 100000
  });
  
  try {
    const data = await fetchJSON(url);
    console.log('River data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching river data:', error);
    throw error;
  }
};

// Example: Fetch road data
export const fetchRoadData = async () => {
  const url = wfsUrl({
    typeName: 'ch_dep_data:cg_nh_sh_road',
    maxFeatures: 100000
  });
  
  try {
    const data = await fetchJSON(url);
    console.log('Road data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching road data:', error);
    throw error;
  }
};

// Example: Get layer configuration
export const getLayerInfo = (layerId: string) => {
  const config = getLayerConfig(layerId);
  if (config) {
    console.log(`Layer ${layerId} configuration:`, config);
    return config;
  } else {
    console.warn(`Layer ${layerId} not found`);
    return null;
  }
};

// Example: Get all available layer IDs
export const listAllLayers = () => {
  const layerIds = getAllLayerIds();
  console.log('Available layers:', layerIds);
  return layerIds;
};

// Example: Batch fetch all layers
export const fetchAllLayers = async () => {
  const layerIds = getAllLayerIds();
  const results: Record<string, any> = {};
  
  for (const layerId of layerIds) {
    const config = getLayerConfig(layerId);
    if (config) {
      try {
        const url = wfsUrl({
          typeName: config.typeName,
          maxFeatures: config.maxFeatures,
          cql: config.cqlFilter
        });
        
        const data = await fetchJSON(url);
        results[layerId] = data;
        console.log(`Fetched ${layerId}:`, data.features?.length || 0, 'features');
      } catch (error) {
        console.error(`Error fetching ${layerId}:`, error);
        results[layerId] = { error: error.message };
      }
    }
  }
  
  return results;
};
