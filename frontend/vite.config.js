import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// LipiSetu — Vite config
// PWA plugin handles manifest + service worker generation (Workbox under the hood).
// runtimeCaching for the script rule-table JSON (from Part 2) ensures transliteration
// keeps working with zero network connection, per the offline-mode requirement.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'fonts/*.woff2'],
      manifest: {
        name: 'LipiSetu — Script Bridge',
        short_name: 'LipiSetu',
        description: 'Read any Indian script in the one you know. Transliteration, not translation.',
        theme_color: '#1B1B2F',
        background_color: '#FAF6EE',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Cache-first for the app shell itself
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        runtimeCaching: [
          {
            // Part 2's rule-table JSON files — must be available offline
            urlPattern: /\/data\/script-rules\/.*\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'lipisetu-script-rules',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            // Tesseract.js trained data packs (Part 3) — large, cache aggressively once fetched
            urlPattern: /\/tessdata\/.*\.traineddata\.gz$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'lipisetu-tessdata',
              expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            // Part 3's OCR API — network-first since it needs fresh results, falls back gracefully
            urlPattern: /\/api\/ocr$/,
            handler: 'NetworkOnly'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      // Part 3's Express backend during local dev
      '/api': 'http://localhost:4000'
    }
  }
})
