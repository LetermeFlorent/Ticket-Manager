/**
 * FakerForm.jsx
 * Formulaire de génération de tickets fictifs
 */
import { useState } from 'react'
import styles from './TicketForm.module.css'

const TYPES = ['Bug', 'Tâche', 'Demande']
const PRIORITIES = ['Haute', 'Moyenne', 'Basse']
const STATUSES = ['Ouvert', 'En cours', 'Fermé']

const TITLES = [
  'Page de connexion cassée', 'Erreur 500 sur /api/users',
  'Mettre à jour le logo', 'Refaire la page d\'accueil',
  'Optimiser les images', 'Correction du filtre de recherche',
  'Ajout de l\'export PDF', 'Problème de scroll sur mobile',
  'Mise à jour des dépendances', 'Nettoyer le code legacy',
  'Ajouter des tests unitaires', 'Correction du format de date',
  'Améliorer la documentation API', 'Refonte du dashboard',
  'Ajout du mode sombre'
]

const DESCRIPTIONS = [
  'L\'utilisateur ne peut pas se connecter.',
  'Une erreur serveur survient lors de l\'appel.',
  'Le logo actuel est obsolète.',
  'La page nécessite un redesign complet.',
  'Les images ne sont pas compressées.',
  'Le filtre ne fonctionne pas correctement.',
  'L\'export génère un fichier corrompu.',
  'Le scroll est saccadé sur les petits écrans.',
  'Plusieurs packages sont obsolètes.',
  'Le code date de 2019 et n\'est plus maintenu.',
  'La couverture de tests est à 12%.',
  'Les dates sont affichées au format US.',
  'La doc n\'a pas été mise à jour depuis 2 ans.',
  'Le dashboard est lent et peu intuitif.',
  'Les utilisateurs demandent un mode nuit.'
]

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function FakerForm({ onSave, onCancel }) {
  const [count, setCount] = useState(5)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (count < 1 || count > 100) return
    setSaving(true)

    for (let i = 0; i < count; i++) {
      await window.api.tickets.create({
        title: random(TITLES) + ' #' + Date.now(),
        description: random(DESCRIPTIONS),
        type: random(TYPES),
        priority: random(PRIORITIES),
        status: random(STATUSES)
      })
    }

    onSave()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Générer des tickets fictifs</h2>

      <div className={styles.field}>
        <label htmlFor="count">Nombre de tickets</label>
        <input
          id="count"
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className={styles.submitBtn} disabled={saving}>
          {saving ? 'Génération...' : `Générer ${count} ticket${count > 1 ? 's' : ''}`}
        </button>
      </div>
    </form>
  )
}
