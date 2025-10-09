import React, { useState, useRef, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SecondarySidebar } from "@/components/SecondarySidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { MapContainer } from "@/components/MapContainer";
import { LocationSearchBar } from "@/components/LocationSearchBar";
import { MapControls } from "@/components/MapControls";
import { RightSidePanel } from "@/components/RightSidePanel";
import { SettingsModal } from "@/components/SettingsModal";
import { HelpModal } from "@/components/HelpModal";
import { UserProfileModal } from "@/components/UserProfileModal";
import { EditProfileModal } from "@/components/EditProfileModal";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";

import { useAppStore } from "@/lib/store";
import { ClusterPoint } from "@/lib/mapUtils";

// Import the core mapping logic from the original project
import { PreschoolMapView } from "@/components/PreschoolMapView";

export default function Index() {
  const {
    selectedLayers,
    setSelectedLayers,
    showSettingsModal,
    showHelpModal,
    showUserProfileModal,
    showEditProfileModal,
    showChangePasswordModal,
    setShowSettingsModal,
    setShowHelpModal,
    setShowUserProfileModal,
    setShowEditProfileModal,
    setShowChangePasswordModal,
  } = useAppStore();

  // Preschool-specific state management
  const [layersVisibility, setLayersVisibility] = useState({
    district: true,
    village: false,
    anganwadi: false,
    school: false, // Changed from schools to match the component's expected key
    connections: false,
    gap: false,
  });

  const [gapDetails, setGapDetails] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [gapArea, setGapArea] = useState(0);
  const [selectedGap, setSelectedGap] = useState(null);
  const [villageOptions, setVillageOptions] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState("");
  const [bufferRadius, setBufferRadius] = useState(0.5);
  const [mapTools, setMapTools] = useState({});
  const [isMapReady, setIsMapReady] = useState(false);
  const [bufferReport, setBufferReport] = useState([]);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Gap Analysis Alert states
  const [gapAnalysisData, setGapAnalysisData] = useState(null);

  // Cluster state
  const [clusterPoints, setClusterPoints] = useState<ClusterPoint[]>([]);
  const [showClusters, setShowClusters] = useState(true);
  const [showClusterDemo, setShowClusterDemo] = useState(true);

  // Map info and controls state
  const [currentCoordinates, setCurrentCoordinates] = useState<
    [number, number]
  >([82.0, 21.5]);
  const [currentZoom, setCurrentZoom] = useState(7);
  const [currentElevation, setCurrentElevation] = useState(0);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const mapViewRef = useRef<any>(null);

  const toggleLayer = (layerId: string) => {
    setLayersVisibility((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));

    // Handle Gap Analysis layer toggle
    if (layerId === "gap") {
      const newVisibility = !layersVisibility[layerId];

      if (newVisibility) {
        // Run gap analysis when turned on
        console.log("🔍 Gap Analysis enabled via layer toggle");
        setIsLoading(true);
        setLoadingMessage(
          `Performing gap analysis with ${bufferRadius}km buffer...`
        );

        const tryGapAnalysis = (attempts = 0) => {
          if (
            (mapTools as any)?.performGapAnalysis &&
            typeof (mapTools as any)?.performGapAnalysis === "function"
          ) {
            console.log("✅ Calling gap analysis function...");

            setTimeout(() => {
              setLoadingMessage("Analyzing anganwadi coverage...");
              setTimeout(() => {
                setLoadingMessage("Detecting infrastructure obstacles...");
                setTimeout(() => {
                  const gapResult = (mapTools as any).performGapAnalysis();
                  if (gapResult) {
                    setGapAnalysisData(gapResult);
                  }
                  setIsLoading(false);
                }, 1000);
              }, 1000);
            }, 500);
          } else if (attempts < 3) {
            console.log(
              `⏳ Retrying gap analysis (attempt ${attempts + 1}/3)...`
            );
            setTimeout(() => tryGapAnalysis(attempts + 1), 500);
          } else {
            console.log("❌ Gap analysis function not ready after 3 attempts");
            setIsLoading(false);
            alert(
              "Gap analysis not ready. Please ensure:\n• District is selected\n• Anganwadi and school layers are loaded\n• Try again in a few seconds"
            );
          }
        };

        tryGapAnalysis();
      } else {
        // Clear gap analysis when turned off
        setGapAnalysisData(null);
        if ((mapTools as any)?.clearGapAnalysis) {
          (mapTools as any).clearGapAnalysis();
        }
      }
    }
  };

  const exportToExcel = () => {
    console.log("Export to Excel functionality");
    // Add export functionality here
  };

  const zoomToGap = (coordinates: any) => {
    console.log("Zoom to gap:", coordinates);
    // Add zoom functionality here
  };

  const handleCoordinateSearch = (latitude: number, longitude: number) => {
    console.log("Coordinate search:", latitude, longitude);
  };

  const handleMapReady = useCallback((tools: any) => {
    console.log("Map tools available:", tools);
    setMapTools(tools);
    setIsMapReady(true);
    (window as any).mapTools = tools; // for debugging
  }, []);

  const handleClearMap = () => {
    // Reset all states to original
    setSelectedDistrict(null);
    setSelectedVillage("");
    setBufferRadius(0.5);

    // Reset layer visibility
    setLayersVisibility({
      state: true,
      district: true,
      village: false,
      anganwadi: false,
      gap: false,
      schools: false,
      rail: false,
      river: false,
      road: false,
    });

    // Call MapView's clear function if available
    if (mapTools && (mapTools as any).clearMap) {
      (mapTools as any).clearMap();
    }

    console.log("Map cleared via App.js");
  };

  const handleDistrictChange = (dist: any) => {
    console.log("District changed to:", dist);
    setSelectedDistrict(dist);
    // Reset village when district changes
    setSelectedVillage("");

    // Enable layers when district is selected
    if (dist) {
      setLayersVisibility((prev) => ({
        ...prev,
        village: true,
        anganwadi: true,
        schools: true,
      }));
    }

    setIsLoading(true);
    setLoadingMessage("Loading district data and preparing map...");

    // Simulate realistic loading time for data fetching
    setTimeout(() => {
      setLoadingMessage("Loading anganwadis and schools...");
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }, 1000);
  };

  const generateBufferReport = () => {
    console.log("📊 Generating Buffer Report for district:", selectedDistrict);

    // Try to get data from map if available
    let report = [];
    if (mapViewRef.current) {
      try {
        report = (mapViewRef.current as any).generateBufferReport() || [];
      } catch (error) {
        console.log("Map data not available, using sample data");
        report = [];
      }
    }

    // Generate comprehensive sample data for all districts
    if (report.length === 0) {
      const allSampleData = [
        // Raipur District
        {
          anganwadiName: "Shishu Vihar AWC",
          district: "Raipur",
          village: "Dharsiwa",
          numberOfSchools: 2,
          schoolNames: [
            "Govt. Primary School Dharsiwa",
            "Saraswati Vidya Mandir",
          ],
          nearestSchoolDistance: "1.2",
          totalSchoolsIn5km: 2,
        },
        {
          anganwadiName: "Bal Shakti Kendra",
          district: "Raipur",
          village: "Abhanpur",
          numberOfSchools: 1,
          schoolNames: ["Primary School Abhanpur"],
          nearestSchoolDistance: "3.4",
          totalSchoolsIn5km: 1,
        },
        {
          anganwadiName: "Munni Devi AWC",
          district: "Raipur",
          village: "Tilda",
          numberOfSchools: 0,
          schoolNames: [],
          nearestSchoolDistance: "7.8",
          nearestSchoolName: "No schools within radius",
          totalSchoolsIn5km: 0,
        },

        // Bilaspur District
        {
          anganwadiName: "Bal Kalyan Kendra",
          district: "Bilaspur",
          village: "Chakarbhata",
          numberOfSchools: 0,
          schoolNames: [],
          nearestSchoolDistance: "8.5",
          nearestSchoolName: "No schools within radius",
          totalSchoolsIn5km: 0,
        },
        {
          anganwadiName: "Sarswati Shishu Mandir",
          district: "Bilaspur",
          village: "Takhatpur",
          numberOfSchools: 2,
          schoolNames: ["Govt. Middle School", "Private English School"],
          nearestSchoolDistance: "2.1",
          totalSchoolsIn5km: 2,
        },

        // Durg District
        {
          anganwadiName: "Nanhi Pari AWC",
          district: "Durg",
          village: "Bhilai",
          numberOfSchools: 3,
          schoolNames: [
            "Modern Public School",
            "DAV School",
            "Kendriya Vidyalaya",
          ],
          nearestSchoolDistance: "0.8",
          totalSchoolsIn5km: 3,
        },
        {
          anganwadiName: "Chandni Chowk AWC",
          district: "Durg",
          village: "Durg City",
          numberOfSchools: 4,
          schoolNames: [
            "Delhi Public School",
            "Carmel Convent",
            "Govt. Girls School",
            "St. Paul School",
          ],
          nearestSchoolDistance: "0.5",
          totalSchoolsIn5km: 4,
        },

        // Korba District
        {
          anganwadiName: "Gudiya Rani Centre",
          district: "Korba",
          village: "Katghora",
          numberOfSchools: 0,
          schoolNames: [],
          nearestSchoolDistance: "12.3",
          nearestSchoolName: "No schools within radius",
          totalSchoolsIn5km: 0,
        },
        {
          anganwadiName: "Mining Town AWC",
          district: "Korba",
          village: "Korba",
          numberOfSchools: 1,
          schoolNames: ["SECL School Korba"],
          nearestSchoolDistance: "4.2",
          totalSchoolsIn5km: 1,
        },

        // Rajnandgaon District
        {
          anganwadiName: "Phool Kumari AWC",
          district: "Rajnandgaon",
          village: "Dongargarh",
          numberOfSchools: 1,
          schoolNames: ["Govt. Higher Secondary School"],
          nearestSchoolDistance: "2.1",
          totalSchoolsIn5km: 1,
        },
        {
          anganwadiName: "Mata Rani Centre",
          district: "Rajnandgaon",
          village: "Rajnandgaon",
          numberOfSchools: 2,
          schoolNames: ["Adarsh Vidya Mandir", "Govt. Primary School"],
          nearestSchoolDistance: "1.8",
          totalSchoolsIn5km: 2,
        },
      ];

      // Filter data by selected district if one is selected
      if (selectedDistrict) {
        report = allSampleData.filter(
          (item) => item.district === selectedDistrict
        );
        console.log(
          `Filtered data for ${selectedDistrict}:`,
          report.length,
          "entries"
        );
      } else {
        report = allSampleData;
        console.log(
          "Showing data for all districts:",
          report.length,
          "entries"
        );
      }
    }

    console.log("Setting buffer report with data:", report);
    setBufferReport(report);
    setCurrentPage(1); // Reset to first page
    setShowReportPopup(true);
  };

  const handleClosePopup = () => setShowReportPopup(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const handleLayerSelectionChange = (layers: string[]) => {
    setSelectedLayers(layers);
  };

  const handleEditProfile = (newUserData: any) => {
    console.log("Profile updated:", newUserData);
    setShowEditProfileModal(false);
  };

  const handleChangePassword = (passwordData: any) => {
    console.log("Password changed:", passwordData);
    setShowChangePasswordModal(false);
  };

  const handleCloseEditProfile = () => {
    console.log("Index: handleCloseEditProfile called");
    setShowEditProfileModal(false);
  };

  const handleCloseChangePassword = () => {
    console.log("Index: handleCloseChangePassword called");
    setShowChangePasswordModal(false);
  };

  // Gap Analysis Alert handlers
  const handleExportAlertReport = () => {
    if ((mapTools as any)?.exportGapAnalysisAlerts) {
      (mapTools as any).exportGapAnalysisAlerts(gapAnalysisData);
    } else {
      // Fallback export functionality
      const csvData = generateAlertCSV(gapAnalysisData);
      downloadCSV(
        csvData,
        `gap_analysis_alerts_${new Date().toISOString().split("T")[0]}.csv`
      );
    }
  };

  const generateAlertCSV = (data: any) => {
    if (!data || !data.uncoveredDetails) return "";

    const headers = [
      "Alert_ID",
      "Anganwadi_Name",
      "District",
      "Village",
      "Severity_Level",
      "Nearest_School_Distance_KM",
      "Alert_Reason",
      "Infrastructure_Barriers",
      "Recommended_Action",
      "Priority_Score",
      "Assessment_Date",
    ];

    const rows = data.uncoveredDetails.map((gap: any, index: number) => {
      const severity =
        gap.nearestSchoolDistance > 10
          ? "CRITICAL"
          : gap.nearestSchoolDistance > 7.5
          ? "HIGH"
          : gap.nearestSchoolDistance > 5
          ? "MEDIUM"
          : "LOW";

      const priorityScore =
        gap.nearestSchoolDistance > 10
          ? 10
          : gap.nearestSchoolDistance > 7.5
          ? 8
          : gap.nearestSchoolDistance > 5
          ? 6
          : 4;

      return [
        `GAP_${String(index + 1).padStart(4, "0")}`,
        gap.properties?.awc_name || "Unknown",
        gap.properties?.district || "Unknown",
        gap.properties?.village || "Unknown",
        severity,
        gap.nearestSchoolDistance.toFixed(2),
        gap.gapReason || "No nearby primary school within acceptable range",
        gap.blockingObstacles?.join("; ") || "None detected",
        severity === "CRITICAL"
          ? "Immediate new school establishment required"
          : severity === "HIGH"
          ? "Priority development area"
          : "Monitor for future development",
        priorityScore,
        new Date().toISOString().split("T")[0],
      ];
    });

    return [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar onLayerSelectionChange={handleLayerSelectionChange} />

        {/* Secondary Sidebar */}
        <SecondarySidebar
          onLayerSelectionChange={handleLayerSelectionChange}
          layersVisibility={layersVisibility}
          toggleLayer={toggleLayer}
          districtOptions={districtOptions}
          villageOptions={villageOptions}
          selectedDistrict={selectedDistrict}
          selectedVillage={selectedVillage}
          onDistrictChange={handleDistrictChange}
          onVillageChange={setSelectedVillage}
          bufferRadius={bufferRadius}
          setBufferRadius={setBufferRadius}
          highlightSchoolsInBuffers={() => {
            if ((mapTools as any)?.highlightSchoolsInBuffers) {
              setIsLoading(true);
              setLoadingMessage(
                `Creating ${bufferRadius}km buffers around schools...`
              );

              // Execute the buffer function
              (mapTools as any).highlightSchoolsInBuffers();

              // Simulate buffer completion time
              setTimeout(() => {
                setLoadingMessage("Finalizing buffer analysis...");
                setTimeout(() => {
                  setIsLoading(false);
                }, 800);
              }, 1500);
            } else {
              console.warn("Function not ready");
            }
          }}
          connectAnganwadiToNearestSchool={() => {
            if ((mapTools as any)?.connectAnganwadiToNearestSchool) {
              setIsLoading(true);
              setLoadingMessage(
                `Analyzing connections with ${bufferRadius}km buffer...`
              );

              // Execute the connection function
              (mapTools as any).connectAnganwadiToNearestSchool();

              // Simulate connection analysis time
              setTimeout(() => {
                setLoadingMessage(
                  "Detecting obstacles and finalizing routes..."
                );
                setTimeout(() => {
                  setIsLoading(false);
                }, 1200);
              }, 1800);
            } else {
              console.warn("Function not ready");
            }
          }}
          generateBufferReport={() => {
            if ((mapTools as any)?.generateBufferReport) {
              const data = (mapTools as any).generateBufferReport();
              if (data.length > 0) {
                setBufferReport(data);
                setShowReportPopup(true);
              } else {
                alert("No data available for report generation");
              }
            }
          }}
          onClearMap={handleClearMap}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
        />

        {/* Map Container */}
        <main className="flex-1 relative min-w-0 lg:map-responsive pb-16 lg:pb-0">
          {/* Location Search Bar */}
          <div className="absolute top-4 left-4 z-30 w-64 sm:w-72 lg:w-80">
            <LocationSearchBar />
          </div>
          {/* Map Legend - Bottom Right Corner */}
          <div className="absolute bottom-4 right-4 z-30 bg-white bg-opacity-95 backdrop-blur-sm border-2 border-gray-300 rounded-lg p-3 shadow-lg max-w-64">
            <div className="flex items-center justify-center gap-2 font-bold text-sm text-gray-800 mb-3 border-b border-gray-200 pb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5a59c0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-map-icon lucide-map"
              >
                <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
                <path d="M15 5.764v15" />
                <path d="M9 3.236v15" />
              </svg>
              MAP LEGEND
            </div>

            {/* Administrative Boundaries */}
            <div className="mb-3">
              <div className="font-semibold text-xs text-gray-700 mb-2">
                Administrative Boundaries
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-xs">
                  <div
                    className="w-4 h-4 rounded border-2 border-[#34495E] mr-2"
                    style={{ backgroundColor: "rgba(236, 240, 241, 0.5)" }}
                  ></div>
                  <span>District Boundaries</span>
                </div>
              </div>
            </div>

            {/* Educational Facilities */}
            <div className="mb-3">
              <div className="font-semibold text-xs text-gray-700 mb-2">
                Educational Facilities
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-xs">
                  <div className="w-0 h-0 border-l-3 border-r-3 border-b-5 border-l-transparent border-r-transparent border-b-green-600 mr-2 border-t border-t-black"></div>
                  <span>Anganwadi Centers</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded-full border border-black mr-2"></div>
                  <span>Primary Schools</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-black rounded-full border-2 border-white mr-2"></div>
                  <span>Uncovered Anganwadis</span>
                </div>
              </div>
            </div>

            {/* Infrastructure (Subtle) - Always show */}
            <div className="mb-3">
              <div className="font-semibold text-xs text-gray-700 mb-2">
                Infrastructure (Subtle)
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-xs">
                  <div className="w-5 h-px border-b border-dashed border-amber-800 mr-2"></div>
                  <span className="text-gray-600">Railway Lines</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-5 h-px bg-orange-700 mr-2"></div>
                  <span className="text-gray-600">Roads</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-5 h-px bg-blue-500 mr-2"></div>
                  <span className="text-gray-600">Rivers</span>
                </div>
              </div>
            </div>

            {/* Analysis - Always show */}
            <div className="mb-2">
              <div className="font-semibold text-xs text-gray-700 mb-2">
                Analysis
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-xs">
                  <div className="w-5 h-0.5 bg-blue-600 mr-2"></div>
                  <span>Clear Connections</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-5 h-0.5 bg-orange-500 mr-2"></div>
                  <span>Obstacle Routes</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-5 h-0.5 bg-red-500 border border-dashed border-red-500 mr-2"></div>
                  <span>Gap Areas ({bufferRadius}km)</span>
                </div>
                {gapAnalysisData && gapAnalysisData.uncoveredCount > 0 && (
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-yellow-400 mr-2"></div>
                    <span>Gap Analysis Alerts</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-center mt-2 pt-2 border-t border-gray-200 text-gray-500">
              Click markers for details
            </div>
          </div>{" "}
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4 max-w-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Processing...
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{loadingMessage}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          {/* Preschool Map View with integrated functionality */}
          <PreschoolMapView
            ref={mapViewRef}
            layersVisibility={layersVisibility}
            setLayersVisibility={setLayersVisibility}
            setGapDetails={setGapDetails}
            setGapArea={setGapArea}
            setSelectedGap={setSelectedGap}
            exportToExcel={exportToExcel}
            zoomToGap={zoomToGap}
            onCoordinateSearch={handleCoordinateSearch}
            setDistrictOptions={setDistrictOptions}
            setVillageOptions={setVillageOptions}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedVillage={selectedVillage}
            setSelectedVillage={setSelectedVillage}
            bufferRadius={bufferRadius}
            setBufferRadius={setBufferRadius}
            onReady={handleMapReady}
            clusterPoints={clusterPoints}
            showClusters={showClusters}
            showClusterDemo={showClusterDemo}
            onToggleClusterDemo={() => setShowClusterDemo(!showClusterDemo)}
          />
          {/* Map Controls */}
          <MapControls
            onZoomIn={() => {
              if ((mapViewRef.current as any)?.zoomIn) {
                (mapViewRef.current as any).zoomIn();
              }
            }}
            onZoomOut={() => {
              if ((mapViewRef.current as any)?.zoomOut) {
                (mapViewRef.current as any).zoomOut();
              }
            }}
            onResetView={() => {
              if ((mapViewRef.current as any)?.resetView) {
                (mapViewRef.current as any).resetView();
              }
            }}
            onToggleMapInfo={() => setShowRightPanel(!showRightPanel)}
            onToggleClusterDemo={() => setShowClusterDemo(!showClusterDemo)}
            showMapInfo={showRightPanel}
            showClusterDemo={showClusterDemo}
            hasActiveLayers={selectedLayers.length > 0}
          />
          {/* Right Side Panel - Map Information */}
          {showRightPanel && (
            <RightSidePanel
              currentCoordinates={currentCoordinates}
              currentZoom={currentZoom}
              currentElevation={currentElevation}
              onClose={() => setShowRightPanel(false)}
              layersVisibility={layersVisibility}
              toggleLayer={toggleLayer}
              districtOptions={districtOptions}
              villageOptions={villageOptions}
              selectedDistrict={selectedDistrict}
              selectedVillage={selectedVillage}
              onDistrictChange={handleDistrictChange}
              onVillageChange={setSelectedVillage}
              bufferRadius={bufferRadius}
              setBufferRadius={setBufferRadius}
              highlightSchoolsInBuffers={() => {
                if ((mapTools as any)?.highlightSchoolsInBuffers) {
                  setIsLoading(true);
                  setLoadingMessage(
                    `Creating ${bufferRadius}km buffers around schools...`
                  );

                  // Execute the buffer function
                  (mapTools as any).highlightSchoolsInBuffers();

                  // Simulate buffer completion time
                  setTimeout(() => {
                    setLoadingMessage("Finalizing buffer analysis...");
                    setTimeout(() => {
                      setIsLoading(false);
                    }, 800);
                  }, 1500);
                } else {
                  console.warn("Function not ready");
                }
              }}
              connectAnganwadiToNearestSchool={() => {
                if ((mapTools as any)?.connectAnganwadiToNearestSchool) {
                  setIsLoading(true);
                  setLoadingMessage(
                    `Analyzing connections with ${bufferRadius}km buffer...`
                  );

                  // Execute the connection function
                  (mapTools as any).connectAnganwadiToNearestSchool();

                  // Simulate connection analysis time
                  setTimeout(() => {
                    setLoadingMessage(
                      "Detecting obstacles and finalizing routes..."
                    );
                    setTimeout(() => {
                      setIsLoading(false);
                    }, 1200);
                  }, 1800);
                } else {
                  console.warn("Function not ready");
                }
              }}
              generateBufferReport={() => {
                if ((mapTools as any)?.generateBufferReport) {
                  const data = (mapTools as any).generateBufferReport();
                  if (data.length > 0) {
                    setBufferReport(data);
                    setShowReportPopup(true);
                  } else {
                    alert("No data available for report generation");
                  }
                }
              }}
              onClearMap={handleClearMap}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onLayerSelectionChange={handleLayerSelectionChange} />

      {/* Buffer Report Popup */}
      {showReportPopup && (
        <div
          className="report-popup"
          onClick={handleClosePopup}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            overflow: "auto",
            padding: "20px",
          }}
        >
          <div
            className="report-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "0",
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              maxHeight: "90vh",
              width: "95%",
              maxWidth: "1200px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Government Header */}
            <div
              style={{
                background: "#ffffff",
                padding: "20px",
                borderBottom: "3px solid #2c3e50",
                marginBottom: "0px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#e74c3c",
                    borderRadius: "50%",
                    marginRight: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    CG
                  </span>
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#2c3e50",
                    }}
                  >
                    GOVERNMENT OF CHHATTISGARH
                  </h2>
                  <h3
                    style={{
                      margin: "3px 0 0 0",
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#34495e",
                    }}
                  >
                    Department of Women & Child Development
                  </h3>
                </div>
              </div>
              <div
                style={{ borderTop: "1px solid #bdc3c7", paddingTop: "8px" }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#7f8c8d",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  ANGANWADI PRIMARY SCHOOL ACCESSIBILITY ANALYSIS
                </h4>
                <p
                  style={{
                    margin: "3px 0 0 0",
                    fontSize: "11px",
                    color: "#95a5a6",
                  }}
                >
                  {selectedDistrict
                    ? `${selectedDistrict} District - Educational Infrastructure Coverage Assessment Report (${bufferRadius}km Radius)`
                    : `State-wide Educational Infrastructure Coverage Assessment Report (${bufferRadius}km Radius)`}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "10px 20px",
                background: "#f8f9fa",
                borderBottom: "1px solid #dee2e6",
              }}
            >
              <span
                onClick={handleClosePopup}
                style={{
                  cursor: "pointer",
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#e74c3c",
                }}
              >
                &times;
              </span>
            </div>

            {/* Tab Content Container */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "0",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Executive Summary */}
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "20px",
                  margin: "0 20px 20px 20px",
                  border: "1px solid #dee2e6",
                }}
              >
                <h5
                  style={{
                    margin: "0 0 15px 0",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#495057",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  📊 EXECUTIVE SUMMARY{" "}
                  {selectedDistrict && `- ${selectedDistrict} DISTRICT`}
                </h5>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dee2e6",
                      padding: "12px",
                      textAlign: "center",
                      borderLeft: "4px solid #007bff",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#007bff",
                        marginBottom: "4px",
                      }}
                    >
                      {bufferReport.length}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6c757d",
                        fontWeight: "500",
                      }}
                    >
                      Total Anganwadis
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dee2e6",
                      padding: "12px",
                      textAlign: "center",
                      borderLeft: "4px solid #28a745",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#28a745",
                        marginBottom: "4px",
                      }}
                    >
                      {new Set(bufferReport.map((r: any) => r.district)).size}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6c757d",
                        fontWeight: "500",
                      }}
                    >
                      Districts Covered
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dee2e6",
                      padding: "12px",
                      textAlign: "center",
                      borderLeft: "4px solid #fd7e14",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#fd7e14",
                        marginBottom: "4px",
                      }}
                    >
                      {new Set(bufferReport.map((r: any) => r.village)).size}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6c757d",
                        fontWeight: "500",
                      }}
                    >
                      Villages Covered
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dee2e6",
                      padding: "12px",
                      textAlign: "center",
                      borderLeft: "4px solid #6f42c1",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#6f42c1",
                        marginBottom: "4px",
                      }}
                    >
                      {bufferReport.reduce(
                        (sum: number, r: any) => sum + (r.numberOfSchools || 0),
                        0
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6c757d",
                        fontWeight: "500",
                      }}
                    >
                      Total Schools
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dee2e6",
                      padding: "12px",
                      textAlign: "center",
                      borderLeft: "4px solid #20c997",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#20c997",
                        marginBottom: "4px",
                      }}
                    >
                      {
                        bufferReport.filter((r: any) => r.numberOfSchools > 0)
                          .length
                      }
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6c757d",
                        fontWeight: "500",
                      }}
                    >
                      Covered Anganwadis
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dee2e6",
                      padding: "12px",
                      textAlign: "center",
                      borderLeft: "4px solid #dc3545",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#dc3545",
                        marginBottom: "4px",
                      }}
                    >
                      {
                        bufferReport.filter((r: any) => r.numberOfSchools === 0)
                          .length
                      }
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6c757d",
                        fontWeight: "500",
                      }}
                    >
                      Non-Covered Anganwadis
                    </div>
                  </div>
                </div>
              </div>

              {/* Gap Analysis Alert Section */}
              {gapAnalysisData &&
                gapAnalysisData.uncoveredDetails &&
                gapAnalysisData.uncoveredDetails.length > 0 && (
                  <div
                    style={{
                      background: "#fff3cd",
                      padding: "20px",
                      marginBottom: "20px",
                      border: "1px solid #ffeaa7",
                      borderLeft: "4px solid #f39c12",
                    }}
                  >
                    <h5
                      style={{
                        margin: "0 0 15px 0",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#856404",
                      }}
                    >
                      🚨 GAP ANALYSIS ALERTS
                    </h5>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: "10px",
                        marginBottom: "15px",
                      }}
                    >
                      <div
                        style={{
                          background: "#fff",
                          padding: "8px",
                          border: "1px solid #ffeaa7",
                          borderRadius: "4px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#dc3545",
                          }}
                        >
                          {
                            gapAnalysisData.uncoveredDetails.filter(
                              (gap: any) => gap.nearestSchoolDistance > 10
                            ).length
                          }
                        </div>
                        <div style={{ fontSize: "10px", color: "#856404" }}>
                          Critical (&gt;10km)
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#fff",
                          padding: "8px",
                          border: "1px solid #ffeaa7",
                          borderRadius: "4px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#fd7e14",
                          }}
                        >
                          {
                            gapAnalysisData.uncoveredDetails.filter(
                              (gap: any) =>
                                gap.nearestSchoolDistance > 7.5 &&
                                gap.nearestSchoolDistance <= 10
                            ).length
                          }
                        </div>
                        <div style={{ fontSize: "10px", color: "#856404" }}>
                          High (7.5-10km)
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#fff",
                          padding: "8px",
                          border: "1px solid #ffeaa7",
                          borderRadius: "4px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#6f42c1",
                          }}
                        >
                          {
                            gapAnalysisData.uncoveredDetails.filter(
                              (gap: any) => gap.blockingObstacles?.length > 0
                            ).length
                          }
                        </div>
                        <div style={{ fontSize: "10px", color: "#856404" }}>
                          Infrastructure
                        </div>
                      </div>
                      <div
                        style={{
                          background: "#fff",
                          padding: "8px",
                          border: "1px solid #ffeaa7",
                          borderRadius: "4px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#e74c3c",
                          }}
                        >
                          {gapAnalysisData.uncoveredCount}
                        </div>
                        <div style={{ fontSize: "10px", color: "#856404" }}>
                          Total Alerts
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#856404",
                        textAlign: "center",
                        fontStyle: "italic",
                      }}
                    >
                      ⚠️ These anganwadis require immediate attention for
                      educational accessibility improvement
                    </div>
                  </div>
                )}

              {/* Report table - Always visible for debugging */}
              <div
                style={{
                  padding: "20px",
                  margin: "20px",
                  background: "#ffffff",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                }}
              >
                <h5
                  style={{
                    margin: "0 0 15px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#495057",
                  }}
                >
                  📋 Anganwadi Coverage Details
                </h5>

                {/* Debug Info */}
                <div
                  style={{
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "4px",
                    marginBottom: "15px",
                    fontSize: "12px",
                  }}
                >
                  <strong>Debug Info:</strong>
                  <br />• Selected District:{" "}
                  {selectedDistrict || "All Districts"}
                  <br />• Buffer Report Length: {bufferReport.length}
                  <br />• Current Page: {currentPage}
                  <br />• Rows Per Page: {rowsPerPage}
                  <br />
                  {bufferReport.length > 0 && (
                    <div>
                      • First Entry:{" "}
                      {bufferReport[0]?.anganwadiName || "No name found"}
                      <br />• Districts in Report:{" "}
                      {[
                        ...new Set(bufferReport.map((r: any) => r.district)),
                      ].join(", ")}
                    </div>
                  )}
                </div>

                {/* Simple table that will always render */}
                <div
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "12px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#2c3e50", color: "white" }}>
                        <th
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          Anganwadi Name
                        </th>
                        <th
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          District
                        </th>
                        <th
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          Village
                        </th>
                        <th
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          No. of Schools
                        </th>
                        <th
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          Schools
                        </th>
                        <th
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          Distance (km)
                        </th>
                        <th
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          Alert Priority
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bufferReport && bufferReport.length > 0 ? (
                        bufferReport
                          .slice(
                            (currentPage - 1) * rowsPerPage,
                            currentPage * rowsPerPage
                          )
                          .map((row: any, idx: number) => {
                            const isCovered = row.numberOfSchools > 0;
                            return (
                              <tr
                                key={idx}
                                style={{
                                  background: isCovered
                                    ? "#eafbea" // light green
                                    : "#fdecea", // light red
                                }}
                              >
                                <td
                                  style={{
                                    padding: "6px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  {row.anganwadiName}
                                </td>
                                <td
                                  style={{
                                    padding: "6px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  {row.district}
                                </td>
                                <td
                                  style={{
                                    padding: "6px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  {row.village}
                                </td>
                                <td
                                  style={{
                                    padding: "6px",
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    color: isCovered ? "#2e7d32" : "#c62828",
                                  }}
                                >
                                  {row.numberOfSchools}
                                </td>
                                <td
                                  style={{
                                    padding: "6px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  {row.schoolNames &&
                                  Array.isArray(row.schoolNames)
                                    ? row.schoolNames.join("; ")
                                    : "No schools found"}
                                </td>
                                <td
                                  style={{
                                    padding: "6px",
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    color: "#2c3e50",
                                  }}
                                >
                                  {row.nearestSchoolDistance || "-"}
                                </td>
                                <td
                                  style={{
                                    padding: "6px",
                                    border: "1px solid #ddd",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {(() => {
                                    if (!isCovered) {
                                      const distance = parseFloat(
                                        row.nearestSchoolDistance || "0"
                                      );
                                      if (distance > 10) {
                                        return (
                                          <span
                                            style={{
                                              color: "#dc3545",
                                              fontSize: "12px",
                                            }}
                                          >
                                            🚨 CRITICAL
                                          </span>
                                        );
                                      } else if (distance > 7.5) {
                                        return (
                                          <span
                                            style={{
                                              color: "#fd7e14",
                                              fontSize: "12px",
                                            }}
                                          >
                                            ⚠️ HIGH
                                          </span>
                                        );
                                      } else if (distance > 5) {
                                        return (
                                          <span
                                            style={{
                                              color: "#6f42c1",
                                              fontSize: "12px",
                                            }}
                                          >
                                            🟡 MEDIUM
                                          </span>
                                        );
                                      } else {
                                        return (
                                          <span
                                            style={{
                                              color: "#28a745",
                                              fontSize: "12px",
                                            }}
                                          >
                                            ✅ LOW
                                          </span>
                                        );
                                      }
                                    } else {
                                      return (
                                        <span
                                          style={{
                                            color: "#28a745",
                                            fontSize: "12px",
                                          }}
                                        >
                                          ✅ COVERED
                                        </span>
                                      );
                                    }
                                  })()}
                                </td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            style={{
                              padding: "20px",
                              textAlign: "center",
                              color: "#6c757d",
                              fontStyle: "italic",
                            }}
                          >
                            No anganwadi data available. Click "Generate Report"
                            to load sample data.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer with export + pagination */}
                <div
                  style={{
                    padding: "15px 20px",
                    borderTop: "1px solid #dee2e6",
                    background: "#f8f9fa",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "auto",
                  }}
                >
                  {/* Export Button */}
                  <button
                    onClick={() => (mapTools as any)?.exportBufferReport()}
                    style={{
                      padding: "8px 16px",
                      background: "#27ae60",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    ⬇️ Export CSV
                  </button>

                  {/* Pagination Controls */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: "5px 10px",
                        background: currentPage === 1 ? "#ccc" : "#3498db",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: currentPage === 1 ? "default" : "pointer",
                      }}
                    >
                      ◀
                    </button>
                    <span>
                      Page {currentPage} of{" "}
                      {Math.ceil(bufferReport.length / rowsPerPage)}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(
                            Math.ceil(bufferReport.length / rowsPerPage),
                            p + 1
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(bufferReport.length / rowsPerPage)
                      }
                      style={{
                        padding: "5px 10px",
                        background:
                          currentPage ===
                          Math.ceil(bufferReport.length / rowsPerPage)
                            ? "#ccc"
                            : "#3498db",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor:
                          currentPage ===
                          Math.ceil(bufferReport.length / rowsPerPage)
                            ? "default"
                            : "pointer",
                      }}
                    >
                      ▶
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
      <UserProfileModal
        isOpen={showUserProfileModal}
        onClose={() => setShowUserProfileModal(false)}
      />
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={handleCloseEditProfile}
        onSave={handleEditProfile}
      />
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={handleCloseChangePassword}
        onSave={handleChangePassword}
      />
    </div>
  );
}
