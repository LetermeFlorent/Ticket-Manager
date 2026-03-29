/**
 * validation.js
 * Fonctions de validation des données ticket
 */
import { TYPES, PRIORITIES, STATUSES } from './constants'

export function validateTicket(data) {
  const errors = []

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Le titre doit contenir au moins 3 caractères.')
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
