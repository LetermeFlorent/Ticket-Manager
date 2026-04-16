// Récupère un élément HTML par son id
function byId(id) {
  return document.getElementById(id)
}

// Évite d'afficher du HTML dangereux
function escapeHtml(text) {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

// Construit les options d'une liste déroulante
function buildOptions(firstLabel, values, selectedValue) {
  let html = '<option value="' + firstLabel + '">' + firstLabel + '</option>'
  for (const value of values) {
    const selected = value === selectedValue ? ' selected' : ''
    html += '<option value="' + value + '"' + selected + '>' + value + '</option>'
  }
  return html
}

// Construit une balise select
function buildSelect(name, values, selectedValue) {
  return '<select name="' + name + '">' + buildOptions('', values, selectedValue).replace('<option value=""></option>', '') + '</select>'
}

// Affiche un message à l'écran
export function setMessage(text) {
  byId('message').textContent = text || ''
}

// Affiche les filtres
export function renderFilters(meta, filters) {
  byId('statusFilter').innerHTML = buildOptions(meta.filters.status, meta.statuses, filters.status)
  byId('priorityFilter').innerHTML = buildOptions(meta.filters.priority, meta.priorities, filters.priority)
}

// Affiche les cartes tickets
export function renderTickets(tickets) {
  if (tickets.length === 0) {
    byId('tickets').innerHTML = '<article class="empty">Aucun ticket.</article>'
    return
  }
  let html = ''
  for (const ticket of tickets) html += buildCard(ticket)
  byId('tickets').innerHTML = html
}

// Construit le HTML d'une carte
function buildCard(ticket) {
  const date = new Date(ticket.updated_at).toLocaleDateString('fr-FR')
  const description = escapeHtml(ticket.description) || 'Aucune description.'
  const statusClass = 'status-' + ticket.status.replace(' ', '-')
  return '<article class="card">'
    + '<strong>#' + ticket.id + '</strong>'
    + '<h2>' + escapeHtml(ticket.title) + '</h2>'
    + '<p class="ticket-description">' + description + '</p>'
    + '<span class="type">' + ticket.type + '</span>'
    + '<span class="muted">' + ticket.priority + '</span>'
    + '<span class="muted">' + date + '</span>'
    + '<span class="badge ' + statusClass + '">' + ticket.status + '</span>'
    + '<div class="actions"><button class="secondary" data-action="edit" data-id="' + ticket.id + '">Modifier</button><button class="danger" data-action="delete" data-id="' + ticket.id + '">Supprimer</button></div>'
    + '</article>'
}

// Exporte les outils utiles à d'autres fichiers
export { byId, buildSelect, escapeHtml }
