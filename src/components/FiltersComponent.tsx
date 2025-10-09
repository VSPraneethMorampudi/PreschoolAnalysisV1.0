import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert } from "./ui/alert";
import { AlertCircle, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { wfsUrl, fetchJSON } from "./utils/wfs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { District, Village } from "@/types/geoserver";

interface GeoServerFeature {
  properties: {
    dist_cod?: string;
    dist_e?: string;
    vill_cod?: string;
    vill_nam?: string;
  };
}

interface FiltersComponentProps {
  districtOptions: District[];
  villageOptions: Village[];
  selectedDistrict: string | null;
  selectedVillage: string;
  onDistrictChange: (district: string | null) => void;
  onVillageChange: (village: string) => void;
}

export const FiltersComponent: React.FC<FiltersComponentProps> = ({
  districtOptions,
  villageOptions,
  selectedDistrict,
  selectedVillage,
  onDistrictChange,
  onVillageChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch districts from GeoServer when needed
  useEffect(() => {
    let isSubscribed = true;

    const fetchDistricts = async () => {
      // Skip if we already have districts
      if (districtOptions.length > 0) return;

      setLoading(true);
      setError(null);
      try {
        const json = await fetchJSON(
          wfsUrl({
            typeName: "ch_dep_data:cg_district_boundary",
            maxFeatures: 50,
          })
        );

        if (!isSubscribed) return;

        if (json?.features?.length) {
          const options = json.features.map((f: GeoServerFeature) => ({
            dist_cod: f.properties.dist_cod || "",
            dist_e: f.properties.dist_e || "",
          }));
          if (JSON.stringify(options) !== JSON.stringify(districtOptions)) {
            onDistrictChange(null);
          }
        }
      } catch (err) {
        if (isSubscribed) {
          setError("Failed to load districts. Please try again later.");
          console.error("Error fetching districts:", err);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchDistricts();

    return () => {
      isSubscribed = false;
    };
  }, [districtOptions, onDistrictChange]);

  // Fetch villages when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      onVillageChange("");
      return;
    }

    const fetchVillages = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await fetchJSON(
          wfsUrl({
            typeName: "ch_dep_data:cg_village_boundary",
            cql: `dist_cod=${selectedDistrict}`,
          })
        );

        if (json?.features?.length) {
          const options = json.features.map((f: GeoServerFeature) => ({
            id: f.properties.vill_cod || "",
            village: f.properties.vill_nam || "",
          }));
          if (JSON.stringify(options) !== JSON.stringify(villageOptions)) {
            onVillageChange("");
          }
        }
      } catch (err) {
        setError("Failed to load villages. Please try again later.");
        console.error("Error fetching villages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVillages();
  }, [selectedDistrict, villageOptions, onVillageChange]);

  return (
    <div className="space-y-4 p-3">
      {/* District Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-600" />
          District
        </Label>
        <Select
          value={selectedDistrict || ""}
          onValueChange={(value) => onDistrictChange(value || null)}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select a district" />
          </SelectTrigger>
          <SelectContent
            className="z-[9999] max-h-[200px] overflow-y-auto w-full"
            position="popper"
            align="start"
            side="bottom"
            sideOffset={0}
          >
            <div className="max-h-[200px] overflow-y-auto">
              {districtOptions.map((district) => (
                <SelectItem key={district.dist_cod} value={district.dist_cod}>
                  {district.dist_e}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      {/* Village Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-600" />
          Village
        </Label>
        <Select
          value={selectedVillage}
          onValueChange={onVillageChange}
          disabled={!selectedDistrict}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select a village" />
          </SelectTrigger>
          <SelectContent
            className="z-[9999] max-h-[200px] overflow-y-auto w-full"
            position="popper"
            align="start"
            side="bottom"
            sideOffset={0}
          >
            <div className="max-h-[200px] overflow-y-auto">
              {villageOptions.map((village) => (
                <SelectItem key={village.id} value={village.id}>
                  {village.village}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      {loading && (
        <div className="text-center">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      )}
    </div>
  );
};