import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/geoserver": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/geoserver/, "/geoserver"),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("GeoServer proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Proxying request:", req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Received response:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
}));
