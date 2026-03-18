import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows external connections
  },
  preview: {
    host: '0.0.0.0', // required for Render
    port: process.env.PORT || 4173,
    allowedHosts: ['vc-c9mc.onrender.com'], // <--- add your Render host here
  },
});
