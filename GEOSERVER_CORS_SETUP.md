# GeoServer CORS Configuration Guide

This guide explains how to configure CORS (Cross-Origin Resource Sharing) in GeoServer to allow requests from your Preschool GeoPortal frontend.

## Problem
Your frontend (running on `http://localhost:5174`) cannot access GeoServer (running on `http://localhost:8080`) due to CORS policy restrictions.

## Solution 1: Configure GeoServer CORS Headers

### Step 1: Access GeoServer Admin Panel
1. Open your browser and go to `http://localhost:8080/geoserver`
2. Login with your GeoServer admin credentials (default: admin/geoserver)

### Step 2: Configure Global Settings
1. Click on **"Server Status"** in the left sidebar
2. Click on **"Settings"** tab
3. Scroll down to find **"CORS"** section
4. Configure the following settings:

```
Allowed Origins: *
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: *
Allow Credentials: false
Max Age: 3600
```

### Step 3: Alternative - Configure via web.xml
If the web interface doesn't have CORS settings, you can configure it directly in the web.xml file:

1. Navigate to your GeoServer installation directory
2. Go to `webapps/geoserver/WEB-INF/`
3. Open `web.xml` in a text editor
4. Add the following configuration before the closing `</web-app>` tag:

```xml
<!-- CORS Configuration -->
<filter>
    <filter-name>cors</filter-name>
    <filter-class>org.eclipse.jetty.servlets.CrossOriginFilter</filter-class>
    <init-param>
        <param-name>allowedOrigins</param-name>
        <param-value>*</param-value>
    </init-param>
    <init-param>
        <param-name>allowedMethods</param-name>
        <param-value>GET,POST,PUT,DELETE,OPTIONS,HEAD</param-value>
    </init-param>
    <init-param>
        <param-name>allowedHeaders</param-name>
        <param-value>*</param-value>
    </init-param>
    <init-param>
        <param-name>preflightMaxAge</param-name>
        <param-value>3600</param-value>
    </init-param>
</filter>

<filter-mapping>
    <filter-name>cors</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### Step 4: Restart GeoServer
After making changes, restart your GeoServer instance.

## Solution 2: Use Vite Proxy (Alternative)

If you cannot modify GeoServer CORS settings, you can use Vite's proxy feature to route requests through your development server.

### Step 1: Configure Vite Proxy
Add the following to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/geoserver': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/geoserver/, '/geoserver')
      }
    }
  }
})
```

### Step 2: Update WFS URLs
Update your WFS utility to use relative URLs:

```typescript
// In src/components/utils/wfs.ts
const getGeoServerBaseUrl = (): string => {
  // For development with proxy
  if (import.meta.env.DEV) {
    return '/geoserver';
  }
  
  // For production
  if (import.meta.env.VITE_GEOSERVER_BASE) {
    return import.meta.env.VITE_GEOSERVER_BASE;
  }
  
  return 'http://localhost:8080/geoserver';
};
```

## Solution 3: Browser CORS Disable (Development Only)

⚠️ **WARNING: Only for development, never use in production**

You can disable CORS in your browser for development:

### Chrome:
```bash
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security --disable-features=VizDisplayCompositor
```

### Firefox:
1. Type `about:config` in address bar
2. Search for `security.fileuri.strict_origin_policy`
3. Set it to `false`

## Testing the Fix

After implementing any of the above solutions:

1. Restart your development server
2. Open browser developer tools
3. Check the Network tab for successful WFS requests
4. Verify that map layers load without CORS errors

## Troubleshooting

### Common Issues:
1. **Still getting CORS errors**: Ensure GeoServer is restarted after configuration changes
2. **Proxy not working**: Check that the proxy path matches your WFS URLs
3. **Mixed content errors**: Ensure both frontend and GeoServer use the same protocol (HTTP/HTTPS)

### Debug Steps:
1. Check browser Network tab for actual request URLs
2. Verify GeoServer is accessible directly: `http://localhost:8080/geoserver/ows?service=WFS&version=1.0.0&request=GetCapabilities`
3. Test CORS with curl:
   ```bash
   curl -H "Origin: http://localhost:5174" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost:8080/geoserver/ch_dep_data/ows
   ```

## Production Considerations

For production deployment:
1. Configure specific allowed origins instead of using `*`
2. Use HTTPS for both frontend and GeoServer
3. Consider using a reverse proxy (nginx, Apache) to handle CORS
4. Implement proper authentication and authorization
