import React from 'react';
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Navigation, Layers, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFullscreen?: () => void;
  onToggleActiveLayers?: () => void;
  onToggleClusterDemo?: () => void;
  onToggleMapInfo?: () => void;
  showActiveLayers?: boolean;
  showClusterDemo?: boolean;
  showMapInfo?: boolean;
  hasActiveLayers?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onFullscreen,
  onToggleActiveLayers,
  onToggleClusterDemo,
  onToggleMapInfo,
  showActiveLayers = false,
  showClusterDemo = false,
  showMapInfo = false,
  hasActiveLayers = false,
}) => {
  const { selectedLanguage } = useAppStore();

  return (
    <div className="absolute top-4 right-4 z-20 space-y-2">
      {/* Panel Toggle Controls */}
      <Card className="p-1 bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="flex flex-col space-y-1">
          {onToggleMapInfo && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMapInfo}
              className={`p-2 h-8 w-8 hover:bg-emerald-50 hover:text-emerald-700 ${
                showMapInfo ? 'bg-emerald-100 text-emerald-700' : ''
              }`}
              title={selectedLanguage === 'hi' ? 'मानचित्र जानकारी' : 'Map Information'}
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
          
          {onToggleActiveLayers && hasActiveLayers && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleActiveLayers}
              className={`p-2 h-8 w-8 hover:bg-emerald-50 hover:text-emerald-700 ${
                showActiveLayers ? 'bg-emerald-100 text-emerald-700' : ''
              }`}
              title={selectedLanguage === 'hi' ? 'सक्रिय परतें' : 'Active Layers'}
            >
              <Layers className="h-4 w-4" />
            </Button>
          )}
          
          {onToggleClusterDemo && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleClusterDemo}
              className={`p-2 h-8 w-8 hover:bg-emerald-50 hover:text-emerald-700 ${
                showClusterDemo ? 'bg-emerald-100 text-emerald-700' : ''
              }`}
              title={selectedLanguage === 'hi' ? 'क्लस्टर डेमो' : 'Cluster Demo'}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
      
      {/* Zoom Controls */}
      <Card className="p-1 bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="flex flex-col space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            className="p-2 h-8 w-8 hover:bg-emerald-50 hover:text-emerald-700"
            title={selectedLanguage === 'hi' ? 'ज़ूम इन' : 'Zoom In'}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            className="p-2 h-8 w-8 hover:bg-emerald-50 hover:text-emerald-700"
            title={selectedLanguage === 'hi' ? 'ज़ूम आउट' : 'Zoom Out'}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </Card>
      
      {/* Navigation Controls */}
      <Card className="p-1 bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="flex flex-col space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetView}
            className="p-2 h-8 w-8 hover:bg-emerald-50 hover:text-emerald-700"
            title={selectedLanguage === 'hi' ? 'छत्तीसगढ़ पर वापस जाएं' : 'Reset to Chhattisgarh'}
          >
            <Navigation className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetView}
            className="p-2 h-8 w-8 hover:bg-emerald-50 hover:text-emerald-700"
            title={selectedLanguage === 'hi' ? 'रीसेट व्यू' : 'Reset View'}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          {onFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFullscreen}
              className="p-2 h-8 w-8 hover:bg-emerald-50 hover:text-emerald-700"
              title={selectedLanguage === 'hi' ? 'पूर्ण स्क्रीन' : 'Fullscreen'}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};