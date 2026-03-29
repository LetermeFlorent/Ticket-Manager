/**
 * TicketList.jsx
 * Conteneur principal — gère les 3 modes : liste, grille, kanban
 */
import TicketCard from './TicketCard'
import KanbanView from './KanbanView'
import styles from './TicketList.module.css'

function Empty() {
  return (
    <div className={styles.empty}>
      <span>📭</span>
      <p>Aucun ticket trouvé.</p>
    </div>
  )
}

function ListView({ tickets, onView, onEdit, onDelete, onStatusChange }) {
  return (
    <div className={styles.listInner}>
      {tickets.map(t => (
        <TicketCard key={t.id} ticket={t} onView={onView} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
      ))}
    </div>
  )
}

function GridView({ tickets, onView, onEdit, onDelete, onStatusChange }) {
  return (
    <div className={styles.grid}>
      {tickets.map(t => (
        <TicketCard key={t.id} ticket={t} compact onView={onView} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
      ))}
    </div>
  )
}

export default function TicketList({ tickets, viewMode = 'list', onView, onEdit, onDelete, onStatusChange }) {
  const actions = { onView, onEdit, onDelete, onStatusChange }

  if (viewMode === 'kanban') {
    return (
      <main className={styles.wrapper}>
        {tickets.length === 0
          ? <Empty />
          : <KanbanView tickets={tickets} {...actions} />}
      </main>
    )
  }

  return (
    <main className={styles.wrapper}>
      {tickets.length === 0 ? <Empty /> : viewMode === 'grid'
        ? <GridView tickets={tickets} {...actions} />
        : <ListView tickets={tickets} {...actions} />}
      <footer className={styles.footer}>
        {tickets.length} ticket{tickets.length > 1 ? 's' : ''}
      </footer>
    </main>
  )
}
