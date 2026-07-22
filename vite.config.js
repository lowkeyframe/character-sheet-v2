import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only endpoint: écrit directement src/data/me.json quand on clique sur
// "Exporter mes données", pour éviter le va-et-vient télécharger/déplacer le fichier.
// N'existe qu'en local (npm run dev) ; le site publié reste 100% statique.
function saveMeJsonPlugin() {
  return {
    name: 'save-me-json',
    configureServer(server) {
      server.middlewares.use('/api/save-me-json', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            const filePath = path.resolve(process.cwd(), 'src/data/me.json')
            fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: err.message }))
          }
        })
      })
    },
  }
}

// IMPORTANT: doit correspondre au nom du repo GitHub pour un déploiement GitHub Pages correct
export default defineConfig({
  base: '/character-sheet-claude/',
  plugins: [react(), saveMeJsonPlugin()],
})
