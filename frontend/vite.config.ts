import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configure Vite dev server with React plugin and FastAPI proxy
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});

