/**
 * ticketService.js
 * Logique métier tickets — validation + appel modèle
 */
import TicketModel from '../models/TicketModel'
import { validateTicket, isValidId } from '../utils/validation'

const ticketService = {
  getAll(filters) {
    return { success: true, data: TicketModel.findAll(filters) }
  },

  getById(id) {
    if (!isValidId(id)) return { success: false, error: 'ID invalide.' }
    const ticket = TicketModel.findById(id)
    if (!ticket) return { success: false, error: 'Ticket introuvable.' }
    return { success: true, data: ticket }
  },

  create(data) {
    const errors = validateTicket(data)
    if (errors.length) return { success: false, error: errors.join(' ') }
    return { success: true, data: TicketModel.create(data) }
  },

  update(id, data) {
    if (!isValidId(id)) return { success: false, error: 'ID invalide.' }
    const errors = validateTicket(data)
    if (errors.length) return { success: false, error: errors.join(' ') }
    if (!TicketModel.findById(id)) return { success: false, error: 'Ticket introuvable.' }
    return { success: true, data: TicketModel.update(id, data) }
  },

  delete(id) {
    if (!isValidId(id)) return { success: false, error: 'ID invalide.' }
    if (!TicketModel.findById(id)) return { success: false, error: 'Ticket introuvable.' }
    TicketModel.delete(id)
    return { success: true }
  }
}

export default ticketService
