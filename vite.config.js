import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    fs: {
      strict: false,
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo192.png", "logo512.png"],
      manifest: {
        name: "AgriKart - Agricultural Equipment Marketplace",
        short_name: "AgriKart",
        description: "Agricultural Equipment Marketplace",
        theme_color: "#4CAF50",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "/logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "/logo512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
