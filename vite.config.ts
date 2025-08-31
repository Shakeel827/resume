import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createProxyMiddleware } from 'http-proxy-middleware';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  // Use environment variable for port or default to 3000
  const port = parseInt(env.PORT || '3000');
  const host = env.HOST || 'localhost';
  
  // Check if port is available, if not, use a fallback
  const isPortAvailable = (port: number) => {
    try {
      require('net').createServer().listen(port).close();
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const availablePort = isPortAvailable(port) ? port : 3001;
  
  return {
    base: '/',
    plugins: [react()],
    server: {
      port: availablePort,
      host: true, // Listen on all network interfaces
      strictPort: true, // Exit if port is already in use
      open: true, // Open browser on server start
      hmr: {
        protocol: 'ws',
        host: host,
        port: availablePort,
      },
      proxy: {
        // Proxy API requests to the Express server
        '/api': {
          target: 'http://localhost:3002',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.error('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('API Request:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('API Response:', proxyRes.statusCode, req.url);
            });
          }
        }
      }
    },
    preview: {
      port: availablePort,
      host: true,
      strictPort: true,
    },
    optimizeDeps: {
      include: ['lucide-react', 'jspdf'],
      exclude: [],
    },
    build: {
      rollupOptions: {
        external: [],
      },
      commonjsOptions: {
        include: [/node_modules/],
      },
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
    },
    define: {
      'process.env': {}
    }
  };
});
