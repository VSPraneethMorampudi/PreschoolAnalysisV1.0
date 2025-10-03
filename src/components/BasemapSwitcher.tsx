import React, { useState } from 'react';
import { Map } from 'ol';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Map as MapIcon, Layers, Satellite, Globe, Mountain } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface BasemapSwitcherProps {
  map: Map | null;
}

export interface BasemapOption {
  id: string;
  name: string;
  nameHi: string;
  icon: React.ReactNode;
  description: string;
  descriptionHi: string;
  previewUrl: string;
}

const basemapOptions: BasemapOption[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    nameHi: 'ओपन स्ट्रीट मैप',
    icon: <MapIcon className="h-4 w-4" />,
    description: 'Street map with roads and labels',
    descriptionHi: 'सड़कों और लेबल के साथ स्ट्रीट मैप',
    previewUrl: 'https://tile.openstreetmap.org/7/64/42.png'
  },
  {
    id: 'satellite',
    name: 'Satellite',
    nameHi: 'उपग्रह',
    icon: <Satellite className="h-4 w-4" />,
    description: 'Satellite imagery',
    descriptionHi: 'उपग्रह इमेजरी',
    previewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/7/64/42'
  },
  {
    id: 'terrain',
    name: 'Terrain',
    nameHi: 'भूभाग',
    icon: <Mountain className="h-4 w-4" />,
    description: 'Topographic map with elevation',
    descriptionHi: 'ऊंचाई के साथ स्थलाकृतिक मैप',
    previewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/7/64/42'
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    nameHi: 'हाइब्रिड',
    icon: <Globe className="h-4 w-4" />,
    description: 'Satellite with labels',
    descriptionHi: 'लेबल के साथ उपग्रह',
    previewUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/7/64/42'
  }
];

export const BasemapSwitcher: React.FC<BasemapSwitcherProps> = ({ map }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [demoSelectedBasemap, setDemoSelectedBasemap] = useState('osm'); // Local state for demo
  const { selectedLanguage, selectedBasemap, setSelectedBasemap } = useAppStore();

  const handleBasemapChange = (basemapId: string) => {
    // Demo functionality - update local selection state
    setDemoSelectedBasemap(basemapId);
    setIsOpen(false);
    
    // Commented out for demo - basemap switching functionality disabled
    // if (map && selectedBasemap !== basemapId) {
    //   setSelectedBasemap(basemapId);
    //   setIsOpen(false);
    // }
  };

  const currentBasemap = basemapOptions.find(option => option.id === demoSelectedBasemap) || basemapOptions[0];

  return (
    <div className="absolute bottom-20 right-4 z-30">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-gray-200 h-9 px-3"
          >
            <Layers className="h-4 w-4 mr-2" />
            <span className="text-xs font-medium">
              {selectedLanguage === 'hi' ? currentBasemap.nameHi : currentBasemap.name}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-48 p-3 bg-white/95 backdrop-blur-sm border-gray-200 shadow-xl"
          align="end"
          side="top"
        >
          <div className="space-y-2">
            <div className="px-1 py-1 text-xs font-semibold text-gray-700 border-b border-gray-100 mb-2">
              {selectedLanguage === 'hi' ? 'बेसमैप चुनें' : 'Choose Basemap'}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {basemapOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={demoSelectedBasemap === option.id ? "default" : "ghost"}
                  size="sm"
                  className={`w-full h-auto p-0 flex flex-col items-center justify-center ${
                    demoSelectedBasemap === option.id 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => handleBasemapChange(option.id)}
                >
                  <div className="w-full aspect-square relative overflow-hidden rounded-lg">
                    <img
                      src={option.previewUrl}
                      alt={selectedLanguage === 'hi' ? option.nameHi : option.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-100">${option.icon}</div>`;
                        }
                      }}
                    />
                    {/* Text overlay at bottom left */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5">
                      <div className="text-white text-[10px] font-medium text-left">
                        {selectedLanguage === 'hi' ? option.nameHi : option.name}
                      </div>
                    </div>
                    {demoSelectedBasemap === option.id && (
                      <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                        <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
