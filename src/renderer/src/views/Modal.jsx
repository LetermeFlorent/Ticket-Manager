/**
 * Modal.jsx
 * Composant modal générique avec overlay
 */
import styles from './Modal.module.css'

export default function Modal({ children, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Fermer">✕</button>
        {children}
      </div>
    </div>
  )
}
