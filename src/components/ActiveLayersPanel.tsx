import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Eye, EyeOff, X } from 'lucide-react';
import { DraggablePanel } from './DraggablePanel';
import { useAppStore } from '@/lib/store';

interface ActiveLayersPanelProps {
  selectedLayers: string[];
  onLayerToggle: (layerId: string) => void;
  onClose: () => void;
}

export const ActiveLayersPanel: React.FC<ActiveLayersPanelProps> = ({
  selectedLayers,
  onLayerToggle,
  onClose,
}) => {
  const { selectedLanguage } = useAppStore();

  if (selectedLayers.length === 0) {
    return null;
  }

  const formatLayerName = (layerId: string): string => {
    return layerId.replace('cg_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <DraggablePanel
      title={selectedLanguage === 'hi' ? 'सक्रिय परतें' : 'Active Layers'}
      defaultPosition={{ x: 0, y: 0 }} // Will be overridden by contextual positioning
      onClose={onClose}
      minWidth={260}
      minHeight={200}
      panelIndex={1}
      panelType="active-layers"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge className="bg-emerald-600 text-white text-[10px]">
            {selectedLayers.length} {selectedLanguage === 'hi' ? 'परतें' : 'layers'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectedLayers.forEach(onLayerToggle)}
            className="text-[10px] h-5 px-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {selectedLanguage === 'hi' ? 'सभी बंद करें' : 'Hide all'}
          </Button>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {selectedLayers.map((layerId, index) => (
            <div key={layerId} className="bg-white border border-gray-200 rounded p-2 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                  <div 
                    className="w-2.5 h-2.5 rounded border flex-shrink-0"
                    style={{ 
                      backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                      opacity: 0.7
                    }}
                  />
                  <span className="text-xs font-medium text-gray-700 truncate">
                    {formatLayerName(layerId)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 hover:bg-gray-100"
                    title={selectedLanguage === 'hi' ? 'दिखाएं/छुपाएं' : 'Show/Hide'}
                  >
                    <Eye className="h-2.5 w-2.5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLayerToggle(layerId)}
                    className="h-5 w-5 p-0 hover:bg-red-50 hover:text-red-600"
                    title={selectedLanguage === 'hi' ? 'हटाएं' : 'Remove'}
                  >
                    <X className="h-2.5 w-2.5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] text-gray-500 font-medium flex-shrink-0">
                  {selectedLanguage === 'hi' ? 'अपारदर्शिता:' : 'Opacity:'}
                </span>
                <Slider
                  defaultValue={[70]}
                  max={100}
                  step={10}
                  className="flex-1"
                />
                <span className="text-[10px] text-gray-600 w-6 flex-shrink-0">70%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DraggablePanel>
  );
};