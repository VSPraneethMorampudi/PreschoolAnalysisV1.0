# GeoServer Configuration for Preschool GeoPortal

This document provides a comprehensive overview of the GeoServer configuration used in the Preschool GeoPortal application.

## Base URL Configuration

The GeoServer base URL is configured with the following priority system in `src/components/utils/wfs.ts`:

1. **Vite environment variable**: `VITE_GEOSERVER_BASE`
2. **Create React App environment variable**: `REACT_APP_GEOSERVER_BASE` (for compatibility)
3. **Global window override**: `window.__GEOSERVER_BASE__`
4. **Fallback default**: `http://localhost:8080/geoserver`

### Environment Variables

To configure the GeoServer URL, create a `.env` file in the project root:

```env
# For Vite (recommended)
VITE_GEOSERVER_BASE=http://your-geoserver-url:8080/geoserver

# For Create React App compatibility
REACT_APP_GEOSERVER_BASE=http://your-geoserver-url:8080/geoserver
```

## Workspace and Service Configuration

- **Workspace**: `ch_dep_data`
- **Service**: WFS (Web Feature Service)
- **Version**: 1.0.0
- **Output Format**: `application/json`

## Complete Layer Configuration

### 1. State Boundary Layer
- **Layer ID**: `state`
- **TypeName**: `ch_dep_data:cg_state_boundary`
- **Max Features**: 1
- **Style**: Black stroke (width: 3), light gray fill
- **Description**: Chhattisgarh state outline

### 2. District Boundary Layer
- **Layer ID**: `district`
- **TypeName**: `ch_dep_data:cg_district_boundary`
- **Max Features**: 50
- **Style**: Red stroke (#e53935), transparent fill
- **Description**: Administrative district boundaries

### 3. Village Boundary Layer
- **Layer ID**: `village`
- **TypeName**: `ch_dep_data:cg_village_boundary`
- **Style**: Blue stroke (#1e88e5), light blue fill
- **Description**: Village-level administrative boundaries

### 4. Anganwadi Centers Layer
- **Layer ID**: `anganwadi`
- **TypeName**: `ch_dep_data:cg_aganwadi`
- **Style**: Green dots (#43a047)
- **Description**: Educational centers with service coverage

### 5. Schools Layer
- **Layer ID**: `schools`
- **TypeName**: `ch_dep_data:cg_school`
- **CQL Filter**: `category_o='Primary'`
- **Style**: Blue dots (#2196f3)
- **Description**: Primary schools

### 6. Railway Layer
- **Layer ID**: `rail`
- **TypeName**: `ch_dep_data:cg_rail_line`
- **Max Features**: 100,000
- **Style**: Dark red stroke (#75120eff)
- **Description**: Railway lines

### 7. River Layer
- **Layer ID**: `river`
- **TypeName**: `ch_dep_data:cg_river_poly`
- **Max Features**: 100,000
- **Style**: Light blue stroke (#64c6d3ff)
- **Description**: River polygons

### 8. Road Layer
- **Layer ID**: `road`
- **TypeName**: `ch_dep_data:cg_nh_sh_road`
- **Max Features**: 100,000
- **Style**: Pink stroke (#e283ceff)
- **Description**: National Highway and State Highway roads

## WFS URL Construction

The WFS URLs are constructed using the pattern:
```
{baseUrl}/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName={typeName}&outputFormat=application/json&maxFeatures={maxFeatures}&cql_filter={filter}
```

### Example URLs (with default localhost):

**State Boundary:**
```
http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data:cg_state_boundary&outputFormat=application/json&maxFeatures=1
```

**District Boundary:**
```
http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data:cg_district_boundary&outputFormat=application/json&maxFeatures=50
```

**Village Boundary:**
```
http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data:cg_village_boundary&outputFormat=application/json
```

**Anganwadi Centers:**
```
http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data:cg_aganwadi&outputFormat=application/json
```

**Schools (Primary only):**
```
http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data:cg_school&outputFormat=application/json&cql_filter=category_o='Primary'
```

**Railway:**
```
http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data:cg_rail_line&outputFormat=application/json&maxFeatures=100000
```

**River:**
```
http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data:cg_river_poly&outputFormat=application/json&maxFeatures=100000
```

**Road:**
```
http://localhost:8080/geoserver/ch_dep_data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ch_dep_data:cg_nh_sh_road&outputFormat=application/json&maxFeatures=100000
```

## Implementation Files

### Core Files Updated:
1. **`src/components/utils/wfs.ts`** - WFS utility functions with environment variable support
2. **`src/lib/layerData.ts`** - Layer configuration with updated URLs and styling
3. **`src/lib/geoserverConfig.ts`** - New comprehensive GeoServer configuration

### Usage in Components:
- The WFS utility is used throughout the application for fetching GeoJSON data
- Layer configurations are imported from `layerData.ts` for the layer tree
- The new `geoserverConfig.ts` provides a centralized configuration system

## Error Handling

The WFS utility includes comprehensive error handling:
- Network connectivity issues are detected and handled gracefully
- User-friendly notifications are shown for connection problems
- Empty GeoJSON structures are returned to prevent application crashes
- Debounced error notifications prevent spam

## Testing the Configuration

To test if your GeoServer is properly configured:

1. Set the appropriate environment variable for your GeoServer URL
2. Start the application
3. Check the browser console for any connection errors
4. Verify that layers load correctly in the map interface

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure your GeoServer has CORS enabled for your domain
2. **Connection Refused**: Verify the GeoServer URL and port
3. **Layer Not Found**: Check that the workspace and layer names match exactly
4. **Authentication**: If required, add authentication headers to the WFS utility

### Debug Mode:
Enable debug logging by setting `localStorage.setItem('debug', 'true')` in the browser console to see detailed WFS request information.
