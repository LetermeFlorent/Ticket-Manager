import { apiGet, apiSend } from './api.js'
import { renderFilters, renderTickets, setMessage } from './view.js'
import { renderCountForm, renderForm } from './formView.js'

// Stocke les données du front
const state = {
  meta: null,
  tickets: [],
  filters: { status: 'Tous', priority: 'Toutes' }
}

const fakeStarts = ['Bug', 'Erreur', 'Demande', 'Tache', 'Probleme', 'Blocage']
const fakeEnds = ['connexion', 'impression', 'export', 'ticket', 'client', 'serveur']
const fakeTexts = [
  'Verification demandee par le support.',
  'Le probleme apparait de maniere aleatoire.',
  'Besoin de correction rapide.',
  'Le comportement n est pas celui attendu.',
  'Une analyse complementaire est necessaire.'
]

function randomItem(values) {
  return values[Math.floor(Math.random() * values.length)]
}

function buildFakeTicket() {
  return {
    title: randomItem(fakeStarts) + ' ' + randomItem(fakeEnds),
    description: randomItem(fakeTexts),
    type: randomItem(state.meta.types),
    priority: randomItem(state.meta.priorities),
    status: randomItem(state.meta.statuses)
  }
}

// Cherche un ticket déjà affiché
function findTicketById(id) {
  for (const ticket of state.tickets) {
    if (String(ticket.id) === String(id)) return ticket
  }
  return null
}

// Recharge la liste des tickets
async function loadTickets() {
  const params = new URLSearchParams(state.filters)
  const response = await apiGet('/tickets?' + params.toString())
  state.tickets = response.data
  renderTickets(state.tickets)
}

// Enregistre un ticket
async function saveTicket(id, formData) {
  const path = id ? '/tickets/' + id : '/tickets'
  const method = id ? 'PUT' : 'POST'
  const response = await apiSend(path, method, formData)
  setMessage(response.success ? '' : response.error)
  if (!response.success) return
  await loadTickets()
}

// Supprime un ticket
async function deleteTicket(id) {
  const response = await apiSend('/tickets/' + id, 'DELETE')
  setMessage(response.success ? '' : response.error)
  if (response.success) await loadTickets()
}

async function addFakeTickets(count) {
  const total = Math.max(0, Number.parseInt(count, 10) || 0)
  if (!total) return
  for (let i = 0; i < total; i += 1) {
    const response = await apiSend('/tickets', 'POST', buildFakeTicket())
    if (!response.success) {
      setMessage(response.error)
      return
    }
  }
  setMessage('')
  await loadTickets()
}

// Supprime tous les tickets
async function deleteAllTickets() {
  const response = await apiSend('/tickets', 'DELETE')
  setMessage(response.success ? '' : response.error)
  if (response.success) await loadTickets()
}

// Démarre le front
async function start() {
  const response = await apiGet('/meta')
  state.meta = response.data
  state.filters = response.data.filters
  renderFilters(state.meta, state.filters)
  await loadTickets()
}

// Gère les clics sur les boutons
document.addEventListener('click', async function (event) {
  const button = event.target.closest('button')
  if (!button) return
  if (button.id === 'createBtn') renderForm(state.meta.emptyTicket, '', state.meta, saveTicket)
  if (button.id === 'fakerBtn') renderCountForm(addFakeTickets, deleteAllTickets)
  if (button.dataset.action === 'edit') renderForm(findTicketById(button.dataset.id), button.dataset.id, state.meta, saveTicket)
  if (button.dataset.action === 'delete') {
    const ok = confirm('Supprimer ticket #' + button.dataset.id + ' ?')
    if (ok) await deleteTicket(button.dataset.id)
  }
})

// Gère les filtres
document.addEventListener('change', async function (event) {
  if (event.target.id === 'statusFilter') state.filters.status = event.target.value
  if (event.target.id === 'priorityFilter') state.filters.priority = event.target.value
  if (event.target.id === 'statusFilter' || event.target.id === 'priorityFilter') await loadTickets()
})

// Lance l'application
start()
