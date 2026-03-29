/**
 * App.jsx
 * Composant racine — état global, routing modales, mode de vue
 */
import { useState, useEffect, useCallback } from 'react'
import Header from './views/Header'
import FilterBar from './views/FilterBar'
import TicketList from './views/TicketList'
import Modal from './views/Modal'
import TicketForm from './views/TicketForm'
import TicketView from './views/TicketView'
import ConfirmDialog from './views/ConfirmDialog'

export default function App() {
  const [tickets, setTickets] = useState([])
  const [filters, setFilters] = useState({ status: 'Tous', priority: 'Toutes' })
  const [modal, setModal]     = useState(null)
  const [viewMode, setViewMode] = useState('list')

  const loadTickets = useCallback(async () => {
    const res = await window.api.tickets.getAll(filters)
    if (res.success) setTickets(res.data)
  }, [filters])

  useEffect(() => { loadTickets() }, [loadTickets])

  const openCreate = () => setModal({ type: 'create' })
  const openEdit   = (ticket) => setModal({ type: 'edit', ticket })
  const openView   = (ticket) => setModal({ type: 'view', ticket })
  const openDelete = (ticket) => setModal({ type: 'delete', ticket })
  const closeModal = () => setModal(null)
  const afterSave  = () => { closeModal(); loadTickets() }

  return (
    <>
      <Header onNew={openCreate} />
      <FilterBar
        filters={filters}
        onChange={setFilters}
        viewMode={viewMode}
        onViewChange={setViewMode}
      />
      <TicketList
        tickets={tickets}
        viewMode={viewMode}
        onView={openView}
        onEdit={openEdit}
        onDelete={openDelete}
      />
      {modal?.type === 'create' && (
        <Modal onClose={closeModal}>
          <TicketForm onSave={afterSave} onCancel={closeModal} />
        </Modal>
      )}
      {modal?.type === 'edit' && (
        <Modal onClose={closeModal}>
          <TicketForm ticket={modal.ticket} onSave={afterSave} onCancel={closeModal} />
        </Modal>
      )}
      {modal?.type === 'view' && (
        <Modal onClose={closeModal}>
          <TicketView ticket={modal.ticket} onClose={closeModal} />
        </Modal>
      )}
      {modal?.type === 'delete' && (
        <Modal onClose={closeModal}>
          <ConfirmDialog ticket={modal.ticket} onConfirm={afterSave} onCancel={closeModal} />
        </Modal>
      )}
    </>
  )
}
