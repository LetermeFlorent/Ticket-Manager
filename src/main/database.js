/**
 * database.js
 * Connexion SQLite et initialisation du schéma
 */
import initSqlJs from 'sql.js'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'

let db

export function getDb() {
  return db
}

export async function initDatabase() {
  const SQL = await initSqlJs()
  const dbPath = join(app.getPath('userData'), 'issuehub.db')

  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT,
      type        TEXT    NOT NULL DEFAULT 'Bug',
      priority    TEXT    NOT NULL DEFAULT 'Moyenne',
      status      TEXT    NOT NULL DEFAULT 'Ouvert',
      created_at  TEXT    NOT NULL,
      updated_at  TEXT    NOT NULL
    )
  `)

  saveDb()
}

export function saveDb() {
  const data = db.export()
  const buffer = Buffer.from(data)
  const dbPath = join(app.getPath('userData'), 'issuehub.db')
  writeFileSync(dbPath, buffer)
}
