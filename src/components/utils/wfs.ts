// WFS utility functions for GeoServer integration
import { toast } from '@/components/ui/sonner';

// Debounce network error notifications to avoid spam
let lastNetworkErrorTime = 0;
const NETWORK_ERROR_DEBOUNCE_MS = 10000; // 10 seconds

// Get GeoServer base URL with priority system
const getGeoServerBaseUrl = (): string => {
  // Priority 1: Vite environment variable
  if (import.meta.env.VITE_GEOSERVER_BASE) {
    return import.meta.env.VITE_GEOSERVER_BASE;
  }
  
  // Priority 2: Create React App environment variable (for compatibility)
  if (import.meta.env.REACT_APP_GEOSERVER_BASE) {
    return import.meta.env.REACT_APP_GEOSERVER_BASE;
  }
  
  // Priority 3: Global window override
  if (typeof window !== 'undefined' && (window as any).__GEOSERVER_BASE__) {
    return (window as any).__GEOSERVER_BASE__;
  }
  
  // Priority 4: Use proxy in development mode to avoid CORS issues
  if (import.meta.env.DEV) {
    return '/geoserver';
  }
  
  // Priority 5: Fallback default for production
  return 'http://localhost:8080/geoserver';
};

export const wfsUrl = (params: {
  typeName: string;
  maxFeatures?: number;
  cql?: string;
  outputFormat?: string;
  version?: string;
  service?: string;
  request?: string;
}) => {
  const {
    typeName,
    maxFeatures = 1000,
    cql,
    outputFormat = "application/json",
    version = "1.0.0",
    service = "WFS",
    request = "GetFeature",
  } = params;

  const baseUrl = getGeoServerBaseUrl();
  
  const urlParams = new URLSearchParams({
    service,
    version,
    request,
    typeName,
    outputFormat,
    maxFeatures: maxFeatures.toString(),
  });

  if (cql) {
    urlParams.set("cql_filter", cql);
  }

  return `${baseUrl}/ch_dep_data/ows?${urlParams.toString()}`;
};

export const fetchJSON = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Check if it's a network error (domain not resolving)
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn(`Network error: Unable to reach geoserver. This might be a temporary connectivity issue.`);
      console.warn(`URL: ${url}`);
      
      // Show user-friendly notification (debounced)
      const now = Date.now();
      if (now - lastNetworkErrorTime > NETWORK_ERROR_DEBOUNCE_MS) {
        lastNetworkErrorTime = now;
        toast.warning("Map Data Unavailable", {
          description: "Unable to connect to the map data server. Some features may not be available. Please check your internet connection.",
          duration: 5000,
        });
      }
      
      // Return empty GeoJSON structure to prevent app crashes
      return {
        type: "FeatureCollection",
        features: []
      };
    }
    
    console.error('Error fetching JSON:', error);
    throw error;
  }
};

