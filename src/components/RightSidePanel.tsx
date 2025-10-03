import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DraggablePanel } from './DraggablePanel';
import { 
  Info, 
  Mountain, 
  Map, 
  Navigation,
  Layers,
  Filter,
  Target,
  Link,
  FileText,
  Trash2,
  MapPin,
  Building,
  Users,
  School,
  AlertTriangle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface RightSidePanelProps {
  currentCoordinates: [number, number];
  currentZoom: number;
  currentElevation: number;
  onClose?: () => void;
  // New props for enhanced functionality
  layersVisibility?: any;
  toggleLayer?: (layerId: string) => void;
  districtOptions?: any[];
  villageOptions?: any[];
  selectedDistrict?: any;
  selectedVillage?: string;
  onDistrictChange?: (district: any) => void;
  onVillageChange?: (village: string) => void;
  bufferRadius?: number;
  setBufferRadius?: (radius: number) => void;
  highlightSchoolsInBuffers?: () => void;
  generateBufferReport?: () => void;
  connectAnganwadiToNearestSchool?: () => void;
  onClearMap?: () => void;
}

export const RightSidePanel: React.FC<RightSidePanelProps> = ({
  currentCoordinates,
  currentZoom,
  currentElevation,
  onClose,
  layersVisibility = {},
  toggleLayer = () => {},
  districtOptions = [],
  villageOptions = [],
  selectedDistrict,
  selectedVillage = "",
  onDistrictChange = () => {},
  onVillageChange = () => {},
  bufferRadius = 0.5,
  setBufferRadius = () => {},
  highlightSchoolsInBuffers = () => {},
  generateBufferReport = () => {},
  connectAnganwadiToNearestSchool = () => {},
  onClearMap = () => {}
}) => {
  const { selectedLanguage, selectedLayers, activeSidebarTab } = useAppStore();
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportData, setReportData] = useState([]);

  // Enhanced error handling for report generation
  const handleGenerateReport = () => {
    console.log("Generate Report button clicked");

    if (generateBufferReport && typeof generateBufferReport === "function") {
      try {
        const data = generateBufferReport();
        console.log("Report data:", data);

        if (data && Array.isArray(data) && data.length > 0) {
          setReportData(data);
          setShowReportPopup(true);
        } else {
          alert("No data available for report generation");
        }
      } catch (error) {
        console.error("Error generating report:", error);
        alert("Error generating report: " + (error as Error).message);
      }
    } else {
      console.error("generateBufferReport function is not available");
      alert(
        "Report generation function is not available. Please wait for the map to load completely."
      );
    }
  };

  const layerItems = [
    {
      id: "state",
      name: "State Boundary",
      icon: MapPin,
      color: "#000",
      description: "Chhattisgarh state outline",
    },
    {
      id: "district",
      name: "District Boundary",
      icon: Building,
      color: "#e53935",
      description: "Administrative district boundaries",
    },
    {
      id: "village",
      name: "Village Boundary",
      icon: Users,
      color: "#1e88e5",
      description: "Village-level administrative boundaries",
    },
    {
      id: "anganwadi",
      name: "Anganwadi Centers",
      icon: School,
      color: "#43a047",
      description: "Educational centers with service coverage",
    },
    {
      id: "schools",
      name: "Primary Schools",
      icon: School,
      color: "#2196f3",
      description: "Primary educational institutions",
    },
    {
      id: "gap",
      name: "Gap Analysis",
      icon: AlertTriangle,
      color: "#d32f2f",
      description: "Areas not covered by services",
    },
  ];

  return (
    <DraggablePanel
      title={selectedLanguage === 'hi' ? 'मानचित्र जानकारी' : 'Map Information'}
      defaultPosition={{ x: 0, y: 0 }} // Will be overridden by contextual positioning
      onClose={onClose}
      minWidth={320}
      minHeight={200}
      panelIndex={0}
      panelType="map-info"
    >

          <Tabs defaultValue={activeSidebarTab === 'filters' ? 'filters' : activeSidebarTab === 'analysis' ? 'tools' : 'info'} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="info" className="text-xs">
                <Navigation className="h-3 w-3 mr-1" />
                {selectedLanguage === 'hi' ? 'जानकारी' : 'Info'}
              </TabsTrigger>
              <TabsTrigger value="layers" className="text-xs">
                <Layers className="h-3 w-3 mr-1" />
                {selectedLanguage === 'hi' ? 'परतें' : 'Layers'}
              </TabsTrigger>
              <TabsTrigger value="filters" className="text-xs">
                <Filter className="h-3 w-3 mr-1" />
                {selectedLanguage === 'hi' ? 'फिल्टर' : 'Filters'}
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                {selectedLanguage === 'hi' ? 'उपकरण' : 'Tools'}
              </TabsTrigger>
              <TabsTrigger value="legends" className="text-xs">
                <Map className="h-3 w-3 mr-1" />
                {selectedLanguage === 'hi' ? 'लेजेंड' : 'Legends'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    {selectedLanguage === 'hi' ? 'अक्षांश:' : 'Latitude:'}
                  </label>
                  <div className="text-sm font-mono bg-gray-50 p-2 rounded border">
                    {currentCoordinates[1].toFixed(6)}°
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    {selectedLanguage === 'hi' ? 'देशांतर:' : 'Longitude:'}
                  </label>
                  <div className="text-sm font-mono bg-gray-50 p-2 rounded border">
                    {currentCoordinates[0].toFixed(6)}°
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  {selectedLanguage === 'hi' ? 'ज़ूम स्तर:' : 'Zoom Level:'}
                </label>
                <div className="text-sm font-mono bg-gray-50 p-2 rounded border">
                  {currentZoom.toFixed(1)}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  {selectedLanguage === 'hi' ? 'प्रक्षेपण:' : 'Projection:'}
                </label>
                <div className="text-sm bg-gray-50 p-2 rounded border">
                  EPSG:3857 (Web Mercator)
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layers" className="space-y-3">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-800">
                  {selectedLanguage === 'hi' ? 'मानचित्र परतें' : 'Map Layers'}
                </h4>

                <div className="space-y-2">
                  {layerItems.map((layer) => {
                    const isVisible = (layersVisibility && layersVisibility[layer.id]) || false;
                    const IconComponent = layer.icon;
                    return (
                      <div key={layer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: layer.color }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {layer.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {layer.description}
                            </div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isVisible}
                            onChange={() => toggleLayer(layer.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-3">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-800">
                  {selectedLanguage === 'hi' ? 'डेटा फिल्टर' : 'Data Filters'}
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">
                      {selectedLanguage === 'hi' ? 'जिला:' : 'District:'}
                    </label>
                    <select
                      value={selectedDistrict || ""}
                      onChange={(e) => {
                        const dist = e.target.value;
                        onDistrictChange(dist);
                        // Force-enable layers when a district is selected
                        if (dist) {
                          toggleLayer("village");
                          toggleLayer("anganwadi");
                          toggleLayer("schools");
                        }
                      }}
                      className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- {selectedLanguage === 'hi' ? 'जिला चुनें' : 'Select District'} --</option>
                      {districtOptions.map((d) => (
                        <option key={d.dist_cod} value={d.dist_cod}>
                          {d.dist_e}
                        </option>
                      ))}
                    </select>
                  </div>

                  {villageOptions.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-2 block">
                        {selectedLanguage === 'hi' ? 'गांव:' : 'Village:'}
                      </label>
                      <select
                        value={selectedVillage || ""}
                        onChange={(e) => onVillageChange(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- {selectedLanguage === 'hi' ? 'गांव चुनें' : 'Select Village'} --</option>
                        {villageOptions.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.village}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200">
                    <Button
                      onClick={onClearMap}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {selectedLanguage === 'hi' ? 'मानचित्र साफ करें' : 'Clear Map'}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-3">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-800">
                  {selectedLanguage === 'hi' ? 'विश्लेषण उपकरण' : 'Analysis Tools'}
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-2 block">
                      {selectedLanguage === 'hi' ? 'बफर त्रिज्या (किमी):' : 'Buffer Radius (km):'}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={bufferRadius}
                        onChange={(e) => setBufferRadius(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-center text-sm font-medium text-gray-700">
                        {bufferRadius} km
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={highlightSchoolsInBuffers}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      {selectedLanguage === 'hi' ? 'बफर में स्कूल हाइलाइट करें' : 'Highlight Schools in Buffers'}
                    </Button>

                    <Button
                      onClick={connectAnganwadiToNearestSchool}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Link className="h-4 w-4 mr-2" />
                      {selectedLanguage === 'hi' ? 'अंगनवाड़ी को निकटतम स्कूल से जोड़ें' : 'Connect Anganwadi to Nearest School'}
                    </Button>

                    <Button
                      onClick={handleGenerateReport}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {selectedLanguage === 'hi' ? 'रिपोर्ट जेनरेट करें' : 'Generate Report'}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="elevation" className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {currentElevation}m
                </div>
                <div className="text-sm text-gray-600">
                  {selectedLanguage === 'hi' ? 'समुद्र तल से ऊपर' : 'Above Sea Level'}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-lg">
                <div className="text-sm font-medium text-emerald-800 mb-2">
                  {selectedLanguage === 'hi' ? 'ऊंचाई चार्ट' : 'Elevation Chart'}
                </div>
                <div className="h-16 bg-gradient-to-t from-green-200 to-emerald-300 rounded relative">
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-emerald-700 p-1">
                    <span>Min: 180m</span>
                    <span>Max: 1,200m</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-medium text-blue-800">
                    {selectedLanguage === 'hi' ? 'न्यूनतम' : 'Minimum'}
                  </div>
                  <div className="text-blue-600">180m</div>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <div className="font-medium text-orange-800">
                    {selectedLanguage === 'hi' ? 'अधिकतम' : 'Maximum'}
                  </div>
                  <div className="text-orange-600">1,200m</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="legends" className="space-y-3">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-800">
                  {selectedLanguage === 'hi' ? 'मानचित्र लेजेंड' : 'Map Legend'}
                </h4>

                {/* Preschool-specific Legend */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    {selectedLanguage === 'hi' ? 'अंगनवाड़ी सेवा कवरेज' : 'Anganwadi Service Coverage'}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: '#43a047' }} />
                      <span className="text-xs text-gray-700">
                        {selectedLanguage === 'hi' ? 'अंगनवाड़ी (कवर किया गया)' : 'Anganwadi (Covered)'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: '#d32f2f' }} />
                      <span className="text-xs text-gray-700">
                        {selectedLanguage === 'hi' ? 'अंगनवाड़ी (कोई स्कूल नहीं)' : 'Anganwadi (No School Nearby)'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: '#c8e937' }} />
                      <span className="text-xs text-gray-700">
                        {selectedLanguage === 'hi' ? 'निकटतम स्कूल' : 'Nearest School'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-0.5 border-t-2 border-dashed border-brown-600" style={{ backgroundColor: 'brown' }} />
                      <span className="text-xs text-gray-700">
                        {selectedLanguage === 'hi' ? 'कनेक्शन लाइन' : 'Connection Line'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Infrastructure Legend */}
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    {selectedLanguage === 'hi' ? 'बुनियादी ढांचा' : 'Infrastructure'}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: '#e53935' }} />
                      <span className="text-xs text-gray-700">
                        {selectedLanguage === 'hi' ? 'जिला सीमा' : 'District Boundary'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: '#1e88e5' }} />
                      <span className="text-xs text-gray-700">
                        {selectedLanguage === 'hi' ? 'गांव सीमा' : 'Village Boundary'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: '#390988ff' }} />
                      <span className="text-xs text-gray-700">
                        {selectedLanguage === 'hi' ? 'नदी' : 'River'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: '#96595cff' }} />
                      <span className="text-xs text-gray-700">
                        {selectedLanguage === 'hi' ? 'रेलवे' : 'Railway'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: '#ff89e2ff' }} />
                      <span className="text-xs text-gray-700">
                        {selectedLanguage === 'hi' ? 'राजमार्ग' : 'Highway'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
    </DraggablePanel>
  );
};