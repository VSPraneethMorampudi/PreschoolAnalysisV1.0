# Point Hover Functionality for Geoportal Dashboard

This document describes the hover functionality implemented for individual points in the clustering system, allowing users to see detailed information when hovering over points.

## Overview

The hover system provides rich, contextual information about individual points when users hover over them on the map. It includes smart positioning, smooth animations, and detailed property display.

## Components

### 1. PointDetailPopup (`src/components/PointDetailPopup.tsx`)

A comprehensive popup component that displays detailed information about individual points.

**Props:**
- `point: ClusterPoint` - The point data to display
- `position: { x: number; y: number }` - Screen coordinates for popup positioning
- `visible: boolean` - Whether the popup is visible
- `onClose: () => void` - Callback to close the popup
- `className?: string` - Additional CSS classes

**Features:**
- **Rich Information Display**: Shows coordinates, type, properties, and metadata
- **Type-Specific Icons**: Different emojis for different point types (mining, agriculture, etc.)
- **Color-Coded Badges**: Visual indicators for point types
- **Responsive Design**: Full and compact versions for different screen sizes
- **Smart Formatting**: Proper coordinate formatting with direction indicators
- **Property Display**: Shows all available properties in an organized layout

**Components:**
- `PointDetailPopup` - Full-featured popup for desktop
- `CompactPointDetailPopup` - Smaller version for mobile devices

### 2. usePointHover Hook (`src/hooks/usePointHover.tsx`)

A custom React hook that manages hover state and positioning logic.

**Returns:**
- `hoverState: HoverState` - Current hover state (point, position, visibility)
- `showHoverPopup: (point, pixel) => void` - Function to show hover popup
- `hideHoverPopup: () => void` - Function to hide hover popup
- `clearHoverPopup: () => void` - Function to completely clear hover state

**Features:**
- **Smart Positioning**: Calculates optimal popup position to avoid screen edges
- **Debounced Hiding**: Prevents flickering when moving between points
- **Viewport Awareness**: Adjusts position based on available screen space
- **Memory Management**: Proper cleanup of timeouts and event listeners

### 3. ClusterHoverHandler (`src/components/ClusterHoverHandler.tsx`)

A component that handles mouse interactions on the map and triggers hover events.

**Props:**
- `map: Map | null` - The OpenLayers map instance
- `onPointHover: (point, pixel) => void` - Callback when hovering over a point
- `onPointLeave: () => void` - Callback when leaving a point

**Features:**
- **Map Event Handling**: Listens for pointer move and leave events
- **Feature Detection**: Identifies clusters and individual points under cursor
- **Representative Point Selection**: For multi-point clusters, shows info for the first point
- **Debounced Interactions**: Prevents excessive hover events

## Integration

### MapContainer Integration

The hover functionality is fully integrated into the main `MapContainer` component:

```typescript
// Hover functionality
const { hoverState, showHoverPopup, hideHoverPopup, clearHoverPopup } = usePointHover(map);

// In render:
<ClusterLayer 
  map={map} 
  points={clusterPoints} 
  clusterRadius={50}
  visible={true}
  onPointHover={showHoverPopup}
  onPointLeave={hideHoverPopup}
/>
<ClusterHoverHandler
  map={map}
  onPointHover={showHoverPopup}
  onPointLeave={hideHoverPopup}
/>

<PointDetailPopup
  point={hoverState.point!}
  position={hoverState.position}
  visible={hoverState.visible}
  onClose={clearHoverPopup}
/>
```

## Sample Data Enhancement

The `ClusterDemo` component now generates more realistic sample data with:

### Point Types
- **Mining**: Iron Ore Mine, Coal Mine, Bauxite Mine, etc.
- **Agriculture**: Rice Field, Wheat Farm, Cotton Field, etc.
- **Forest**: Teak Forest, Sal Forest, Bamboo Grove, etc.
- **Water**: River, Lake, Pond, Reservoir, etc.
- **Urban**: City Center, Industrial Area, Residential Zone, etc.

### Properties
Each point type includes relevant properties:

**Mining Points:**
- `mineral`: Type of mineral (Iron, Coal, Bauxite, etc.)
- `production`: Production in tons
- `area`: Area in hectares
- `status`: Active/Inactive status

**Agriculture Points:**
- `crop`: Type of crop (Rice, Wheat, Cotton, etc.)
- `yield`: Yield in tons/hectare
- `area`: Area in hectares
- `status`: Active/Inactive status

**Forest Points:**
- `treeSpecies`: Tree species (Teak, Sal, Bamboo, etc.)
- `coverage`: Coverage percentage
- `area`: Area in hectares
- `status`: Active/Inactive status

**Water Points:**
- `depth`: Depth in meters
- `quality`: Water quality (Excellent, Good, Fair, Poor)
- `area`: Area in hectares
- `status`: Active/Inactive status

**Urban Points:**
- `population`: Population count
- `infrastructure`: Infrastructure level (High, Medium, Low)
- `area`: Area in hectares
- `status`: Active/Inactive status

## Visual Design

### Popup Styling
- **Background**: Semi-transparent white with backdrop blur
- **Shadow**: Large shadow for depth
- **Border**: No border for clean look
- **Typography**: Clear hierarchy with different font weights
- **Spacing**: Consistent spacing between elements

### Color Coding
- **Mining**: Orange theme (`bg-orange-100`, `text-orange-800`)
- **Agriculture**: Green theme (`bg-green-100`, `text-green-800`)
- **Forest**: Emerald theme (`bg-emerald-100`, `text-emerald-800`)
- **Water**: Blue theme (`bg-blue-100`, `text-blue-800`)
- **Urban**: Gray theme (`bg-gray-100`, `text-gray-800`)

### Icons
- **Mining**: ⛏️
- **Agriculture**: 🌾
- **Forest**: 🌲
- **Water**: 💧
- **Urban**: 🏢
- **Default**: 📍

## Positioning Logic

The popup positioning system ensures optimal visibility:

1. **Initial Position**: Places popup above the hovered point
2. **Horizontal Adjustment**: Moves popup left/right to stay within viewport
3. **Vertical Adjustment**: Flips popup below point if not enough space above
4. **Edge Detection**: Maintains minimum margins from screen edges
5. **Arrow Indicator**: Points down to the hovered location

## Performance Considerations

- **Debounced Events**: Prevents excessive hover state changes
- **Efficient Positioning**: Calculates position only when needed
- **Memory Management**: Proper cleanup of timeouts and listeners
- **Conditional Rendering**: Only renders popup when visible
- **Optimized Re-renders**: Minimal state updates

## Usage Examples

### Basic Hover Implementation

```typescript
import { usePointHover } from '@/hooks/usePointHover';
import { PointDetailPopup } from '@/components/PointDetailPopup';

const MyMapComponent = () => {
  const { hoverState, showHoverPopup, hideHoverPopup, clearHoverPopup } = usePointHover(map);

  return (
    <div>
      {/* Map and other components */}
      <PointDetailPopup
        point={hoverState.point!}
        position={hoverState.position}
        visible={hoverState.visible}
        onClose={clearHoverPopup}
      />
    </div>
  );
};
```

### Custom Point Data

```typescript
const customPoints: ClusterPoint[] = [
  {
    id: 'custom-1',
    coordinates: [82.1409, 21.2787],
    properties: {
      name: 'Custom Mining Site',
      type: 'mining',
      mineral: 'Iron Ore',
      production: 5000,
      area: 100,
      status: 'active',
      created: '2023-01-15'
    }
  }
];
```

## Browser Support

- Modern browsers with ES6+ support
- CSS backdrop-filter support for blur effects
- Touch devices with hover simulation

## Accessibility

- **Keyboard Navigation**: Popup can be closed with Escape key
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast**: Good contrast ratios for text readability
- **Focus Management**: Proper focus handling when popup opens/closes

## Future Enhancements

Potential improvements for the hover system:

1. **Custom Popup Templates**: Allow custom popup layouts per point type
2. **Animation Transitions**: Smooth fade-in/out animations
3. **Click Actions**: Add click handlers for detailed views
4. **Multi-Point Clusters**: Show aggregated data for cluster popups
5. **Export Functionality**: Export hovered point data
6. **Custom Styling**: Theme customization options
7. **Real-time Updates**: Live data updates in popups
8. **Mobile Optimizations**: Touch-friendly interactions
9. **Accessibility Improvements**: Enhanced keyboard navigation
10. **Performance Optimizations**: Virtual scrolling for large datasets



