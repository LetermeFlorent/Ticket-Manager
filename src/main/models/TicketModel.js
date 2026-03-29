/**
 * TicketModel.js
 * Accès direct à la base de données — CRUD tickets
 */
import { getDb, saveDb } from '../database'

const TicketModel = {
  findAll(filters = {}) {
    let query = 'SELECT * FROM tickets WHERE 1=1'
    const params = []

    if (filters.status && filters.status !== 'Tous') {
      query += ' AND status = ?'
      params.push(filters.status)
    }
    if (filters.priority && filters.priority !== 'Toutes') {
      query += ' AND priority = ?'
      params.push(filters.priority)
    }

    query += ' ORDER BY created_at DESC'
    const stmt = getDb().prepare(query)
    if (params.length) stmt.bind(params)

    const results = []
    while (stmt.step()) results.push(stmt.getAsObject())
    stmt.free()
    return results
  },

  findById(id) {
    const stmt = getDb().prepare('SELECT * FROM tickets WHERE id = ?')
    stmt.bind([id])
    const result = stmt.step() ? stmt.getAsObject() : null
    stmt.free()
    return result
  },

  create(data) {
    const now = new Date().toISOString()
    getDb().run(`
      INSERT INTO tickets (title, description, type, priority, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [data.title.trim(), data.description || '', data.type, data.priority, data.status, now, now])

    const lastId = getDb().exec('SELECT last_insert_rowid()')[0].values[0][0]
    saveDb()
    return TicketModel.findById(lastId)
  },

  update(id, data) {
    const now = new Date().toISOString()
    getDb().run(`
      UPDATE tickets
      SET title = ?, description = ?, type = ?, priority = ?, status = ?, updated_at = ?
      WHERE id = ?
    `, [data.title.trim(), data.description || '', data.type, data.priority, data.status, now, id])
    saveDb()
    return TicketModel.findById(id)
  },

  delete(id) {
    getDb().run('DELETE FROM tickets WHERE id = ?', [id])
    saveDb()
  }
}

export default TicketModel
