// GeoJSON utility functions for OpenLayers integration

import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { fromLonLat, toLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';

// Convert OpenLayers feature to GeoJSON (4326)
export const to4326 = (feature: Feature<Geometry>): any => {
  const format = new GeoJSON();
  const geoJson = format.writeFeature(feature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });
  return JSON.parse(geoJson);
};

// Convert GeoJSON to OpenLayers feature (3857)
export const read3857 = (geoJson: any): Feature<Geometry> => {
  const format = new GeoJSON();
  return format.readFeature(geoJson, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });
};

// Convert GeoJSON features to OpenLayers features (3857)
export const readFeatures3857 = (geoJson: any): Feature<Geometry>[] => {
  const format = new GeoJSON();
  return format.readFeatures(geoJson, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });
};

// Format coordinates for display
export const geoFmt = (coords: [number, number]): string => {
  const [lng, lat] = coords;
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

// Convert lon/lat to OpenLayers coordinates
export const fromLonLatCoords = (coords: [number, number]): [number, number] => {
  return fromLonLat(coords);
};

// Convert OpenLayers coordinates to lon/lat
export const toLonLatCoords = (coords: [number, number]): [number, number] => {
  return toLonLat(coords);
};

