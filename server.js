import express from 'express'
import cors from 'cors'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { createStore } from './lib/db.js'
import { createTicketApi } from './lib/tickets.js'

const root = dirname(fileURLToPath(import.meta.url))
const dataPath = '/data'

// Vérifie qu'un id de route est bien un entier positif
function validId(id) {
  return Number.isInteger(+id) && +id > 0
}

// Réponse simple si l'id est invalide
function checkId(req, res, next) {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, error: 'Id invalide.' })
  next()
}

export async function createServer() {
  const app = express()
  const store = await createStore(process.env.TICKET_MANAGER_DB || join(root, 'data', 'tickets.db'))
  const api = createTicketApi(store)

  // CORS gardé simple pour le contexte local / BTS
  app.use(cors())
  // Evite les corps JSON trop volumineux
  app.use(express.json({ limit: '10kb' }))
  // Bloque l'accès direct au fichier de base
  app.use(dataPath, (_req, res) => res.status(403).json({ success: false, error: 'Acces refuse.' }))
  app.use(express.static(root))
  app.get('/api/meta', (_req, res) => res.json({ success: true, data: api.meta }))
  app.get('/api/tickets', (req, res) => res.json({ success: true, data: api.list(req.query) }))
  app.get('/api/tickets/:id', checkId, (req, res) => res.json(api.get(req.params.id)))
  app.post('/api/tickets', (req, res) => res.json(api.create(req.body)))
  app.delete('/api/tickets', (_req, res) => res.json(api.removeAll()))
  app.put('/api/tickets/:id', checkId, (req, res) => res.json(api.update(req.params.id, req.body)))
  app.delete('/api/tickets/:id', checkId, (req, res) => res.json(api.remove(req.params.id)))
  // Evite d'exposer des détails serveur en cas d'erreur
  app.use((error, _req, res, _next) => {
    console.error(error)
    res.status(500).json({ success: false, error: 'Erreur serveur.' })
  })

  const port = process.env.PORT || 3000
  const server = app.listen(port, () => console.log(`Server: http://localhost:${port}`))
  return { app, server, port }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await createServer()
}
