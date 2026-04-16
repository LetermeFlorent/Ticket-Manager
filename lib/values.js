// Listes autorisées dans le projet
export const values = {
  types: ['Bug', 'Feature', 'Amélioration'],
  priorities: ['Basse', 'Moyenne', 'Haute'],
  statuses: ['Ouvert', 'En cours', 'Fermé']
}

// Valeurs de départ pour un nouveau ticket
export const emptyTicket = {
  title: '',
  description: '',
  type: values.types[0],
  priority: values.priorities[1],
  status: values.statuses[0]
}
