import { emptyTicket, values } from './values.js'

// Valeurs par défaut pour les filtres
const all = { status: 'Tous', priority: 'Toutes' }
// Réponse d'erreur simple
const fail = error => ({ success: false, error })
// Réponse de succès simple
const ok = data => ({ success: true, data })
// Nettoie les textes reçus
const text = value => String(value || '').trim()
// Vérifie qu'une valeur existe dans une liste
const valid = (set, value) => set.includes(value)
// Génère la date du moment
const stamp = () => new Date().toISOString()

export function createTicketApi(store) {
  const { db } = store
  // Lit une seule ligne d'un résultat SQL
  const row = stmt => (stmt.step() ? stmt.getAsObject() : null)
  // Retourne un ticket par son id
  const find = id => { const s = db.prepare('SELECT * FROM tickets WHERE id = ?'); s.bind([+id]); const r = row(s); s.free(); return r }
  // Liste les tickets avec filtres optionnels
  const list = filter => {
    const sql = ['SELECT * FROM tickets']
    const params = []
    if (filter.status && filter.status !== all.status) { sql.push('WHERE status = ?'); params.push(filter.status) }
    if (filter.priority && filter.priority !== all.priority) { sql.push(params.length ? 'AND priority = ?' : 'WHERE priority = ?'); params.push(filter.priority) }
    const s = db.prepare(`${sql.join(' ')} ORDER BY id DESC`)
    if (params.length) s.bind(params)
    const data = []
    while (s.step()) data.push(s.getAsObject())
    s.free()
    return data
  }
  // Vérifie les données reçues
  const check = (body = {}) => {
    const ticket = { ...emptyTicket, ...body, title: text(body.title), description: text(body.description) }
    if (!ticket.title) return [null, 'Titre requis']
    if (!valid(values.types, ticket.type)) return [null, 'Type invalide']
    if (!valid(values.priorities, ticket.priority)) return [null, 'Priorité invalide']
    if (!valid(values.statuses, ticket.status)) return [null, 'Statut invalide']
    return [ticket, '']
  }
  return {
    meta: { ...values, filters: all, emptyTicket },
    list,
    // Retourne un ticket unique
    get: id => { const ticket = find(id); return ticket ? ok(ticket) : fail('Ticket introuvable.') },
    // Crée un ticket
    create: body => {
      const [ticket, error] = check(body)
      if (error) return fail(error)
      const now = stamp()
      db.run('INSERT INTO tickets (title, description, type, priority, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [ticket.title, ticket.description, ticket.type, ticket.priority, ticket.status, now, now])
      const id = db.exec('SELECT last_insert_rowid() id')[0].values[0][0]
      store.save()
      return ok(find(id))
    },
    // Met à jour un ticket
    update: (id, body) => {
      if (!find(id)) return fail('Ticket introuvable.')
      const [ticket, error] = check(body)
      if (error) return fail(error)
      const now = stamp()
      db.run('UPDATE tickets SET title = ?, description = ?, type = ?, priority = ?, status = ?, updated_at = ? WHERE id = ?', [ticket.title, ticket.description, ticket.type, ticket.priority, ticket.status, now, +id])
      store.save()
      return ok(find(id))
    },
    // Supprime un ticket
    remove: id => {
      if (!find(id)) return fail('Ticket introuvable.')
      db.run('DELETE FROM tickets WHERE id = ?', [+id])
      store.save()
      return ok(true)
    },
    // Supprime tous les tickets
    removeAll: () => {
      db.run('DELETE FROM tickets')
      store.save()
      return ok(true)
    }
  }
}
