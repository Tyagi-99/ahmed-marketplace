import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiTarget = process.env.VITE_API_PROXY_TARGET ?? "http://localhost:9000";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 8000,
    proxy: {
      "/energy": {
        target: apiTarget,
        changeOrigin: true,
      },
      "/store": {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});