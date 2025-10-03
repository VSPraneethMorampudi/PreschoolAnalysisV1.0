import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GripHorizontal, Minimize2, Maximize2, X } from 'lucide-react';

// Utility function to get contextual positioning based on panel type
const getContextualPosition = (panelWidth: number = 300, panelHeight: number = 200, panelIndex: number = 0, panelType?: string) => {
  const isMobile = window.innerWidth < 768; // Tailwind's lg breakpoint
  
  if (isMobile) {
    // Center the panel on mobile with slight offset for multiple panels
    const baseX = (window.innerWidth - panelWidth) / 2;
    const baseY = (window.innerHeight - panelHeight) / 2;
    
    // Add slight offset for multiple panels to avoid perfect overlap
    const offsetX = panelIndex * 20;
    const offsetY = panelIndex * 20;
    
    // Ensure panels don't go off screen and account for mobile UI elements
    const mobilePadding = 20;
    const bottomPadding = 100; // Account for mobile bottom navigation
    
    return {
      x: Math.max(mobilePadding, Math.min(baseX + offsetX, window.innerWidth - panelWidth - mobilePadding)),
      y: Math.max(mobilePadding, Math.min(baseY + offsetY, window.innerHeight - panelHeight - bottomPadding))
    };
  } else {
    // Desktop contextual positioning
    const sidebarWidth = 280; // Main sidebar width
    const rightMargin = 20;
    
    switch (panelType) {
      case 'left-sidebar':
        // Position under search bar (left of main content area)
        const searchBarY = 16; // Search bar is at top-4 (16px from top)
        const searchBarHeight = 40; // Approximate search bar height
        return {
          x: sidebarWidth + 20, // Just after sidebar
          y: searchBarY + searchBarHeight + 20 + (panelIndex * 20) // Under search bar with margin
        };
      
      case 'map-info':
        // Position next to map info button (right side controls)
        const mapControlsX = 16; // MapControls are at right-4 (16px from right)
        const mapInfoX = window.innerWidth - panelWidth - mapControlsX - 60; // Next to map controls
        return {
          x: Math.max(sidebarWidth + 20, mapInfoX),
          y: 16 + (panelIndex * 20) // Align with top of map controls
        };
      
      case 'active-layers':
        // Position next to active layers button (slightly below map info)
        const mapControlsXForActiveLayers = 16; // MapControls are at right-4 (16px from right)
        const activeLayersX = window.innerWidth - panelWidth - mapControlsXForActiveLayers - 60;
        return {
          x: Math.max(sidebarWidth + 20, activeLayersX),
          y: 16 + 60 + (panelIndex * 20) // Below map info panel
        };
      
      default:
        // Default positioning - center-right area
        const leftMargin = sidebarWidth + 20;
        const availableWidth = window.innerWidth - leftMargin - rightMargin;
        const centerX = leftMargin + (availableWidth * 0.3);
        const maxX = window.innerWidth - panelWidth - rightMargin;
        
        return {
          x: Math.max(leftMargin, Math.min(centerX, maxX)),
          y: 50 + (panelIndex * 20)
        };
    }
  }
};

interface DraggablePanelProps {
  children: React.ReactNode;
  title: string;
  defaultPosition: { x: number; y: number };
  onClose?: () => void;
  className?: string;
  minWidth?: number;
  minHeight?: number;
  panelIndex?: number;
  panelType?: string;
}

export const DraggablePanel: React.FC<DraggablePanelProps> = ({
  children,
  title,
  defaultPosition,
  onClose,
  className = '',
  minWidth = 300,
  minHeight = 200,
  panelIndex = 0,
  panelType,
}) => {
  const [position, setPosition] = useState(() => 
    getContextualPosition(minWidth, minHeight, panelIndex, panelType)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [touchStartTime, setTouchStartTime] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (panelRef.current && e.touches.length === 1) {
      const rect = panelRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      setTouchStartTime(Date.now());
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
      setIsDragging(true);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && panelRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get panel dimensions
        const panelWidth = panelRef.current.offsetWidth;
        const panelHeight = panelRef.current.offsetHeight;
        
        // Constrain to viewport with padding
        const padding = 20;
        const maxX = viewportWidth - panelWidth - padding;
        const maxY = viewportHeight - panelHeight - padding;
        
        setPosition({
          x: Math.max(padding, Math.min(newX, maxX)),
          y: Math.max(padding, Math.min(newY, maxY)),
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && panelRef.current && e.touches.length === 1) {
        const touch = e.touches[0];
        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;
        
        // Only allow dragging after a small delay to prevent accidental drags
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration < 100) {
          return;
        }
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get panel dimensions
        const panelWidth = panelRef.current.offsetWidth;
        const panelHeight = panelRef.current.offsetHeight;
        
        // Constrain to viewport with padding
        const padding = 20;
        const maxX = viewportWidth - panelWidth - padding;
        const maxY = viewportHeight - panelHeight - padding;
        
        setPosition({
          x: Math.max(padding, Math.min(newX, maxX)),
          y: Math.max(padding, Math.min(newY, maxY)),
        });
        
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragOffset]);

  // Handle window resize to recalculate positioning
  useEffect(() => {
    const handleResize = () => {
      const newPosition = getContextualPosition(minWidth, minHeight, panelIndex, panelType);
      setPosition(newPosition);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [minWidth, minHeight, panelIndex, panelType]);

  const isMobile = window.innerWidth < 768;
  
  return (
    <div
      ref={panelRef}
      className={`fixed bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl z-[60] ${className} ${
        isMobile ? 'max-w-[calc(100vw-40px)] max-h-[calc(100vh-120px)]' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        minWidth: isMobile ? Math.min(minWidth, window.innerWidth - 40) : minWidth,
        minHeight: isMinimized ? 'auto' : minHeight,
        cursor: isDragging ? 'grabbing' : 'default',
        touchAction: 'none',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 rounded-t-lg cursor-grab active:cursor-grabbing select-none touch-none hover:from-gray-100 hover:to-gray-200 transition-colors"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ touchAction: 'none' }}
        title="Drag to move panel"
      >
        <div className="flex items-center space-x-2">
          <GripHorizontal className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-6 w-6 p-0 hover:bg-gray-200"
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-200"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Content */}
      {!isMinimized && (
        <div className="p-3 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {children}
        </div>
      )}
    </div>
  );
};