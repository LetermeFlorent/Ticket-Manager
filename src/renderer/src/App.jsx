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
import FakerForm from './views/FakerForm'

const STATUS_CYCLE = { 'Ouvert': 'En cours', 'En cours': 'Fermé', 'Fermé': 'Ouvert' }

export default function App() {
  const [tickets, setTickets]   = useState([])
  const [filters, setFilters]   = useState({ status: 'Tous', priority: 'Toutes' })
  const [modal, setModal]       = useState(null)
  const [viewMode, setViewMode] = useState('list')

  const loadTickets = useCallback(async () => {
    const res = await window.api.tickets.getAll(filters)
    if (res.success) setTickets(res.data)
  }, [filters])

  useEffect(() => { loadTickets() }, [loadTickets])

  const handleStatusChange = async (ticket) => {
    await window.api.tickets.update(ticket.id, {
      ...ticket,
      status: STATUS_CYCLE[ticket.status]
    })
    loadTickets()
  }

  const openCreate = () => setModal({ type: 'create' })
  const openFaker  = () => setModal({ type: 'faker' })
  const openEdit   = (ticket) => setModal({ type: 'edit', ticket })
  const openView   = (ticket) => setModal({ type: 'view', ticket })
  const openDelete = (ticket) => setModal({ type: 'delete', ticket })
  const closeModal = () => setModal(null)
  const afterSave  = () => { closeModal(); loadTickets() }

  return (
    <>
      <Header onNew={openCreate} onFaker={openFaker} />
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
        onStatusChange={handleStatusChange}
      />

      {modal?.type === 'create' && (
        <Modal onClose={closeModal}>
          <TicketForm onSave={afterSave} onCancel={closeModal} />
        </Modal>
      )}
      {modal?.type === 'faker' && (
        <Modal onClose={closeModal}>
          <FakerForm onSave={afterSave} onCancel={closeModal} />
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
