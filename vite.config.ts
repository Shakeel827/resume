import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const isDev = mode === 'development';
  const isProduction = mode === 'production';

  return {
    base: command === 'build' ? './' : '/',
    plugins: [
      react({
        // Use the automatic JSX runtime
        jsxRuntime: 'automatic',
      })
    ],
    
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react',
        'jspdf',
        'framer-motion',
        'html2canvas'
      ],
      esbuildOptions: {
        // Enable esbuild's tree shaking
        treeShaking: true,
      },
    },

    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isDev,
      minify: isProduction ? 'esbuild' : false,
      cssMinify: isProduction,
      chunkSizeWarningLimit: 1000, // 1MB
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('framer-motion') || id.includes('jspdf') || id.includes('html2canvas')) {
                return 'vendor-ui';
              }
              return 'vendor';
            }
            return null;
          },
          // Optimize chunking
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
        },
      }
    },

    // Development server configuration
    server: {
      port: 3000,
      strictPort: true,
      open: '/index.html', // Open the index.html file on startup
      host: true, // Listen on all network interfaces
      hmr: {
        overlay: true,
      },
      // Enable filesystem caching for faster rebuilds
      fs: {
        strict: false,
      },
    },

    // Preview configuration
    preview: {
      port: 3000,
      strictPort: true,
      open: '/index.html', // Open the index.html file on startup
      host: true,
    },
    
    // CSS optimization
    css: {
      devSourcemap: isDev,
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': '/src', // Add path aliases for cleaner imports
      },
    },
  };
});
