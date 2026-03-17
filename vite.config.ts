import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env': env
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true'
    },
    preview: {
      allowedHosts: ['vc-c9mc.onrender.com', 'localhost']
    },
    build: {
      chunkSizeWarningLimit: 1000 // increase limit to ignore warnings
    }
  };
});
