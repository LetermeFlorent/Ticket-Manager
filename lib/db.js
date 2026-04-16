import initSqlJs from 'sql.js'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'

// Structure minimale de la table tickets
const schema = `
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`

// Prépare la base SQLite locale
export async function createStore(file) {
  // Crée le dossier data si besoin
  mkdirSync(dirname(file), { recursive: true })
  // Charge la librairie SQLite en mémoire
  const SQL = await initSqlJs()
  // Ouvre la base existante ou crée une base vide
  const db = existsSync(file) ? new SQL.Database(readFileSync(file)) : new SQL.Database()
  // Sauvegarde toute la base dans le fichier local
  const save = () => writeFileSync(file, Buffer.from(db.export()))
  // Applique le schéma au démarrage
  db.run(schema)
  // Force une sauvegarde initiale
  save()
  return { db, save }
}
