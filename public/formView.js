import { byId, buildSelect, escapeHtml } from './view.js'

// Ouvre le formulaire dans la fenêtre modal
export function renderForm(ticket, id, meta, onSave) {
  const modal = byId('modal')
  modal.innerHTML = buildForm(ticket, meta)
  modal.showModal()
  const title = byId('ticketTitle')
  if (title) title.focus()
  byId('closeModal').onclick = function () { modal.close() }
  byId('ticketForm').onsubmit = async function (event) {
    event.preventDefault()
    const formData = readForm(event.target)
    await onSave(id, formData)
    if (byId('message').textContent === '') modal.close()
  }
}

// Ouvre une popup simple pour demander une quantite
export function renderCountForm(onSave, onDeleteAll) {
  const modal = byId('modal')
  modal.innerHTML = buildCountForm()
  modal.showModal()
  const count = byId('fakerCount')
  if (count) count.focus()
  byId('closeModal').onclick = function () { modal.close() }
  byId('fakerForm').onsubmit = async function (event) {
    event.preventDefault()
    await onSave(byId('fakerCount').value)
    modal.close()
  }
  byId('deleteAllBtn').onclick = async function () {
    const ok = confirm('Supprimer tous les tickets ?')
    if (!ok) return
    await onDeleteAll()
    modal.close()
  }
}

// Construit un champ du formulaire
function buildField(label, input) {
  return '<label class="field"><span>' + label + '</span>' + input + '</label>'
}

// Lit les valeurs du formulaire
function readForm(form) {
  const data = {}
  const values = new FormData(form)
  for (const item of values.entries()) data[item[0]] = item[1]
  return data
}

// Construit tout le HTML du formulaire
function buildForm(ticket, meta) {
  return '<div class="panel"><form id="ticketForm">'
    + buildField('Titre', '<input id="ticketTitle" name="title" value="' + escapeHtml(ticket.title) + '" required>')
    + buildField('Description', '<textarea name="description">' + escapeHtml(ticket.description) + '</textarea>')
    + buildField('Type', buildSelect('type', meta.types, ticket.type))
    + buildField('Priorité', buildSelect('priority', meta.priorities, ticket.priority))
    + buildField('Statut', buildSelect('status', meta.statuses, ticket.status))
    + '<div class="actions form-actions"><button type="button" class="secondary" id="closeModal">Annuler</button><button type="submit" class="primary">Enregistrer</button></div>'
    + '</form></div>'
}

function buildCountForm() {
  return '<div class="panel"><form id="fakerForm">'
    + buildField('Nombre de tickets', '<input id="fakerCount" name="count" type="number" min="1" value="10" required>')
    + '<div class="actions form-actions"><button type="button" class="secondary" id="closeModal">Annuler</button><button type="button" class="danger" id="deleteAllBtn">Tout supprimer</button><button type="submit" class="primary">Ajouter</button></div>'
    + '</form></div>'
}
