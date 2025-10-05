import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { SecondarySidebar } from '@/components/SecondarySidebar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { MapContainer } from '@/components/MapContainer';
import { LocationSearchBar } from '@/components/LocationSearchBar';
import { MapControls } from '@/components/MapControls';
import { RightSidePanel } from '@/components/RightSidePanel';
import { SettingsModal } from '@/components/SettingsModal';
import { HelpModal } from '@/components/HelpModal';
import { UserProfileModal } from '@/components/UserProfileModal';
import { EditProfileModal } from '@/components/EditProfileModal';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import { useAppStore } from '@/lib/store';
import { ClusterPoint } from '@/lib/mapUtils';

// Import the core mapping logic from the original project
import { PreschoolMapView } from '@/components/PreschoolMapView';

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
    setShowChangePasswordModal
  } = useAppStore();

  // Preschool-specific state management
  const [layersVisibility, setLayersVisibility] = useState({
    state: true,
    district: true,
    village: false,
    anganwadi: false,
    gap: false,
    schools: false,
    rail: true,
    river: true,
    road: true,
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

  // Cluster state
  const [clusterPoints, setClusterPoints] = useState<ClusterPoint[]>([]);
  const [showClusters, setShowClusters] = useState(true);
  const [showClusterDemo, setShowClusterDemo] = useState(true);

  // Map info and controls state
  const [currentCoordinates, setCurrentCoordinates] = useState<[number, number]>([82.0, 21.5]);
  const [currentZoom, setCurrentZoom] = useState(7);
  const [currentElevation, setCurrentElevation] = useState(0);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const mapViewRef = useRef<any>(null);

  const toggleLayer = (layerId: string) => {
    setLayersVisibility((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
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
      setLayersVisibility(prev => ({
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
    if (!mapViewRef.current) return;
    const report = (mapViewRef.current as any).generateBufferReport();
    setBufferReport(report);
    setShowReportPopup(true);
  };

  const handleClosePopup = () => setShowReportPopup(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const handleLayerSelectionChange = (layers: string[]) => {
    setSelectedLayers(layers);
  };

  const handleEditProfile = (newUserData: any) => {
    console.log('Profile updated:', newUserData);
    setShowEditProfileModal(false);
  };

  const handleChangePassword = (passwordData: any) => {
    console.log('Password changed:', passwordData);
    setShowChangePasswordModal(false);
  };

  const handleCloseEditProfile = () => {
    console.log('Index: handleCloseEditProfile called');
    setShowEditProfileModal(false);
  };

  const handleCloseChangePassword = () => {
    console.log('Index: handleCloseChangePassword called');
    setShowChangePasswordModal(false);
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
              setLoadingMessage(`Creating ${bufferRadius}km buffers around schools...`);
              
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
              setLoadingMessage(`Analyzing connections with ${bufferRadius}km buffer...`);
              
              // Execute the connection function
              (mapTools as any).connectAnganwadiToNearestSchool();
              
              // Simulate connection analysis time
              setTimeout(() => {
                setLoadingMessage("Detecting obstacles and finalizing routes...");
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
        {/* Gap Analysis Button */}
        <div className="absolute top-20 right-4 z-30 space-y-2">
          {/* Dynamic Buffer Range Selector */}
          <div className="bg-white p-3 rounded-lg shadow-lg border">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Buffer Range (km)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={bufferRadius}
              onChange={(e) => setBufferRadius(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>1km</span>
              <span className="font-medium">{bufferRadius}km</span>
              <span>10km</span>
            </div>
          </div>
          
          <button
            onClick={() => {
              console.log("🔍 Gap Analysis button clicked");
              console.log("MapTools available:", !!mapTools);
              console.log("Available methods:", mapTools ? Object.keys(mapTools as any) : "No mapTools");
              console.log("performGapAnalysis function:", typeof (mapTools as any)?.performGapAnalysis);
              
              // Set loading state for gap analysis
              setIsLoading(true);
              setLoadingMessage(`Performing gap analysis with ${bufferRadius}km buffer...`);
              
              // First test if ref is working at all
              if ((mapTools as any)?.testFunction) {
                (mapTools as any).testFunction();
              } else {
                console.log("❌ Even test function is not available - ref connection issue");
              }
              
              // Try multiple times with delay to ensure component is ready
              const tryGapAnalysis = (attempts = 0) => {
                if ((mapTools as any)?.performGapAnalysis && typeof (mapTools as any)?.performGapAnalysis === 'function') {
                  console.log("✅ Calling gap analysis function...");
                  
                  setTimeout(() => {
                    setLoadingMessage("Analyzing anganwadi coverage...");
                    setTimeout(() => {
                      setLoadingMessage("Detecting infrastructure obstacles...");
                      setTimeout(() => {
                        (mapTools as any).performGapAnalysis();
                        setIsLoading(false);
                      }, 1000);
                    }, 1000);
                  }, 500);
                } else if (attempts < 3) {
                  console.log(`⏳ Retrying gap analysis (attempt ${attempts + 1}/3)...`);
                  setTimeout(() => tryGapAnalysis(attempts + 1), 500);
                } else {
                  console.log("❌ Gap analysis function not ready after 3 attempts");
                  setIsLoading(false);
                  alert("Gap analysis not ready. Please wait for map to load completely.\n\nEnsure:\n• Green anganwadi dots are visible\n• Red school dots are visible\n• All layers have finished loading\n\nTry clicking the button again in a few seconds.");
                }
              };
              
              tryGapAnalysis();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm transition-colors w-full"
            title={`Find anganwadis without primary schools within ${bufferRadius}km`}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Analyzing...' : '🔍 Gap Analysis'}
          </button>
          
         
        </div>          {/* Location Search Bar */}
          <div className="absolute top-4 left-4 z-30 w-64 sm:w-72 lg:w-80">
            <LocationSearchBar />
          </div>
          
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4 max-w-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Processing...</h3>
                  <p className="text-sm text-gray-600 mt-1">{loadingMessage}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
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
                  setLoadingMessage(`Creating ${bufferRadius}km buffers around schools...`);
                  
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
                  setLoadingMessage(`Analyzing connections with ${bufferRadius}km buffer...`);
                  
                  // Execute the connection function
                  (mapTools as any).connectAnganwadiToNearestSchool();
                  
                  // Simulate connection analysis time
                  setTimeout(() => {
                    setLoadingMessage("Detecting obstacles and finalizing routes...");
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
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="report-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              maxHeight: "85%",
              width: "95%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Government Header */}
            <div
              style={{
                background: "#ffffff",
                padding: "20px",
                borderBottom: "3px solid #2c3e50",
                marginBottom: "0px",
                textAlign: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                <div style={{ width: "40px", height: "40px", backgroundColor: "#e74c3c", borderRadius: "50%", marginRight: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>CG</span>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#2c3e50" }}>
                    GOVERNMENT OF CHHATTISGARH
                  </h2>
                  <h3 style={{ margin: "3px 0 0 0", fontSize: "14px", fontWeight: "400", color: "#34495e" }}>
                    Department of Women & Child Development
                  </h3>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #bdc3c7", paddingTop: "8px" }}>
                <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "500", color: "#7f8c8d", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  ANGANWADI PRIMARY SCHOOL ACCESSIBILITY ANALYSIS
                </h4>
                <p style={{ margin: "3px 0 0 0", fontSize: "11px", color: "#95a5a6" }}>
                  Educational Infrastructure Coverage Assessment Report (5km Radius)
                </p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px", background: "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
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

            {/* Executive Summary */}
            <div
              style={{
                background: "#f8f9fa",
                padding: "20px",
                marginBottom: "20px",
                border: "1px solid #dee2e6"
              }}
            >
              <h5 style={{ margin: "0 0 15px 0", fontSize: "14px", fontWeight: "600", color: "#495057", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                📊 EXECUTIVE SUMMARY
              </h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "15px"
                }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dee2e6",
                    padding: "12px",
                    textAlign: "center",
                    borderLeft: "4px solid #007bff"
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: "600", color: "#007bff", marginBottom: "4px" }}>
                    {bufferReport.length}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6c757d", fontWeight: "500" }}>
                    Total Anganwadis
                  </div>
                </div>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dee2e6",
                    padding: "12px",
                    textAlign: "center",
                    borderLeft: "4px solid #28a745"
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: "600", color: "#28a745", marginBottom: "4px" }}>
                    {new Set(bufferReport.map((r: any) => r.district)).size}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6c757d", fontWeight: "500" }}>
                    Districts Covered
                  </div>
                </div>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dee2e6",
                    padding: "12px",
                    textAlign: "center",
                    borderLeft: "4px solid #fd7e14"
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: "600", color: "#fd7e14", marginBottom: "4px" }}>
                    {new Set(bufferReport.map((r: any) => r.village)).size}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6c757d", fontWeight: "500" }}>
                    Villages Covered
                  </div>
                </div>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dee2e6",
                    padding: "12px",
                    textAlign: "center",
                    borderLeft: "4px solid #6f42c1"
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: "600", color: "#6f42c1", marginBottom: "4px" }}>
                    {bufferReport.reduce(
                      (sum: number, r: any) => sum + (r.numberOfSchools || 0),
                      0
                    )}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6c757d", fontWeight: "500" }}>
                    Total Schools
                  </div>
                </div>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dee2e6",
                    padding: "12px",
                    textAlign: "center",
                    borderLeft: "4px solid #20c997"
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: "600", color: "#20c997", marginBottom: "4px" }}>
                    {bufferReport.filter((r: any) => r.numberOfSchools > 0).length}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6c757d", fontWeight: "500" }}>
                    Covered Anganwadis
                  </div>
                </div>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dee2e6",
                    padding: "12px",
                    textAlign: "center",
                    borderLeft: "4px solid #dc3545"
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: "600", color: "#dc3545", marginBottom: "4px" }}>
                    {bufferReport.filter((r: any) => r.numberOfSchools === 0).length}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6c757d", fontWeight: "500" }}>
                    Non-Covered Anganwadis
                  </div>
                </div>
              </div>
            </div>

            {/* Report table */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr style={{ background: "#2c3e50", color: "white" }}>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Anganwadi Name
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      District
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Village
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      No. of Schools
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Schools
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Distance (km)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bufferReport
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
                            {row.schoolNames && Array.isArray(row.schoolNames) ? row.schoolNames.join("; ") : "No schools found"}
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
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Footer with export + pagination */}
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
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