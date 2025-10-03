import React from 'react';

interface ScaleBarProps {
  scale: { value: number; unit: string };
  className?: string;
  isMobile?: boolean;
}

export const ScaleBar: React.FC<ScaleBarProps> = ({ scale, className = '', isMobile = false }) => {
  // Calculate the width of the scale bar based on the scale value
  const getScaleBarWidth = () => {
    // Base width for 100px scale bar, adjust for mobile
    const baseWidth = isMobile ? 80 : 100;
    
    // Adjust width based on scale value for better visual representation
    if (scale.unit === 'km') {
      if (scale.value >= 1000) return baseWidth;
      if (scale.value >= 100) return baseWidth * 0.8;
      if (scale.value >= 10) return baseWidth * 0.6;
      return baseWidth * 0.4;
    } else if (scale.unit === 'm') {
      if (scale.value >= 1000) return baseWidth * 0.8;
      if (scale.value >= 100) return baseWidth * 0.6;
      return baseWidth * 0.4;
    } else {
      return baseWidth * 0.3;
    }
  };

  const barWidth = getScaleBarWidth();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center">
        <div 
          className="relative bg-gray-800 h-px"
          style={{ width: `${barWidth}px` }}
        >
          {/* Left tick mark */}
          <div className="absolute -top-1 left-0 w-px h-3 bg-gray-800"></div>
          {/* Right tick mark */}
          <div className="absolute -top-1 right-0 w-px h-3 bg-gray-800"></div>
          {/* Center tick mark for larger scales */}
          {scale.value >= 100 && (
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-px h-2 bg-gray-800"></div>
          )}
        </div>
        <span className={`ml-2 font-medium text-gray-700 ${isMobile ? 'text-[8px]' : 'text-[9px]'}`}>
          {scale.value} {scale.unit}
        </span>
      </div>
    </div>
  );
};
