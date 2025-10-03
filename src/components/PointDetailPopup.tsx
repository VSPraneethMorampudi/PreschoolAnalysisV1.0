import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, User, Tag, Circle } from 'lucide-react';
import { ClusterPoint } from '@/lib/mapUtils';

interface PointDetailPopupProps {
  point: ClusterPoint;
  position: { x: number; y: number; position: 'above' | 'below'; horizontal: 'left' | 'center' | 'right' };
  visible: boolean;
  onClose: () => void;
  className?: string;
}

export const PointDetailPopup: React.FC<PointDetailPopupProps> = ({
  point,
  position,
  visible,
  onClose,
  className = ''
}) => {
  if (!visible) return null;

  const formatCoordinate = (coord: number, type: 'lat' | 'lon') => {
    const direction = type === 'lat' 
      ? (coord >= 0 ? 'N' : 'S')
      : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(6)}°${direction}`;
  };

  const getPointTypeColor = (type?: string) => {
    // Return neutral gray color for all types
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPointTypeIcon = (type?: string) => {
    // Return a simple circle icon for all types
    return <Circle className="h-4 w-4 text-gray-600" />;
  };

  const getTransform = () => {
    let xTransform = '-50%';
    let yTransform = position.position === 'below' ? '0%' : '-100%';
    
    // Adjust horizontal positioning
    if (position.horizontal === 'left') {
      xTransform = '0%';
    } else if (position.horizontal === 'right') {
      xTransform = '-100%';
    }
    
    return `translate(${xTransform}, ${yTransform})`;
  };

  const getArrowPosition = () => {
    if (position.horizontal === 'left') {
      // Arrow on the right side pointing left
      return position.position === 'below' 
        ? 'top-0 right-0 transform translate-x-full -translate-y-full'
        : 'bottom-0 right-0 transform translate-x-full translate-y-full';
    } else if (position.horizontal === 'right') {
      // Arrow on the left side pointing right
      return position.position === 'below'
        ? 'top-0 left-0 transform -translate-x-full -translate-y-full'
        : 'bottom-0 left-0 transform -translate-x-full translate-y-full';
    } else {
      // Arrow centered (default)
      return position.position === 'below'
        ? 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full'
        : 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full';
    }
  };

  const getArrowDirection = () => {
    if (position.horizontal === 'left') {
      // Arrow pointing right
      return position.position === 'below'
        ? 'border-t-6 border-b-6 border-l-6 border-transparent border-l-white/95'
        : 'border-t-6 border-b-6 border-l-6 border-transparent border-l-white/95';
    } else if (position.horizontal === 'right') {
      // Arrow pointing left
      return position.position === 'below'
        ? 'border-t-6 border-b-6 border-r-6 border-transparent border-r-white/95'
        : 'border-t-6 border-b-6 border-r-6 border-transparent border-r-white/95';
    } else {
      // Arrow pointing up or down (default)
      return position.position === 'below'
        ? 'border-l-6 border-r-6 border-b-6 border-transparent border-b-white/95'
        : 'border-l-6 border-r-6 border-t-6 border-transparent border-t-white/95';
    }
  };

  return (
    <div
      className={`fixed z-50 pointer-events-none ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: getTransform()
      }}
    >
      <Card className="w-64 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-1.5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] font-semibold text-gray-800 flex items-center gap-1">
              {getPointTypeIcon(point.properties?.type)}
              {point.properties?.name || `Point ${point.id}`}
            </CardTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors pointer-events-auto text-[10px]"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-2">
          {/* Location Information */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-gray-600">
              <MapPin className="h-2.5 w-2.5" />
              <span className="font-medium">Location</span>
            </div>
            <div className="ml-3 space-y-0.5 text-[10px]">
              <div>Lat: {formatCoordinate(point.coordinates[1], 'lat')}</div>
              <div>Lon: {formatCoordinate(point.coordinates[0], 'lon')}</div>
            </div>
          </div>

          {/* Point Type */}
          {point.properties?.type && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[10px] text-gray-600">
                <Tag className="h-2.5 w-2.5" />
                <span className="font-medium">Type</span>
              </div>
              <div className="ml-3">
                <Badge 
                  variant="outline" 
                  className={`${getPointTypeColor(point.properties.type)} capitalize text-[10px] px-1.5 py-0.5`}
                >
                  {point.properties.type}
                </Badge>
              </div>
            </div>
          )}

          {/* Additional Properties */}
          {point.properties && Object.keys(point.properties).length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[10px] text-gray-600">
                <User className="h-2.5 w-2.5" />
                <span className="font-medium">Details</span>
              </div>
              <div className="ml-3 space-y-0.5">
                {Object.entries(point.properties)
                  .filter(([key]) => !['name', 'type'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between text-[10px]">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="font-medium text-gray-800">
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ID Information */}
          <div className="pt-1 border-t border-gray-200">
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Calendar className="h-2.5 w-2.5" />
              <span>ID: {point.id}</span>
            </div>
          </div>
        </CardContent>

        {/* Arrow pointing to point */}
        <div className={`absolute ${getArrowPosition()}`}>
          <div className={`w-0 h-0 ${getArrowDirection()}`}></div>
        </div>
      </Card>
    </div>
  );
};

// Compact version for mobile devices
export const CompactPointDetailPopup: React.FC<PointDetailPopupProps> = ({
  point,
  position,
  visible,
  onClose,
  className = ''
}) => {
  if (!visible) return null;

  const getPointTypeIcon = (type?: string) => {
    // Return a simple circle icon for all types
    return <Circle className="h-3 w-3 text-gray-600" />;
  };

  const getTransform = () => {
    let xTransform = '-50%';
    let yTransform = position.position === 'below' ? '0%' : '-100%';
    
    // Adjust horizontal positioning
    if (position.horizontal === 'left') {
      xTransform = '0%';
    } else if (position.horizontal === 'right') {
      xTransform = '-100%';
    }
    
    return `translate(${xTransform}, ${yTransform})`;
  };

  const getArrowPosition = () => {
    if (position.horizontal === 'left') {
      // Arrow on the right side pointing left
      return position.position === 'below' 
        ? 'top-0 right-0 transform translate-x-full -translate-y-full'
        : 'bottom-0 right-0 transform translate-x-full translate-y-full';
    } else if (position.horizontal === 'right') {
      // Arrow on the left side pointing right
      return position.position === 'below'
        ? 'top-0 left-0 transform -translate-x-full -translate-y-full'
        : 'bottom-0 left-0 transform -translate-x-full translate-y-full';
    } else {
      // Arrow centered (default)
      return position.position === 'below'
        ? 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full'
        : 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full';
    }
  };

  const getArrowDirection = () => {
    if (position.horizontal === 'left') {
      // Arrow pointing right
      return position.position === 'below'
        ? 'border-t-4 border-b-4 border-l-4 border-transparent border-l-white/95'
        : 'border-t-4 border-b-4 border-l-4 border-transparent border-l-white/95';
    } else if (position.horizontal === 'right') {
      // Arrow pointing left
      return position.position === 'below'
        ? 'border-t-4 border-b-4 border-r-4 border-transparent border-r-white/95'
        : 'border-t-4 border-b-4 border-r-4 border-transparent border-r-white/95';
    } else {
      // Arrow pointing up or down (default)
      return position.position === 'below'
        ? 'border-l-4 border-r-4 border-b-4 border-transparent border-b-white/95'
        : 'border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95';
    }
  };

  return (
    <div
      className={`fixed z-50 pointer-events-none ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: getTransform()
      }}
    >
      <Card className="w-48 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] font-semibold text-gray-800 flex items-center gap-1">
              {getPointTypeIcon(point.properties?.type)}
              {point.properties?.name || `Point ${point.id}`}
            </CardTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors pointer-events-auto text-[10px]"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-1">
          <div className="text-[10px] text-gray-600">
            <div>Lat: {point.coordinates[1].toFixed(4)}°</div>
            <div>Lon: {point.coordinates[0].toFixed(4)}°</div>
          </div>
          
          {point.properties?.type && (
            <div className="text-[10px]">
              <span className="text-gray-600">Type: </span>
              <span className="font-medium capitalize">{point.properties.type}</span>
            </div>
          )}

          {point.properties?.value && (
            <div className="text-[10px]">
              <span className="text-gray-600">Value: </span>
              <span className="font-medium">{point.properties.value.toLocaleString()}</span>
            </div>
          )}
        </CardContent>

        {/* Arrow pointing to point */}
        <div className={`absolute ${getArrowPosition()}`}>
          <div className={`w-0 h-0 ${getArrowDirection()}`}></div>
        </div>
      </Card>
    </div>
  );
};
