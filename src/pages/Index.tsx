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

  const [layersVisibility, setLayersVisibility] = useState({
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
  const [activeReportTab, setActiveReportTab] = useState("summary");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [gapAnalysisData, setGapAnalysisData] = useState(null);
  const [clusterPoints, setClusterPoints] = useState<ClusterPoint[]>([]);
  const [showClusters, setShowClusters] = useState(true);
  const [showClusterDemo, setShowClusterDemo] = useState(true);
  const [currentCoordinates, setCurrentCoordinates] = useState<
    [number, number]
  >([82.0, 21.5]);
  const [currentZoom, setCurrentZoom] = useState(7);
  const [currentElevation, setCurrentElevation] = useState(0);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const mapViewRef = useRef<any>(null);
  const rowsPerPage = 10;

  /** Toggle Layer Functionality */
  const toggleLayer = (layerId: string) => {
    setLayersVisibility((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
    if (layerId === "gap") {
      const newVisibility = !layersVisibility[layerId];
      if (newVisibility) {
        setIsLoading(true);
        setLoadingMessage(
          `Performing gap analysis with ${bufferRadius}km buffer...`
        );
        const tryGapAnalysis = (attempts = 0) => {
          if ((mapTools as any)?.performGapAnalysis) {
            setTimeout(() => {
              setLoadingMessage("Analyzing anganwadi coverage...");
              setTimeout(() => {
                setLoadingMessage("Detecting infrastructure obstacles...");
                setTimeout(() => {
                  const gapResult = (mapTools as any).performGapAnalysis();
                  if (gapResult) setGapAnalysisData(gapResult);
                  setIsLoading(false);
                }, 1000);
              }, 1000);
            }, 500);
          } else if (attempts < 3) {
            setTimeout(() => tryGapAnalysis(attempts + 1), 500);
          } else {
            alert("Gap analysis not ready. Try again in a few seconds.");
            setIsLoading(false);
          }
        };
        tryGapAnalysis();
      } else {
        setGapAnalysisData(null);
        if ((mapTools as any)?.clearGapAnalysis)
          (mapTools as any).clearGapAnalysis();
      }
    }
  };

  /** Handle Map Ready */
  const handleMapReady = useCallback((tools: any) => {
    setMapTools(tools);
    setIsMapReady(true);
    (window as any).mapTools = tools;
  }, []);

  /** Clear Map */
  const handleClearMap = () => {
    setSelectedDistrict(null);
    setSelectedVillage("");
    setBufferRadius(0.5);
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
    if ((mapTools as any)?.clearMap) (mapTools as any).clearMap();
  };

  /** Handle District Change */
  const handleDistrictChange = (dist: any) => {
    setSelectedDistrict(dist);
    setSelectedVillage("");
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
    setTimeout(() => setIsLoading(false), 2500);
  };

  /** Report Data Pagination */
  const filteredReportData = selectedDistrict
    ? bufferReport.filter((r: any) => r.district === selectedDistrict)
    : bufferReport;
  const totalPages = Math.ceil(filteredReportData.length / rowsPerPage);
  const paginatedData = filteredReportData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  /** Close Report Popup */
  const handleClosePopup = () => setShowReportPopup(false);

  /** Export CSV Helper */
  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar onLayerSelectionChange={setSelectedLayers} />
        <SecondarySidebar
          onLayerSelectionChange={setSelectedLayers}
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
          onClearMap={handleClearMap}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
        />
        <main className="flex-1 relative min-w-0 lg:map-responsive pb-16 lg:pb-0">
          <div className="absolute top-4 left-4 z-30 w-64 sm:w-72 lg:w-80">
            <LocationSearchBar />
          </div>

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
              </div>
            </div>
          )}

          <PreschoolMapView
            ref={mapViewRef}
            layersVisibility={layersVisibility}
            setLayersVisibility={setLayersVisibility}
            setGapDetails={setGapDetails}
            setGapArea={setGapArea}
            setSelectedGap={setSelectedGap}
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

          <MapControls
            onZoomIn={() => (mapViewRef.current as any)?.zoomIn?.()}
            onZoomOut={() => (mapViewRef.current as any)?.zoomOut?.()}
            onResetView={() => (mapViewRef.current as any)?.resetView?.()}
            onToggleMapInfo={() => setShowRightPanel(!showRightPanel)}
            onToggleClusterDemo={() => setShowClusterDemo(!showClusterDemo)}
            showMapInfo={showRightPanel}
            showClusterDemo={showClusterDemo}
            hasActiveLayers={selectedLayers.length > 0}
          />

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
              onClearMap={handleClearMap}
            />
          )}
        </main>
      </div>

      <MobileBottomNav onLayerSelectionChange={setSelectedLayers} />

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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
              📊 Buffer Analysis Report
            </h3>
            <div style={{ overflowY: "auto", maxHeight: "400px" }}>
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
                      Anganwadi
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      District
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Village
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                      Schools
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row: any, idx: number) => (
                    <tr key={idx}>
                      <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                        {row.anganwadiName}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                        {row.district}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                        {row.village}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                        {row.numberOfSchools || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
        onClose={() => setShowEditProfileModal(false)}
        onSave={() => setShowEditProfileModal(false)}
      />
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSave={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
}
