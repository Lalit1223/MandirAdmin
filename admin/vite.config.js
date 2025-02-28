import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Bind to all network interfaces
    port: 5173, // Set development server port
    proxy: {
      "/api": {
        target: "https://oneconnectx.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
