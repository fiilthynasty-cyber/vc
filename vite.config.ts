import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["vc-c9mc.onrender.com"], // Add your Render URL
  },
});
