/**
 * validation.js
 * Fonctions de validation des données ticket
 */
import { TYPES, PRIORITIES, STATUSES } from './constants'

const TITLE_MAX       = 120
const DESCRIPTION_MAX = 1000

export function isValidId(id) {
  const n = parseInt(id, 10)
  return Number.isInteger(n) && n > 0 && String(n) === String(id)
}

export function validateTicket(data) {
  const errors = []

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Le titre doit contenir au moins 3 caractères.')
  }
  if (data.title && data.title.trim().length > TITLE_MAX) {
    errors.push(`Le titre ne peut pas dépasser ${TITLE_MAX} caractères.`)
  }
  if (data.description && data.description.length > DESCRIPTION_MAX) {
    errors.push(`La description ne peut pas dépasser ${DESCRIPTION_MAX} caractères.`)
  }
  if (!TYPES.includes(data.type)) {
    errors.push('Type invalide.')
  }
  if (!PRIORITIES.includes(data.priority)) {
    errors.push('Priorité invalide.')
  }
  if (!STATUSES.includes(data.status)) {
    errors.push('Statut invalide.')
  }

  return errors
}
