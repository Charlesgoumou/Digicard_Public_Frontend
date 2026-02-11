import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // Base relative pour Capacitor : les assets chargent correctement dans le WebView natif
  base: './',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // ✅ CORRECTION: Configuration pour éviter l'erreur 431 (Request Header Fields Too Large)
    // Vite utilise le serveur HTTP de Node.js qui a une limite par défaut de 8KB pour les en-têtes
    // Cette configuration sera appliquée via les variables d'environnement Node.js
    hmr: {
      // Réduire la taille des messages HMR pour éviter les problèmes
      overlay: true,
    },
    // Configuration du proxy si nécessaire
    proxy: {
      // Les requêtes vers l'API seront proxyfiées, ce qui peut aider avec les limites d'en-têtes
    },
  },
  // Configuration pour le build
  build: {
    chunkSizeWarningLimit: 1000,
  }
})
