var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// vite.config.ts
import { defineConfig, loadEnv } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = parseInt(env.PORT || "3000");
  const host = env.HOST || "localhost";
  const isPortAvailable = (port2) => {
    try {
      __require("net").createServer().listen(port2).close();
      return true;
    } catch (e) {
      return false;
    }
  };
  const availablePort = isPortAvailable(port) ? port : 3001;
  return {
    base: "/",
    plugins: [react()],
    server: {
      port: availablePort,
      host: true,
      // Listen on all network interfaces
      strictPort: true,
      // Exit if port is already in use
      open: true,
      // Open browser on server start
      hmr: {
        protocol: "ws",
        host,
        port: availablePort
      },
      proxy: {
        // Proxy API requests to the Express server
        "/api": {
          target: "http://127.0.0.1:8009",
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path,
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.error("API Proxy error:", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log("Proxying API Request:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log("API Response Status:", proxyRes.statusCode, req.url);
            });
          }
        }
      }
    },
    preview: {
      port: availablePort,
      host: true,
      strictPort: true
    },
    optimizeDeps: {
      include: ["lucide-react", "jspdf"],
      exclude: []
    },
    build: {
      rollupOptions: {
        external: []
      },
      commonjsOptions: {
        include: [/node_modules/]
      },
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true
    },
    define: {
      "process.env": {}
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBjcmVhdGVQcm94eU1pZGRsZXdhcmUgfSBmcm9tICdodHRwLXByb3h5LW1pZGRsZXdhcmUnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICAvLyBMb2FkIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgXG4gIC8vIFVzZSBlbnZpcm9ubWVudCB2YXJpYWJsZSBmb3IgcG9ydCBvciBkZWZhdWx0IHRvIDMwMDBcbiAgY29uc3QgcG9ydCA9IHBhcnNlSW50KGVudi5QT1JUIHx8ICczMDAwJyk7XG4gIGNvbnN0IGhvc3QgPSBlbnYuSE9TVCB8fCAnbG9jYWxob3N0JztcbiAgXG4gIC8vIENoZWNrIGlmIHBvcnQgaXMgYXZhaWxhYmxlLCBpZiBub3QsIHVzZSBhIGZhbGxiYWNrXG4gIGNvbnN0IGlzUG9ydEF2YWlsYWJsZSA9IChwb3J0OiBudW1iZXIpID0+IHtcbiAgICB0cnkge1xuICAgICAgcmVxdWlyZSgnbmV0JykuY3JlYXRlU2VydmVyKCkubGlzdGVuKHBvcnQpLmNsb3NlKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuICBcbiAgY29uc3QgYXZhaWxhYmxlUG9ydCA9IGlzUG9ydEF2YWlsYWJsZShwb3J0KSA/IHBvcnQgOiAzMDAxO1xuICBcbiAgcmV0dXJuIHtcbiAgICBiYXNlOiAnLycsXG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogYXZhaWxhYmxlUG9ydCxcbiAgICAgIGhvc3Q6IHRydWUsIC8vIExpc3RlbiBvbiBhbGwgbmV0d29yayBpbnRlcmZhY2VzXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLCAvLyBFeGl0IGlmIHBvcnQgaXMgYWxyZWFkeSBpbiB1c2VcbiAgICAgIG9wZW46IHRydWUsIC8vIE9wZW4gYnJvd3NlciBvbiBzZXJ2ZXIgc3RhcnRcbiAgICAgIGhtcjoge1xuICAgICAgICBwcm90b2NvbDogJ3dzJyxcbiAgICAgICAgaG9zdDogaG9zdCxcbiAgICAgICAgcG9ydDogYXZhaWxhYmxlUG9ydCxcbiAgICAgIH0sXG4gICAgICBwcm94eToge1xuICAgICAgICAvLyBQcm94eSBBUEkgcmVxdWVzdHMgdG8gdGhlIEV4cHJlc3Mgc2VydmVyXG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwOScsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgICAgd3M6IHRydWUsXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgsXG4gICAgICAgICAgY29uZmlndXJlOiAocHJveHksIF9vcHRpb25zKSA9PiB7XG4gICAgICAgICAgICBwcm94eS5vbignZXJyb3InLCAoZXJyLCBfcmVxLCBfcmVzKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0FQSSBQcm94eSBlcnJvcjonLCBlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcm94eS5vbigncHJveHlSZXEnLCAocHJveHlSZXEsIHJlcSwgX3JlcykgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUHJveHlpbmcgQVBJIFJlcXVlc3Q6JywgcmVxLm1ldGhvZCwgcmVxLnVybCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcycsIChwcm94eVJlcywgcmVxLCBfcmVzKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBUEkgUmVzcG9uc2UgU3RhdHVzOicsIHByb3h5UmVzLnN0YXR1c0NvZGUsIHJlcS51cmwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBwcmV2aWV3OiB7XG4gICAgICBwb3J0OiBhdmFpbGFibGVQb3J0LFxuICAgICAgaG9zdDogdHJ1ZSxcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFsnbHVjaWRlLXJlYWN0JywgJ2pzcGRmJ10sXG4gICAgICBleGNsdWRlOiBbXSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIGV4dGVybmFsOiBbXSxcbiAgICAgIH0sXG4gICAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgICAgaW5jbHVkZTogWy9ub2RlX21vZHVsZXMvXSxcbiAgICAgIH0sXG4gICAgICBvdXREaXI6ICdkaXN0JyxcbiAgICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXG4gICAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgJ3Byb2Nlc3MuZW52Jzoge31cbiAgICB9XG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7O0FBQXlOLFNBQVMsY0FBYyxlQUFlO0FBQy9QLE9BQU8sV0FBVztBQUlsQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUV4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFHM0MsUUFBTSxPQUFPLFNBQVMsSUFBSSxRQUFRLE1BQU07QUFDeEMsUUFBTSxPQUFPLElBQUksUUFBUTtBQUd6QixRQUFNLGtCQUFrQixDQUFDQSxVQUFpQjtBQUN4QyxRQUFJO0FBQ0YsZ0JBQVEsS0FBSyxFQUFFLGFBQWEsRUFBRSxPQUFPQSxLQUFJLEVBQUUsTUFBTTtBQUNqRCxhQUFPO0FBQUEsSUFDVCxTQUFTLEdBQUc7QUFDVixhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFFQSxRQUFNLGdCQUFnQixnQkFBZ0IsSUFBSSxJQUFJLE9BQU87QUFFckQsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLElBQ2pCLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQTtBQUFBLE1BQ04sWUFBWTtBQUFBO0FBQUEsTUFDWixNQUFNO0FBQUE7QUFBQSxNQUNOLEtBQUs7QUFBQSxRQUNILFVBQVU7QUFBQSxRQUNWO0FBQUEsUUFDQSxNQUFNO0FBQUEsTUFDUjtBQUFBLE1BQ0EsT0FBTztBQUFBO0FBQUEsUUFFTCxRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxRQUFRO0FBQUEsVUFDUixJQUFJO0FBQUEsVUFDSixTQUFTLENBQUMsU0FBUztBQUFBLFVBQ25CLFdBQVcsQ0FBQyxPQUFPLGFBQWE7QUFDOUIsa0JBQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxNQUFNLFNBQVM7QUFDckMsc0JBQVEsTUFBTSxvQkFBb0IsR0FBRztBQUFBLFlBQ3ZDLENBQUM7QUFDRCxrQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLEtBQUssU0FBUztBQUM1QyxzQkFBUSxJQUFJLHlCQUF5QixJQUFJLFFBQVEsSUFBSSxHQUFHO0FBQUEsWUFDMUQsQ0FBQztBQUNELGtCQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsS0FBSyxTQUFTO0FBQzVDLHNCQUFRLElBQUksd0JBQXdCLFNBQVMsWUFBWSxJQUFJLEdBQUc7QUFBQSxZQUNsRSxDQUFDO0FBQUEsVUFDSDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLElBQ2Q7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxnQkFBZ0IsT0FBTztBQUFBLE1BQ2pDLFNBQVMsQ0FBQztBQUFBLElBQ1o7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLGVBQWU7QUFBQSxRQUNiLFVBQVUsQ0FBQztBQUFBLE1BQ2I7QUFBQSxNQUNBLGlCQUFpQjtBQUFBLFFBQ2YsU0FBUyxDQUFDLGNBQWM7QUFBQSxNQUMxQjtBQUFBLE1BQ0EsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsYUFBYTtBQUFBLElBQ2Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLGVBQWUsQ0FBQztBQUFBLElBQ2xCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBvcnQiXQp9Cg==
