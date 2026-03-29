/**
 * ViewSwitcher.jsx
 * Boutons de sélection du mode d'affichage (liste / grille / kanban)
 */
import styles from './ViewSwitcher.module.css'

const VIEWS = [
  { key: 'list',   icon: '☰', label: 'Liste' },
  { key: 'grid',   icon: '⊞', label: 'Grille' },
  { key: 'kanban', icon: '▦', label: 'Kanban' }
]

export default function ViewSwitcher({ current, onChange }) {
  return (
    <div className={styles.switcher}>
      {VIEWS.map(v => (
        <button
          key={v.key}
          className={`${styles.btn} ${current === v.key ? styles.active : ''}`}
          onClick={() => onChange(v.key)}
          title={v.label}
          aria-label={v.label}
        >
          <span className={styles.icon}>{v.icon}</span>
          <span className={styles.label}>{v.label}</span>
        </button>
      ))}
    </div>
  )
}
