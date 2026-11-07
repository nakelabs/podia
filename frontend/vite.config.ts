import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configure Vite dev server with React plugin and proxy to the hosted Render backend
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://podia.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
