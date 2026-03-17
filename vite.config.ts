import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react(), tailwindcss()],
    define: {
      "process.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL),
      "process.env.VITE_SUPABASE_KEY": JSON.stringify(env.VITE_SUPABASE_KEY)
    },
    preview: {
      allowedHosts: ["vc-c9mc.onrender.com"] // Replace with your Render frontend URL
    }
  };
});
