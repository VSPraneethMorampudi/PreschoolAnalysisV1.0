# Environment Setup Guide

This guide explains how to configure the environment variables for the Preschool GeoPortal application.

## Environment Variables

Create a `.env` file in the project root directory with the following variables:

```env
# GeoServer Configuration
# Primary GeoServer URL (Vite environment variable)
VITE_GEOSERVER_BASE=http://localhost:8080/geoserver

# Alternative GeoServer URL (Create React App compatibility)
REACT_APP_GEOSERVER_BASE=http://localhost:8080/geoserver

# Application Configuration
VITE_APP_TITLE=Preschool GeoPortal
VITE_APP_VERSION=1.0.0
```

## Configuration Examples

### Local Development
```env
VITE_GEOSERVER_BASE=http://localhost:8080/geoserver
```

### Production Server
```env
VITE_GEOSERVER_BASE=https://your-domain.com/geoserver
```

### Custom Port
```env
VITE_GEOSERVER_BASE=http://your-server-ip:8080/geoserver
```

### Different GeoServer Instance
```env
VITE_GEOSERVER_BASE=http://geoserver.your-domain.com:8080/geoserver
```

## Priority System

The application checks for GeoServer URL in this order:

1. **Vite environment variable**: `VITE_GEOSERVER_BASE`
2. **Create React App environment variable**: `REACT_APP_GEOSERVER_BASE`
3. **Global window override**: `window.__GEOSERVER_BASE__`
4. **Fallback default**: `http://localhost:8080/geoserver`

## Runtime Override

You can also override the GeoServer URL at runtime by setting:

```javascript
window.__GEOSERVER_BASE__ = 'http://your-custom-geoserver-url:8080/geoserver';
```

## Verification

To verify your configuration is working:

1. Check the browser console for any connection errors
2. Look for successful WFS requests in the Network tab
3. Verify that map layers load correctly
4. Check that the correct GeoServer URL is being used in network requests

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your GeoServer has CORS enabled
2. **Connection Refused**: Verify the URL and port are correct
3. **Layer Not Found**: Check that the workspace and layer names match
4. **Authentication Required**: Add authentication headers if needed

### Debug Mode:

Enable debug logging by running this in the browser console:
```javascript
localStorage.setItem('debug', 'true');
```

This will show detailed information about WFS requests and responses.
