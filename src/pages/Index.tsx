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
    setLoadingMessage("Loading district data...");

    // Hide loading after a delay (or when data actually loads)
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
          highlightSchoolsInBuffers={
            (mapTools as any)?.highlightSchoolsInBuffers ||
            (() => console.warn("Function not ready"))
          }
          connectAnganwadiToNearestSchool={
            (mapTools as any)?.connectAnganwadiToNearestSchool ||
            (() => console.warn("Function not ready"))
          }
          checkInfrastructureRisks={
            (mapTools as any)?.checkInfrastructureRisks ||
            (() => console.warn("Check Infrastructure Risks function not ready"))
          }
          checkRiverHighwayIntersections={
            (mapTools as any)?.checkRiverHighwayIntersections ||
            (() => console.warn("Check River & Highway Intersections function not ready"))
          }
          create5kmAnganwadiSchoolAnalysis={
            (mapTools as any)?.create5kmAnganwadiSchoolAnalysis ||
            (() => console.warn("Create 5km Anganwadi-School Analysis function not ready"))
          }
          connectAnganwadiToSchools={
            (mapTools as any)?.connectAnganwadiToSchools ||
            (() => console.warn("Connect Anganwadi to Schools function not ready"))
          }
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
          checkSchoolInfrastructureIntersections={() =>
            mapViewRef.current?.checkSchoolInfrastructureIntersections()
          }
        />

        {/* Map Container */}
        <main className="flex-1 relative min-w-0 lg:map-responsive pb-16 lg:pb-0">
          {/* Location Search Bar */}
          <div className="absolute top-4 left-4 z-30 w-64 sm:w-72 lg:w-80">
            <LocationSearchBar />
          </div>

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
              highlightSchoolsInBuffers={
                (mapTools as any)?.highlightSchoolsInBuffers ||
                (() => console.warn("Function not ready"))
              }
              connectAnganwadiToNearestSchool={
                (mapTools as any)?.connectAnganwadiToNearestSchool ||
                (() => console.warn("Function not ready"))
              }
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
            {/* Header with title + close icon */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                marginBottom: "15px",
                paddingBottom: "8px",
              }}
            >
              <h2 style={{ margin: 0, color: "#2c3e50" }}>
                Anganwadi Buffer Report
              </h2>
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

            {/* Dashboard Summary Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  background: "#3498db",
                  color: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>{bufferReport.length}</h3>
                <p style={{ margin: 0 }}>Total Anganwadis</p>
              </div>
              <div
                style={{
                  background: "#2ecc71",
                  color: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {new Set(bufferReport.map((r: any) => r.district)).size}
                </h3>
                <p style={{ margin: 0 }}>Districts Covered</p>
              </div>
              <div
                style={{
                  background: "#f39c12",
                  color: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {new Set(bufferReport.map((r: any) => r.village)).size}
                </h3>
                <p style={{ margin: 0 }}>Villages Covered</p>
              </div>
              <div
                style={{
                  background: "#9b59b6",
                  color: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {bufferReport.reduce(
                    (sum: number, r: any) => sum + (r.numberOfSchools || 0),
                    0
                  )}
                </h3>
                <p style={{ margin: 0 }}>Total Schools</p>
              </div>
              <div
                style={{
                  background: "#27ae60",
                  color: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {
                    bufferReport.filter((r: any) => r.numberOfSchools > 0)
                      .length
                  }
                </h3>
                <p style={{ margin: 0 }}>Covered Anganwadis</p>
              </div>
              <div
                style={{
                  background: "#e74c3c",
                  color: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {
                    bufferReport.filter((r: any) => r.numberOfSchools === 0)
                      .length
                  }
                </h3>
                <p style={{ margin: 0 }}>Non-Covered Anganwadis</p>
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
                            {row.schoolNames.join("; ")}
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
                            {row.distance?.toFixed(2) || "-"}
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
                    currentPage === Math.ceil(bufferReport.length / rowsPerPage)
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
