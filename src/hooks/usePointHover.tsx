import { useState, useCallback, useRef, useEffect } from 'react';
import { Map } from 'ol';
import { ClusterPoint } from '@/lib/mapUtils';

interface HoverState {
  point: ClusterPoint | null;
  position: { x: number; y: number; position: 'above' | 'below'; horizontal: 'left' | 'center' | 'right' };
  visible: boolean;
}

export const usePointHover = (map: Map | null) => {
  const [hoverState, setHoverState] = useState<HoverState>({
    point: null,
    position: { x: 0, y: 0, position: 'above', horizontal: 'center' },
    visible: false
  });

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mapContainerRef = useRef<HTMLElement | null>(null);

  // Get map container element for positioning calculations
  useEffect(() => {
    if (map) {
      const mapElement = map.getTargetElement();
      if (mapElement) {
        mapContainerRef.current = mapElement;
      }
    }
  }, [map]);

  const calculatePopupPosition = useCallback((pixel: [number, number]): { x: number; y: number; position: 'above' | 'below'; horizontal: 'left' | 'center' | 'right' } => {
    if (!mapContainerRef.current) {
      return { x: pixel[0], y: pixel[1], position: 'above', horizontal: 'center' };
    }

    const mapRect = mapContainerRef.current.getBoundingClientRect();
    const popupWidth = 256; // Approximate popup width (w-64 = 16rem = 256px)
    const popupHeight = 140; // Approximate popup height (reduced due to smaller text)
    
    let x = pixel[0] + mapRect.left;
    let y = pixel[1] + mapRect.top;
    let position: 'above' | 'below' = 'above';
    let horizontal: 'left' | 'center' | 'right' = 'center';

    // Check available space in all directions
    const spaceAbove = y;
    const spaceBelow = window.innerHeight - y;
    const spaceLeft = x;
    const spaceRight = window.innerWidth - x;
    
    // UI element constraints
    const headerHeight = 80; // Approximate header height
    const rightPanelWidth = 350; // Approximate width of right panels
    const leftPanelWidth = 80; // Approximate width of left sidebar
    
    // Minimum space requirements
    const minSpaceAbove = popupHeight + headerHeight + 20;
    const minSpaceBelow = popupHeight + 20;
    const minSpaceLeft = popupWidth + 20;
    const minSpaceRight = popupWidth + 20;
    
    // Check if we have enough vertical space
    let hasVerticalSpace = spaceAbove >= minSpaceAbove || spaceBelow >= minSpaceBelow;
    
    // Check if we have enough horizontal space
    const hasHorizontalSpace = spaceLeft >= minSpaceLeft || spaceRight >= minSpaceRight;
    
    // Priority 1: Try vertical positioning (above/below) if space is available
    if (hasVerticalSpace) {
      // Check for conflicts with right-side panels
      const isNearRightEdge = x + popupWidth / 2 > window.innerWidth - rightPanelWidth;
      const isNearLeftEdge = x - popupWidth / 2 < leftPanelWidth;
      
      if (spaceAbove >= minSpaceAbove && !isNearRightEdge) {
        // Position above
        y = pixel[1] + mapRect.top - 10;
        position = 'above';
      } else if (spaceBelow >= minSpaceBelow) {
        // Position below
        y = pixel[1] + mapRect.top + 20;
        position = 'below';
      } else {
        // Fallback to horizontal positioning
        hasVerticalSpace = false;
      }
      
      // Adjust horizontal position within vertical constraints
      if (hasVerticalSpace) {
        if (x + popupWidth / 2 > window.innerWidth - rightPanelWidth) {
          x = window.innerWidth - rightPanelWidth - popupWidth / 2 - 10;
          horizontal = 'right';
        } else if (x - popupWidth / 2 < leftPanelWidth) {
          x = leftPanelWidth + popupWidth / 2 + 10;
          horizontal = 'left';
        } else {
          horizontal = 'center';
        }
      }
    }
    
    // Priority 2: Use horizontal positioning if vertical space is insufficient
    if (!hasVerticalSpace && hasHorizontalSpace) {
      // Center vertically on the point
      y = pixel[1] + mapRect.top;
      
      if (spaceRight >= minSpaceRight) {
        // Position to the right
        x = pixel[0] + mapRect.left + 20;
        horizontal = 'left';
        position = 'above'; // Default to above when positioned horizontally
      } else if (spaceLeft >= minSpaceLeft) {
        // Position to the left
        x = pixel[0] + mapRect.left - 20;
        horizontal = 'right';
        position = 'above'; // Default to above when positioned horizontally
      }
    }
    
    // Priority 3: Fallback to best available position
    if (!hasVerticalSpace && !hasHorizontalSpace) {
      // Choose the position with the most available space
      const maxVerticalSpace = Math.max(spaceAbove, spaceBelow);
      const maxHorizontalSpace = Math.max(spaceLeft, spaceRight);
      
      if (maxVerticalSpace > maxHorizontalSpace) {
        // Use vertical positioning with whatever space is available
        if (spaceAbove > spaceBelow) {
          y = pixel[1] + mapRect.top - 10;
          position = 'above';
        } else {
          y = pixel[1] + mapRect.top + 20;
          position = 'below';
        }
        
        // Adjust horizontal position
        if (x + popupWidth / 2 > window.innerWidth - rightPanelWidth) {
          x = window.innerWidth - rightPanelWidth - popupWidth / 2 - 10;
          horizontal = 'right';
        } else if (x - popupWidth / 2 < leftPanelWidth) {
          x = leftPanelWidth + popupWidth / 2 + 10;
          horizontal = 'left';
        } else {
          horizontal = 'center';
        }
      } else {
        // Use horizontal positioning with whatever space is available
        y = pixel[1] + mapRect.top;
        
        if (spaceRight > spaceLeft) {
          x = pixel[0] + mapRect.left + 20;
          horizontal = 'left';
        } else {
          x = pixel[0] + mapRect.left - 20;
          horizontal = 'right';
        }
        position = 'above';
      }
    }

    return { x, y, position, horizontal };
  }, []);

  const showHoverPopup = useCallback((point: ClusterPoint, pixel: [number, number]) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    const position = calculatePopupPosition(pixel);
    
    setHoverState({
      point,
      position,
      visible: true
    });
  }, [calculatePopupPosition]);

  const hideHoverPopup = useCallback(() => {
    // Add a small delay to prevent flickering when moving between points
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverState(prev => ({
        ...prev,
        visible: false
      }));
    }, 100);
  }, []);

  const clearHoverPopup = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    setHoverState({
      point: null,
      position: { x: 0, y: 0, position: 'above', horizontal: 'center' },
      visible: false
    });
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    hoverState,
    showHoverPopup,
    hideHoverPopup,
    clearHoverPopup
  };
};
