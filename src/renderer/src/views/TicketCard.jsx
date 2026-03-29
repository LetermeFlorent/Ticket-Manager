/**
 * TicketCard.jsx
 * Carte ticket — modes liste et grille (prop compact)
 */
import { PRIORITY_COLORS, TYPE_COLORS, STATUS_COLORS } from '../constants'
import styles from './TicketCard.module.css'

export default function TicketCard({ ticket, onView, onEdit, onDelete, compact = false }) {
  const { id, title, description, type, priority, status } = ticket

  if (compact) {
    return (
      <article className={styles.cardGrid} onClick={() => onView(ticket)}>
        <div className={styles.gridTop}>
          <span className={styles.id}>#{String(id).padStart(3, '0')}</span>
          <span className="badge" style={{ background: PRIORITY_COLORS[priority] }}>{priority}</span>
        </div>
        <p className={styles.gridTitle}>{title}</p>
        {description && <p className={styles.gridDesc}>{description}</p>}
        <div className={styles.gridFooter}>
          <span className="badge" style={{ background: TYPE_COLORS[type] }}>{type}</span>
          <span className="badge" style={{ background: STATUS_COLORS[status] }}>{status}</span>
        </div>
        <div className={styles.gridActions} onClick={e => e.stopPropagation()}>
          <button className={styles.btnEdit}   onClick={() => onEdit(ticket)}>✏️</button>
          <button className={styles.btnDelete} onClick={() => onDelete(ticket)}>🗑️</button>
        </div>
      </article>
    )
  }

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span className={styles.id}>#{String(id).padStart(3, '0')}</span>
        <span className="badge" style={{ background: TYPE_COLORS[type] }}>{type}</span>
        <span className="badge" style={{ background: PRIORITY_COLORS[priority] }}>{priority}</span>
        <span className="badge" style={{ background: STATUS_COLORS[status] }}>{status}</span>
      </div>
      <p className={styles.title}>{title}</p>
      <div className={styles.actions}>
        <button className={styles.btnView}   onClick={() => onView(ticket)}>Voir</button>
        <button className={styles.btnEdit2}  onClick={() => onEdit(ticket)}>Modifier</button>
        <button className={styles.btnDelete} onClick={() => onDelete(ticket)}>Supprimer</button>
      </div>
    </article>
  )
}
