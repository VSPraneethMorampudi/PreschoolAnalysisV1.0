import React, { useEffect, useRef, useState } from "react";
import { Map } from "ol";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MapControls } from "./MapControls";
import { ActiveLayersPanel } from "./ActiveLayersPanel";
import { BasemapSwitcher } from "./BasemapSwitcher";
import { ScaleBar } from "./ScaleBar";
import { ClusterLayer } from "./ClusterLayer";
import { ClusterHoverHandler } from "./ClusterHoverHandler";
import { PointDetailPopup } from "./PointDetailPopup";
import { usePointHover } from "@/hooks/usePointHover";
import {
  initializeOpenLayersMap,
  createLayerFromConfig,
  updateLayerVisibility,
  switchBasemap,
  CHHATTISGARH_CENTER,
  ClusterPoint,
  testGeoServerWFS,
} from "@/lib/mapUtils";
import { chhattisgarhLayerHierarchy, LayerTreeNode } from "@/lib/layerData";
import { useAppStore } from "@/lib/store";
import { getDepartmentName } from "@/lib/departmentConfig";
import { fromLonLat, toLonLat } from "ol/proj";
import { getPointResolution } from "ol/proj";

interface MapContainerProps {
  selectedLayers: string[];
  onLayerSelectionChange: (layers: string[]) => void;
  clusterPoints?: ClusterPoint[];
  showClusters?: boolean;
  showClusterDemo?: boolean;
  onToggleClusterDemo?: () => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  selectedLayers,
  onLayerSelectionChange,
  clusterPoints = [],
  showClusters = true,
  showClusterDemo = false,
  onToggleClusterDemo,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentCoordinates, setCurrentCoordinates] =
    useState<[number, number]>();
  const [currentZoom, setCurrentZoom] = useState<number>(7);
  const [currentElevation] = useState<number>(533); // Mock elevation data
  const [showActiveLayers, setShowActiveLayers] = useState(true);
  const [mapScale, setMapScale] = useState<{ value: number; unit: string }>({
    value: 10,
    unit: "km",
  });

  const {
    sidebarCollapsed,
    loading,
    setLoading,
    selectedLanguage,
    selectedDepartment,
  } = useAppStore();

  // Hover functionality
  const { hoverState, showHoverPopup, hideHoverPopup, clearHoverPopup } =
    usePointHover(map);

  // Function to calculate map scale
  const calculateMapScale = (map: Map) => {
    if (!map) return { value: 10, unit: "km" };

    const view = map.getView();
    const resolution = view.getResolution();
    const center = view.getCenter();

    if (!resolution || !center) return { value: 10, unit: "km" };

    // Get the resolution in meters per pixel
    const metersPerPixel = getPointResolution(
      view.getProjection(),
      resolution,
      center
    );

    // Calculate scale for a 100px line (typical scale bar length)
    const scaleMeters = metersPerPixel * 100;

    // Convert to appropriate units with better rounding
    if (scaleMeters >= 1000) {
      const km = scaleMeters / 1000;
      // Round to nice numbers
      const niceKm =
        Math.pow(10, Math.floor(Math.log10(km))) *
        Math.round(km / Math.pow(10, Math.floor(Math.log10(km))));
      return { value: Math.round(niceKm), unit: "km" };
    } else if (scaleMeters >= 1) {
      const niceM =
        Math.pow(10, Math.floor(Math.log10(scaleMeters))) *
        Math.round(
          scaleMeters / Math.pow(10, Math.floor(Math.log10(scaleMeters)))
        );
      return { value: Math.round(niceM), unit: "m" };
    } else {
      const cm = scaleMeters * 100;
      const niceCm =
        Math.pow(10, Math.floor(Math.log10(cm))) *
        Math.round(cm / Math.pow(10, Math.floor(Math.log10(cm))));
      return { value: Math.round(niceCm), unit: "cm" };
    }
  };

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !map) {
      try {
        setLoading(true);
        const newMap = initializeOpenLayersMap(mapRef.current);

        // Add mouse move listener for coordinates
        newMap.on("pointermove", (event) => {
          const coordinate = toLonLat(event.coordinate);
          setCurrentCoordinates([coordinate[0], coordinate[1]]);
        });

        // Add zoom change listener
        newMap.getView().on("change:resolution", () => {
          const zoom = newMap.getView().getZoom();
          if (zoom !== undefined) {
            setCurrentZoom(zoom);
          }
          // Update scale when zoom changes
          setMapScale(calculateMapScale(newMap));
        });

        // Add move listener for scale updates
        newMap.getView().on("change:center", () => {
          setMapScale(calculateMapScale(newMap));
        });

        // Calculate initial scale
        setMapScale(calculateMapScale(newMap));

        // Add all available layers to map (initially hidden)
        const addLayersToMap = (node: LayerTreeNode) => {
          if (node.type === "layer" && node.layerConfig) {
            try {
              const layer = createLayerFromConfig(node.layerConfig);
              layer.set("id", node.layerConfig.id);
              layer.set("title", node.title);
              newMap.addLayer(layer);
            } catch (layerError) {
              console.warn(`Failed to create layer ${node.id}:`, layerError);
            }
          }

          if (node.children) {
            node.children.forEach(addLayersToMap);
          }
        };

        if (chhattisgarhLayerHierarchy.children) {
          chhattisgarhLayerHierarchy.children.forEach(addLayersToMap);
        }

        setMap(newMap);
        setError(null);

        // Test WFS service connectivity
        testGeoServerWFS("cg_state_boundary", "ch_dep_data:cg_state_boundary");
        testGeoServerWFS(
          "cg_village_boundary",
          "ch_dep_data:cg_village_boundary"
        );
      } catch (err) {
        setError("Failed to initialize map. Please refresh the page.");
        console.error("Map initialization error:", err);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      if (map) {
        map.dispose();
      }
    };
  }, [setLoading]);

  // Update layer visibility when selection changes
  useEffect(() => {
    if (map) {
      updateLayerVisibility(map, selectedLayers);

      // Safety check: Ensure basemap and state boundary are always visible
      map.getLayers().forEach((layer) => {
        const layerId = layer.get("id");
        if (layerId === "base" || layerId === "ch_dep_data:cg_state_boundary") {
          layer.setVisible(true);
        }
      });
    }
  }, [map, selectedLayers]);

  // Handle map controls
  const handleZoomIn = () => {
    if (map) {
      const view = map.getView();
      const zoom = view.getZoom();
      if (zoom !== undefined) {
        view.setZoom(zoom + 1);
      }
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const view = map.getView();
      const zoom = view.getZoom();
      if (zoom !== undefined) {
        view.setZoom(zoom - 1);
      }
    }
  };

  const handleResetView = () => {
    if (map) {
      const view = map.getView();
      view.setCenter(fromLonLat(CHHATTISGARH_CENTER));
      view.setZoom(6.8);
    }
  };

  const handleFullscreen = () => {
    if (mapRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        mapRef.current.requestFullscreen();
      }
    }
  };

  const handleLayerToggle = (layerId: string) => {
    const newSelection = selectedLayers.filter((id) => id !== layerId);
    onLayerSelectionChange(newSelection);
  };

  return (
    <div className="relative h-full w-full transition-all duration-300 ease-in-out">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-30">
          <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-lg">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-blue-600 font-medium">
              {selectedLanguage === "hi"
                ? "मानचित्र लोड हो रहा है..."
                : "Loading map..."}
            </span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full bg-gray-100"
        style={{ cursor: "grab" }}
      />

      {/* Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onFullscreen={handleFullscreen}
        onToggleActiveLayers={() => setShowActiveLayers(!showActiveLayers)}
        onToggleClusterDemo={onToggleClusterDemo}
        showActiveLayers={showActiveLayers}
        showClusterDemo={showClusterDemo}
        hasActiveLayers={selectedLayers.length > 0}
      />

      {/* Active Layers Panel */}
      {showActiveLayers && selectedLayers.length > 0 && (
        <ActiveLayersPanel
          selectedLayers={selectedLayers}
          onLayerToggle={handleLayerToggle}
          onClose={() => setShowActiveLayers(false)}
        />
      )}

      {/* Basemap Switcher */}
      <BasemapSwitcher map={map} />

      {/* Cluster Layer */}
      {showClusters && clusterPoints.length > 0 && (
        <>
          <ClusterLayer
            map={map}
            points={clusterPoints}
            clusterRadius={50}
            visible={true}
            onPointHover={showHoverPopup}
            onPointLeave={hideHoverPopup}
          />
          <ClusterHoverHandler
            map={map}
            onPointHover={showHoverPopup}
            onPointLeave={hideHoverPopup}
          />
        </>
      )}

      {/* Point Detail Popup */}
      <PointDetailPopup
        point={hoverState.point!}
        position={hoverState.position}
        visible={hoverState.visible}
        onClose={clearHoverPopup}
      />

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 px-3 py-1.5 z-10">
        <div className="flex items-center justify-between text-[10px] text-gray-600">
          <div className="flex items-center space-x-3">
            <ScaleBar scale={mapScale} isMobile={window.innerWidth < 768} />
            <div>
              {selectedLanguage === "hi"
                ? `अक्षांश: ${currentCoordinates[1].toFixed(
                    4
                  )}° | देशांतर: ${currentCoordinates[0].toFixed(4)}°`
                : `Lat: ${currentCoordinates[1].toFixed(
                    4
                  )}° | Lon: ${currentCoordinates[0].toFixed(4)}°`}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {selectedLayers.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>
                  {selectedLayers.length}{" "}
                  {selectedLanguage === "hi" ? "परतें सक्रिय" : "layers active"}
                </span>
              </div>
            )}
            <div>
              {selectedLanguage === "hi"
                ? `© ${getDepartmentName(
                    selectedDepartment,
                    "hi"
                  )} | © OpenStreetMap`
                : `© ${getDepartmentName(
                    selectedDepartment,
                    "en"
                  )} | © OpenStreetMap`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
