// ✅ CORRECTION: Serveur HTTP personnalisé pour Vite avec limite d'en-têtes augmentée
// Ce fichier remplace le serveur par défaut de Vite pour éviter l'erreur 431

import { createServer as createViteServer } from 'vite'
import http from 'http'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function createServer() {
  // Charger la configuration Vite
  const viteConfigPath = resolve(__dirname, 'vite.config.js')
  
  // Créer le serveur Vite en mode middleware
  const vite = await createViteServer({
    configFile: viteConfigPath,
    server: {
      middlewareMode: true,
    },
    appType: 'spa',
  })

  // Créer un serveur HTTP avec limite d'en-têtes augmentée
  // maxHeaderSize est en octets (32768 = 32KB)
  const server = http.createServer({
    maxHeaderSize: 32768, // 32KB au lieu de 8KB par défaut
  }, async (req, res) => {
    // Utiliser le middleware Vite pour gérer les requêtes
    vite.middlewares(req, res, () => {
      // Si Vite ne gère pas la requête, retourner 404
      res.statusCode = 404
      res.end('Not Found')
    })
  })

  return { server, vite }
}

createServer().then(({ server }) => {
  const port = process.env.PORT || 5173 // Port pour Frontend Public
  // ✅ CORRECTION: Détecter si on veut écouter sur toutes les interfaces
  // Sur Windows, utiliser '0.0.0.0' pour permettre l'accès depuis le réseau
  const host = process.env.HOST || process.argv.includes('--host') ? '0.0.0.0' : 'localhost'

  server.listen(port, host, () => {
    console.log(`\n✅ Serveur Vite démarré avec limite d'en-têtes augmentée (32KB)`)
    console.log(`   Local:   http://localhost:${port}/`)
    if (host === '0.0.0.0') {
      console.log(`   Network: http://0.0.0.0:${port}/`)
      console.log(`   Accessible depuis le réseau local`)
    }
    console.log(`\n   Limite d'en-têtes HTTP: 32KB (au lieu de 8KB par défaut)\n`)
  })
}).catch((err) => {
  console.error('❌ Erreur lors du démarrage du serveur:', err)
  console.error('\n💡 Essayez de redémarrer le serveur avec: npm run dev\n')
  process.exit(1)
})

