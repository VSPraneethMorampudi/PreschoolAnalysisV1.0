import React from 'react';
import { Layers, Pencil, Calculator, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

interface MobileBottomNavProps {
  onLayerSelectionChange: (layers: string[]) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onLayerSelectionChange }) => {
  const { 
    selectedLanguage, 
    activeSidebarTab,
    secondarySidebarOpen,
    toggleSecondarySidebar,
    setActiveSidebarTab
  } = useAppStore();

  const handleToolClick = (tab: 'layers' | 'draw' | 'analysis') => {
    setActiveSidebarTab(tab);
    if (!secondarySidebarOpen) {
      toggleSecondarySidebar();
    }
  };

  const navItems = [
    {
      id: 'layers',
      icon: Layers,
      label: selectedLanguage === 'hi' ? 'परतें' : 'Layers',
      labelShort: selectedLanguage === 'hi' ? 'परतें' : 'Layers'
    },
    {
      id: 'draw',
      icon: Pencil,
      label: selectedLanguage === 'hi' ? 'ड्रा' : 'Draw',
      labelShort: selectedLanguage === 'hi' ? 'ड्रा' : 'Draw'
    },
    {
      id: 'analysis',
      icon: Calculator,
      label: selectedLanguage === 'hi' ? 'विश्लेषण' : 'Analysis',
      labelShort: selectedLanguage === 'hi' ? 'विश्लेषण' : 'Analysis'
    },
    {
      id: 'search',
      icon: Search,
      label: selectedLanguage === 'hi' ? 'खोजें' : 'Search',
      labelShort: selectedLanguage === 'hi' ? 'खोजें' : 'Search'
    },
    {
      id: 'location',
      icon: MapPin,
      label: selectedLanguage === 'hi' ? 'स्थान' : 'Location',
      labelShort: selectedLanguage === 'hi' ? 'स्थान' : 'Location'
    }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSidebarTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                if (item.id === 'layers' || item.id === 'draw' || item.id === 'analysis') {
                  handleToolClick(item.id as 'layers' | 'draw' | 'analysis');
                } else {
                  // Handle other actions like search, location, etc.
                  console.log(`${item.id} clicked`);
                }
              }}
              className={`flex flex-col items-center justify-center h-16 w-16 p-1 ${
                isActive 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium leading-tight text-center">
                {item.labelShort}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
