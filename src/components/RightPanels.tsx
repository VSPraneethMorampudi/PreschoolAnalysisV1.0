import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Info, 
  Mountain, 
  Map, 
  Minimize2, 
  Maximize2, 
  X,
  Navigation,
  Ruler,
  Layers
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface RightPanelsProps {
  currentCoordinates: [number, number];
  currentZoom: number;
  currentElevation: number;
}

export const RightPanels: React.FC<RightPanelsProps> = ({
  currentCoordinates,
  currentZoom,
  currentElevation
}) => {
  const { selectedLanguage, selectedLayers } = useAppStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed top-20 right-4 z-30 h-10 w-10 p-0 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg"
      >
        <Info className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className={`
      fixed top-16 right-4 z-30 transition-all duration-300 ease-in-out
      ${isMinimized ? 'w-80' : 'w-96'}
    `}>
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
              <Info className="h-4 w-4 text-emerald-600" />
              <span>
                {selectedLanguage === 'hi' ? 'मानचित्र जानकारी' : 'Map Information'}
              </span>
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="info" className="text-xs">
                  <Navigation className="h-3 w-3 mr-1" />
                  {selectedLanguage === 'hi' ? 'जानकारी' : 'Info'}
                </TabsTrigger>
                <TabsTrigger value="elevation" className="text-xs">
                  <Mountain className="h-3 w-3 mr-1" />
                  {selectedLanguage === 'hi' ? 'ऊंचाई' : 'Elevation'}
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-800">
                      {selectedLanguage === 'hi' ? 'सक्रिय परत लेजेंड' : 'Active Layer Legends'}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {selectedLayers.length}
                    </Badge>
                  </div>

                  {selectedLayers.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <div className="text-sm">
                        {selectedLanguage === 'hi' 
                          ? 'कोई सक्रिय परत नहीं'
                          : 'No active layers'
                        }
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedLayers.slice(0, 6).map((layerId, index) => (
                        <div key={layerId} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ 
                              backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                              opacity: 0.7
                            }}
                          />
                          <span className="text-xs font-medium text-gray-700 capitalize truncate">
                            {layerId.replace('cg_', '').replace(/_/g, ' ')}
                          </span>
                        </div>
                      ))}
                      {selectedLayers.length > 6 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{selectedLayers.length - 6} {selectedLanguage === 'hi' ? 'और परतें' : 'more layers'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>
    </div>
  );
};