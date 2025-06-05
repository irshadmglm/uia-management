import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'UIA ACADEMICS',
        short_name: 'UIA',
        description: "Manage administration, students, and teachers efficiently.",
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/UIA-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/UIA-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/UIA-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
