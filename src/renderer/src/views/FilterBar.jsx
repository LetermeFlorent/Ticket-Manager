/**
 * FilterBar.jsx
 * Filtres statut et priorité + sélecteur de vue
 */
import { STATUSES, PRIORITIES } from '../constants'
import ViewSwitcher from './ViewSwitcher'
import styles from './FilterBar.module.css'

export default function FilterBar({ filters, onChange, viewMode, onViewChange }) {
  const set = (key, value) => onChange(prev => ({ ...prev, [key]: value }))

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.group}>
          <label>Statut</label>
          <select value={filters.status} onChange={e => set('status', e.target.value)}>
            <option>Tous</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className={styles.group}>
          <label>Priorité</label>
          <select value={filters.priority} onChange={e => set('priority', e.target.value)}>
            <option>Toutes</option>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className={styles.right}>
        <label>Vue</label>
        <ViewSwitcher current={viewMode} onChange={onViewChange} />
      </div>
    </div>
  )
}
