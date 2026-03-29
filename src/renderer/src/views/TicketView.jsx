/**
 * TicketView.jsx
 * Vue détail d'un ticket en lecture seule
 */
import { PRIORITY_COLORS, TYPE_COLORS, STATUS_COLORS } from '../constants'
import styles from './TicketView.module.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function TicketView({ ticket, onClose }) {
  const { id, title, description, type, priority, status, created_at, updated_at } = ticket

  return (
    <div className={styles.view}>
      <h2 className={styles.title}>
        <span className={styles.id}>#{String(id).padStart(3, '0')}</span> {title}
      </h2>
      <hr className={styles.sep} />

      <div className={styles.badges}>
        <span className="badge" style={{ background: TYPE_COLORS[type] }}>{type}</span>
        <span className="badge" style={{ background: PRIORITY_COLORS[priority] }}>{priority}</span>
        <span className="badge" style={{ background: STATUS_COLORS[status] }}>{status}</span>
      </div>

      <div className={styles.meta}>
        <span>Créé le : {formatDate(created_at)}</span>
        <span>Modifié le : {formatDate(updated_at)}</span>
      </div>

      {description && (
        <div className={styles.desc}>
          <label>Description</label>
          <p>{description}</p>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.close} onClick={onClose}>Fermer</button>
      </div>
    </div>
  )
}
