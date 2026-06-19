import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    proxy: {
      "/energy": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },
      "/store": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },
    },
  },
});