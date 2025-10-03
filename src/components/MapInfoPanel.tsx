import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Navigation, Mountain, Map, Layers } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DraggablePanel } from './DraggablePanel';
import { ScaleBar } from './ScaleBar';

interface MapInfoPanelProps {
  currentCoordinates: [number, number];
  currentZoom: number;
  currentElevation: number;
  selectedLayers: string[];
  mapScale: { value: number; unit: string };
  onClose: () => void;
}

export const MapInfoPanel: React.FC<MapInfoPanelProps> = ({
  currentCoordinates,
  currentZoom,
  currentElevation,
  selectedLayers,
  mapScale,
  onClose
}) => {
  const { selectedLanguage } = useAppStore();
  const [isElevationExpanded, setIsElevationExpanded] = useState(false);

  const formatLayerName = (layerId: string): string => {
    return layerId.replace('cg_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <DraggablePanel
      title={selectedLanguage === 'hi' ? 'मानचित्र जानकारी' : 'Map Information'}
      defaultPosition={{ x: 0, y: 0 }} // Will be overridden by contextual positioning
      onClose={onClose}
      minWidth={260}
      minHeight={200}
      panelIndex={0}
      panelType="map-info"
    >
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-2">
          <TabsTrigger value="info" className="text-[10px]">
            <Navigation className="h-2.5 w-2.5 mr-1" />
            {selectedLanguage === 'hi' ? 'जानकारी' : 'Info'}
          </TabsTrigger>
          <TabsTrigger value="elevation" className="text-[10px]">
            <Mountain className="h-2.5 w-2.5 mr-1" />
            {selectedLanguage === 'hi' ? 'ऊंचाई' : 'Elevation'}
          </TabsTrigger>
          <TabsTrigger value="legends" className="text-[10px]">
            <Map className="h-2.5 w-2.5 mr-1" />
            {selectedLanguage === 'hi' ? 'लेजेंड' : 'Legends'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-600">
                {selectedLanguage === 'hi' ? 'अक्षांश:' : 'Latitude:'}
              </label>
              <div className="text-[10px] font-mono bg-gray-50 p-1 rounded border">
                {currentCoordinates[1].toFixed(6)}°
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-600">
                {selectedLanguage === 'hi' ? 'देशांतर:' : 'Longitude:'}
              </label>
              <div className="text-[10px] font-mono bg-gray-50 p-1 rounded border">
                {currentCoordinates[0].toFixed(6)}°
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-600">
              {selectedLanguage === 'hi' ? 'ज़ूम स्तर:' : 'Zoom Level:'}
            </label>
            <div className="text-[10px] font-mono bg-gray-50 p-1 rounded border">
              {currentZoom.toFixed(1)}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-600">
              {selectedLanguage === 'hi' ? 'मापक:' : 'Scale:'}
            </label>
            <div className="bg-gray-50 p-2 rounded border">
              <ScaleBar scale={mapScale} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-600">
              {selectedLanguage === 'hi' ? 'प्रक्षेपण:' : 'Projection:'}
            </label>
            <div className="text-[10px] bg-gray-50 p-1 rounded border">
              EPSG:3857 (Web Mercator)
            </div>
          </div>
        </TabsContent>

        <TabsContent value="elevation" className="space-y-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {currentElevation}m
            </div>
            <div className="text-xs text-gray-600">
              {selectedLanguage === 'hi' ? 'समुद्र तल से ऊपर' : 'Above Sea Level'}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-2 rounded-lg cursor-pointer hover:from-green-200 hover:to-emerald-200 transition-colors"
               onClick={() => setIsElevationExpanded(!isElevationExpanded)}>
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-emerald-800">
                {selectedLanguage === 'hi' ? 'ऊंचाई चार्ट' : 'Elevation Chart'}
              </div>
              <div className="text-xs text-emerald-600">
                {isElevationExpanded ? 'Collapse' : 'Expand'}
              </div>
            </div>
            <div className="h-12 bg-gradient-to-t from-green-200 to-emerald-300 rounded relative mt-1">
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-emerald-700 p-1">
                <span>Min: 180m</span>
                <span>Max: 1,200m</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="bg-blue-50 p-1.5 rounded">
              <div className="font-medium text-blue-800">
                {selectedLanguage === 'hi' ? 'न्यूनतम' : 'Minimum'}
              </div>
              <div className="text-blue-600">180m</div>
            </div>
            <div className="bg-orange-50 p-1.5 rounded">
              <div className="font-medium text-orange-800">
                {selectedLanguage === 'hi' ? 'अधिकतम' : 'Maximum'}
              </div>
              <div className="text-orange-600">1,200m</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="legends" className="space-y-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-gray-800">
                {selectedLanguage === 'hi' ? 'सक्रिय परत लेजेंड' : 'Active Layer Legends'}
              </h4>
              <Badge variant="secondary" className="text-[10px]">
                {selectedLayers.length}
              </Badge>
            </div>

            {selectedLayers.length === 0 ? (
              <div className="text-center py-3 text-gray-500">
                <Layers className="h-6 w-6 mx-auto mb-1 opacity-50" />
                <div className="text-xs">
                  {selectedLanguage === 'hi' 
                    ? 'कोई सक्रिय परत नहीं'
                    : 'No active layers'
                  }
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {selectedLayers.slice(0, 6).map((layerId, index) => (
                  <div key={layerId} className="flex items-center space-x-1.5 p-1.5 bg-gray-50 rounded">
                    <div 
                      className="w-3 h-3 rounded border"
                      style={{ 
                        backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                        opacity: 0.7
                      }}
                    />
                    <span className="text-[10px] font-medium text-gray-700 capitalize truncate">
                      {formatLayerName(layerId)}
                    </span>
                  </div>
                ))}
                {selectedLayers.length > 6 && (
                  <div className="text-[10px] text-gray-500 text-center">
                    +{selectedLayers.length - 6} {selectedLanguage === 'hi' ? 'और परतें' : 'more layers'}
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DraggablePanel>
    
    {/* Expanded Elevation Chart - Movable */}
    {isElevationExpanded && (
      <DraggablePanel
        title={selectedLanguage === 'hi' ? 'ऊंचाई चार्ट' : 'Elevation Chart'}
        defaultPosition={{ x: Math.max(20, window.innerWidth - 400), y: Math.max(100, window.innerHeight - 200) }}
        onClose={() => setIsElevationExpanded(false)}
        minWidth={320}
        minHeight={100}
        maxWidth={600}
        maxHeight={200}
      >
        {/* Elevation Graph Only */}
        <div className="h-16 bg-gradient-to-r from-blue-200 via-green-200 to-orange-200 rounded-lg relative overflow-hidden w-full">
          <div 
            className="absolute top-0 bottom-0 w-1 bg-red-500"
            style={{ 
              left: `${((currentElevation - 180) / (1200 - 180)) * 100}%` 
            }}
          >
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600 bg-white px-1 rounded shadow-sm">
              {currentElevation}m
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 p-2">
            <span>180m</span>
            <span>1,200m</span>
          </div>
        </div>
      </DraggablePanel>
    );
};