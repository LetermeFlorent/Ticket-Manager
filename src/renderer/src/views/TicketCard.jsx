/**
 * TicketCard.jsx
 * Carte ticket — modes liste et grille (prop compact)
 */
import { PRIORITY_COLORS, TYPE_COLORS, STATUS_COLORS } from '../constants'
import styles from './TicketCard.module.css'

const STATUS_ICONS = {
  'Ouvert':    { symbol: '',  title: 'Ouvert — cliquer pour passer En cours' },
  'En cours':  { symbol: '◐', title: 'En cours — cliquer pour passer Fermé' },
  'Fermé':     { symbol: '✓', title: 'Fermé — cliquer pour rouvrir' }
}

function StatusToggle({ status, onStatusChange, ticket }) {
  const { symbol, title } = STATUS_ICONS[status] || STATUS_ICONS['Ouvert']
  return (
    <button
      className={`${styles.statusToggle} ${styles[`status_${status.replace(' ', '_')}`]}`}
      title={title}
      onClick={(e) => { e.stopPropagation(); onStatusChange(ticket) }}
    >
      {symbol}
    </button>
  )
}

export default function TicketCard({ ticket, onView, onEdit, onDelete, onStatusChange, compact = false }) {
  const { id, title, description, type, priority, status } = ticket

  if (compact) {
    return (
      <article className={styles.cardGrid} onClick={() => onView(ticket)}>
        <div className={styles.gridTop}>
          <div className={styles.gridTopLeft}>
            <StatusToggle status={status} onStatusChange={onStatusChange} ticket={ticket} />
            <span className={styles.id}>#{String(id).padStart(3, '0')}</span>
          </div>
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
        <StatusToggle status={status} onStatusChange={onStatusChange} ticket={ticket} />
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
