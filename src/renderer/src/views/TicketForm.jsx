/**
 * TicketForm.jsx
 * Formulaire création et édition de ticket
 */
import { useState } from 'react'
import { TYPES, PRIORITIES, STATUSES } from '../constants'
import styles from './TicketForm.module.css'

const DEFAULT = { title: '', description: '', type: 'Bug', priority: 'Moyenne', status: 'Ouvert' }

export default function TicketForm({ ticket, onSave, onCancel }) {
  const isEdit = !!ticket
  const [form, setForm] = useState(ticket ? {
    title: ticket.title,
    description: ticket.description || '',
    type: ticket.type,
    priority: ticket.priority,
    status: ticket.status
  } : DEFAULT)
  const [error, setError] = useState('')

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = isEdit
      ? await window.api.tickets.update(ticket.id, form)
      : await window.api.tickets.create(form)
    if (res.success) onSave()
    else setError(res.error)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>{isEdit ? 'Modifier le ticket' : 'Nouveau ticket'}</h2>

      <div className={styles.field}>
        <label>Titre *</label>
        <input
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Ex: Bouton de connexion cassé"
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={3}
          placeholder="Décris le problème ou la demande..."
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>Type *</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label>Priorité *</label>
          <select value={form.priority} onChange={e => set('priority', e.target.value)}>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label>Statut *</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={onCancel}>Annuler</button>
        <button type="submit" className={styles.submit}>Enregistrer</button>
      </div>
    </form>
  )
}
