/**
 * KanbanView.jsx
 * Vue Kanban — colonnes par statut
 */
import { STATUSES, STATUS_COLORS } from '../constants'
import TicketCard from './TicketCard'
import styles from './KanbanView.module.css'

export default function KanbanView({ tickets, onView, onEdit, onDelete }) {
  const byStatus = (status) => tickets.filter(t => t.status === status)

  return (
    <div className={styles.board}>
      {STATUSES.map(status => {
        const cols = byStatus(status)
        return (
          <div key={status} className={styles.column}>
            <div className={styles.colHeader}>
              <span
                className={styles.colDot}
                style={{ background: STATUS_COLORS[status] }}
              />
              <span className={styles.colTitle}>{status}</span>
              <span className={styles.colCount}>{cols.length}</span>
            </div>
            <div className={styles.colBody}>
              {cols.length === 0 && (
                <p className={styles.empty}>Aucun ticket</p>
              )}
              {cols.map(t => (
                <TicketCard
                  key={t.id}
                  ticket={t}
                  compact
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
