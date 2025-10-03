# Chhattisgarh State Geo Portal - Implementation Plan

### Core Components (8 files max)
1. **src/pages/Index.tsx** - Main dashboard layout with 20/80 sidebar/map split
2. **src/components/Header.tsx** - Small header with Chhattisgarh branding and language toggle
3. **src/components/Sidebar.tsx** - Collapsible sidebar container (20% width)
4. **src/components/MultiSelectTreeDropdown.tsx** - Hierarchical layer selection component
5. **src/components/MapContainer.tsx** - OpenLayers map integration (80% width)
6. **src/components/MapControls.tsx** - Map navigation and tools
7. **src/lib/mapUtils.ts** - OpenLayers utilities and layer management
8. **src/lib/layerData.ts** - Chhattisgarh GIS layer hierarchy data

### Key Features
- Responsive 20/80 sidebar-to-map layout
- Collapsible sidebar with smooth animations
- Multi-select tree dropdown for Chhattisgarh GIS layers
- OpenLayers map with Chhattisgarh center (82.1409, 21.2787)
- Hindi/English language toggle
- Chhattisgarh green theme (#1a472a)
- Layer categories: Administrative, Land Records, Natural Resources, Infrastructure, Agriculture, Mining

### Technical Stack
- React + TypeScript
- Shadcn-ui components
- Tailwind CSS
- OpenLayers for mapping
- Zustand for state management

### Responsive Design
- Desktop: 20/80 sidebar/map split
- Tablet: 25/75 split
- Mobile: Overlay sidebar, full-width map