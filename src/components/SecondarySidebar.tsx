import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Calculator, Layers, MapPin, Building, Users, School, AlertTriangle, TreePine, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DrawingTools } from './DrawingTools';
import { AnalysisTools } from './AnalysisTools';
import { DraggablePanel } from './DraggablePanel';
import { chhattisgarhLayerHierarchy } from '@/lib/layerData';
import { useAppStore } from '@/lib/store';

interface SecondarySidebarProps {
  onLayerSelectionChange: (layers: string[]) => void;
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
  connectAnganwadiToNearestSchool?: () => void;
  generateBufferReport?: () => void;
  onClearMap?: () => void;
  isLoading?: boolean;
  loadingMessage?: string;
}

export const SecondarySidebar: React.FC<SecondarySidebarProps> = ({ 
  onLayerSelectionChange,
  layersVisibility = {},
  toggleLayer = () => {},
  districtOptions = [],
  villageOptions = [],
  selectedDistrict = null,
  selectedVillage = "",
  onDistrictChange = () => {},
  onVillageChange = () => {},
  bufferRadius = 0.5,
  setBufferRadius = () => {},
  highlightSchoolsInBuffers = () => {},
  connectAnganwadiToNearestSchool = () => {},
  generateBufferReport = () => {},
  onClearMap = () => {},
  isLoading = false,
  loadingMessage = ""
}) => {
  const { 
    secondarySidebarOpen,
    selectedLanguage, 
    selectedLayers, 
    activeSidebarTab,
    activeDrawingTool,
    toggleSecondarySidebar,
    setActiveSidebarTab,
    setActiveDrawingTool
  } = useAppStore();
  
  const [expandedSections, setExpandedSections] = useState({
    layers: false,
    tools: false,
    mapLegend: false,
    features: false,
    coordinatesSearch: false,
    baseMap: false,
    filters: false,
  });

  const [expandedTreeNodes, setExpandedTreeNodes] = useState({
    boundaries: true,
    education: true,
    infrastructure: true,
  });

  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleTreeNode = (nodeId: string) => {
    setExpandedTreeNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Preschool-specific layer tree structure
  const preschoolLayerTree = [
    {
      id: "boundaries",
      name: "Boundaries",
      icon: MapPin,
      children: [
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
      ]
    },
    {
      id: "education",
      name: "Education",
      icon: School,
      children: [
        {
          id: "anganwadi",
          name: "Anganwadi Centers",
          icon: School,
          color: "#43a047",
          description: "Educational centers with service coverage",
        },
        {
          id: "gap",
          name: "Gap Analysis",
          icon: AlertTriangle,
          color: "#d32f2f",
          description: "Areas not covered by services",
        },
      ]
    },
    {
      id: "infrastructure",
      name: "Infrastructure",
      icon: TreePine,
      children: [
        {
          id: "river",
          name: "River",
          icon: TreePine,
          color: "#390988ff",
          description: "River",
        },
        {
          id: "rail",
          name: "Railway",
          icon: TreePine,
          color: "#96595cff",
          description: "Railway lines",
        },
        {
          id: "road",
          name: "Highway",
          icon: TreePine,
          color: "#ff89e2ff",
          description: "Road network",
        },
      ]
    },
  ];

  const totalLayers = preschoolLayerTree.reduce((sum, category) => {
    return sum + (category.children?.length || 0);
  }, 0);

  // Search filtering logic
  const matchesSearch = (text: string): boolean => {
    if (!searchTerm) return true;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredLayerTree = preschoolLayerTree.map(category => ({
    ...category,
    children: category.children?.filter(layer => 
      matchesSearch(layer.name) || matchesSearch(layer.description)
    ) || []
  })).filter(category => 
    matchesSearch(category.name) || (category.children && category.children.length > 0)
  );

  if (!secondarySidebarOpen) return null;

  const getTitle = () => {
    switch (activeSidebarTab) {
      case 'layers':
        return selectedLanguage === 'hi' ? 'परतें' : 'Layers';
      case 'draw':
        return selectedLanguage === 'hi' ? 'ड्रॉइंग उपकरण' : 'Drawing Tools';
      case 'analysis':
        return selectedLanguage === 'hi' ? 'विश्लेषण उपकरण' : 'Analysis Tools';
      default:
        return 'Tools';
    }
  };

  return (
    <DraggablePanel
      title={getTitle()}
      defaultPosition={{ x: 0, y: 0 }} // Will be overridden by contextual positioning
      onClose={toggleSecondarySidebar}
      minWidth={280}
      minHeight={400}
      className="w-80"
      panelIndex={0}
      panelType="left-sidebar"
    >
      {/* Tool Content */}
      {activeSidebarTab === 'layers' && (
        <>
          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={selectedLanguage === 'hi' ? 'परतें खोजें...' : 'Search layers...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Layer Selection Header */}
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">
                  {selectedLayers.length} / {totalLayers} {selectedLanguage === 'hi' ? 'चयनित' : 'selected'}
                </span>
                {selectedLayers.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLayerSelectionChange([])}
                    className="text-xs h-6 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    {selectedLanguage === 'hi' ? 'सभी साफ़ करें' : 'Clear all'}
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Preschool Layer Tree Selection */}
          <div className="max-h-96 overflow-y-auto space-y-1">
            {filteredLayerTree.map((category) => {
              const isExpanded = expandedTreeNodes[category.id as keyof typeof expandedTreeNodes];
              const IconComponent = category.icon;
              
              return (
                <div key={category.id} className="border border-gray-200 rounded-lg">
                  {/* Category Header */}
                  <div 
                    className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleTreeNode(category.id)}
                  >
                    <div className="flex items-center space-x-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      )}
                      <IconComponent className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </div>
                  </div>
                  
                  {/* Category Children */}
                  {isExpanded && category.children && (
                    <div className="border-t border-gray-100 bg-gray-50">
                      {category.children.map((layer) => {
                        const isVisible = (layersVisibility && layersVisibility[layer.id]) || false;
                        const LayerIconComponent = layer.icon;
                        
                        return (
                          <div key={layer.id} className="flex items-center justify-between p-2 hover:bg-gray-100">
                            <div className="flex items-center space-x-3 ml-6">
                              <div
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: layer.color }}
                              />
                              <LayerIconComponent className="h-3 w-3 text-gray-600" />
                              <div className="flex-1">
                                <div className="text-xs font-medium text-gray-900">{layer.name}</div>
                                <div className="text-xs text-gray-500">{layer.description}</div>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={isVisible}
                              onChange={() => toggleLayer(layer.id)}
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Filters Section */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Filters</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">District:</label>
                <select
                  value={selectedDistrict || ""}
                  onChange={(e) => {
                    const dist = e.target.value;
                    onDistrictChange(dist);
                  }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">-- Select District --</option>
                  {districtOptions.map((d: any) => (
                    <option key={d.dist_cod} value={d.dist_cod}>
                      {d.dist_e}
                    </option>
                  ))}
                </select>
              </div>

              {villageOptions.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Village:</label>
                  <select
                    value={selectedVillage || ""}
                    onChange={(e) => onVillageChange(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">-- Select Village --</option>
                    {villageOptions.map((v: any) => (
                      <option key={v.id} value={v.id}>
                        {v.village}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeSidebarTab === 'draw' && (
        <div className="max-h-96 overflow-y-auto">
          <DrawingTools
            onToolSelect={setActiveDrawingTool}
            activeTool={activeDrawingTool}
          />
        </div>
      )}

      {activeSidebarTab === 'analysis' && (
        <div className="max-h-96 overflow-y-auto space-y-3">
          {/* Buffer Analysis Tools */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Buffer Analysis</h3>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700">
                Buffer Radius: {bufferRadius} km
              </label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={bufferRadius}
                onChange={(e) => setBufferRadius(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={highlightSchoolsInBuffers}
                className="w-full justify-start text-xs h-8"
              >
                🎯 Highlight Schools in Buffers
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={connectAnganwadiToNearestSchool}
                className="w-full justify-start text-xs h-8"
              >
                🔗 Connect Anganwadi to Nearest School
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={generateBufferReport}
                className="w-full justify-start text-xs h-8"
              >
                📑 Generate Report
              </Button>
            </div>
          </div>

          {/* General Analysis Tools */}
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">General Tools</h3>
            <AnalysisTools
              onMeasureDistance={() => console.log('Measure distance')}
              onMeasureArea={() => console.log('Measure area')}
              onBufferAnalysis={() => console.log('Buffer analysis')}
              onSpatialQuery={() => console.log('Spatial query')}
              onExportData={() => console.log('Export data')}
              onGenerateReport={() => console.log('Generate report')}
            />
          </div>

          {/* Clear Map */}
          <div className="pt-3 border-t border-gray-200">
            <Button
              variant="destructive"
              size="sm"
              onClick={onClearMap}
              className="w-full justify-start text-xs h-8"
            >
              🗑️ Clear Map & Reset
            </Button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Resets to district-level view
            </p>
          </div>
        </div>
      )}
    </DraggablePanel>
  );
};
