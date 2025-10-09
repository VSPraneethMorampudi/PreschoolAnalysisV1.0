import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { wfsUrl, fetchJSON } from "./utils/wfs";

interface GeoServerFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: {
    dist_e?: string;
    dist_h?: string;
    vill_nam?: string;
    vill_nam_h?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

interface GeoServerResponse {
  type: string;
  features: GeoServerFeature[];
  totalFeatures: number;
  numberMatched: number;
  numberReturned: number;
  timeStamp: string;
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
}

interface LocationSearchBarProps {
  className?: string;
  onLocationSelect: (location: {
    coordinates: number[];
    properties: GeoServerFeature["properties"];
    type: string;
  }) => void;
}

interface SearchResult {
  type: "district" | "village";
  name: string;
  nameHi?: string;
  coordinates: number[];
  properties: GeoServerFeature["properties"];
}

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  className = "",
  onLocationSelect,
}) => {
  const { selectedLanguage } = useAppStore();
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationSearchResults, setLocationSearchResults] = useState<
    SearchResult[]
  >([]);
  const [showLocationResults, setShowLocationResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchGeoServer = async (query: string) => {
    setIsSearching(true);
    try {
      // Search districts
      const districtCQL = `dist_e ILIKE '%${query}%' OR dist_h ILIKE '%${query}%'`;
      const districtResponse = await fetchJSON<GeoServerResponse>(
        wfsUrl({
          typeName: "ch_dep_data:cg_district_boundary",
          cql: districtCQL,
          maxFeatures: 5,
        })
      );

      // Search villages
      const villageCQL = `vill_nam ILIKE '%${query}%'`;
      const villageResponse = await fetchJSON<GeoServerResponse>(
        wfsUrl({
          typeName: "ch_dep_data:cg_village_boundary",
          cql: villageCQL,
          maxFeatures: 5,
        })
      );

      const results: SearchResult[] = [];

      // Process district results
      if (districtResponse?.features) {
        districtResponse.features.forEach((feature: GeoServerFeature) => {
          // Get centroid of district for coordinates
          const coords = getCentroid(feature.geometry.coordinates[0][0]);
          results.push({
            type: "district",
            name: feature.properties.dist_e ?? "",
            nameHi: feature.properties.dist_h,
            coordinates: coords,
            properties: feature.properties,
          });
        });
      }

      // Process village results
      if (villageResponse?.features) {
        villageResponse.features.forEach((feature: GeoServerFeature) => {
          // Get centroid of village for coordinates
          const coords = getCentroid(feature.geometry.coordinates[0][0]);
          results.push({
            type: "village",
            name: feature.properties.vill_nam ?? "",
            nameHi: feature.properties.vill_nam_h,
            coordinates: coords,
            properties: feature.properties,
          });
        });
      }

      setLocationSearchResults(results);
      setShowLocationResults(true);
    } catch (error) {
      console.error("Error searching locations:", error);
      setLocationSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Helper function to calculate centroid of a polygon
  const getCentroid = (coordinates: number[][]) => {
    const sumX = coordinates.reduce((sum, coord) => sum + coord[0], 0);
    const sumY = coordinates.reduce((sum, coord) => sum + coord[1], 0);
    return [sumX / coordinates.length, sumY / coordinates.length];
  };

  const handleLocationSearch = (query: string) => {
    setLocationSearchQuery(query);
    if (query.length > 2) {
      // Search after 2 characters
      searchGeoServer(query);
    } else {
      setLocationSearchResults([]);
      setShowLocationResults(false);
    }
  };

  const handleLocationResultClick = (result: SearchResult) => {
    console.log("Location search result clicked:", result);
    // Call the parent component's handler to zoom to the location
    onLocationSelect({
      coordinates: result.coordinates,
      properties: result.properties,
      type: result.type,
    });
    setLocationSearchQuery(
      selectedLanguage === "hi" ? result.nameHi ?? result.name : result.name
    );
    setShowLocationResults(false);
  };

  return (
    <div className={`relative ${className}`}>
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600" />
      <Input
        placeholder={
          selectedLanguage === "hi"
            ? "जिला, गाँव या स्थान खोजें..."
            : "Search district, village or location..."
        }
        value={locationSearchQuery}
        onChange={(e) => handleLocationSearch(e.target.value)}
        onFocus={() => setShowLocationResults(locationSearchQuery.length > 1)}
        className="pl-10 h-10 text-sm bg-white/95 border-blue-300 focus:border-blue-500 shadow-lg"
      />

      {/* Location Search Results Dropdown */}
      {showLocationResults && locationSearchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-48 overflow-y-auto z-50">
          {locationSearchResults.map((result, index) => (
            <div
              key={index}
              onClick={() => handleLocationResultClick(result)}
              className="flex items-center space-x-3 p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">
                  {selectedLanguage === "hi" ? result.nameHi : result.name}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {selectedLanguage === "hi"
                    ? result.type === "district"
                      ? "जिला"
                      : result.type === "village"
                      ? "गाँव"
                      : "स्थान"
                    : result.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
