/**
 * ConfirmDialog.jsx
 * Confirmation avant suppression d'un ticket
 */
import styles from './ConfirmDialog.module.css'

export default function ConfirmDialog({ ticket, onConfirm, onCancel }) {
  const handleConfirm = async () => {
    await window.api.tickets.delete(ticket.id)
    onConfirm()
  }

  return (
    <div className={styles.dialog}>
      <span className={styles.icon}>⚠️</span>
      <h2 className={styles.title}>Confirmer la suppression ?</h2>
      <p className={styles.message}>
        Le ticket <strong>#{String(ticket.id).padStart(3, '0')} — {ticket.title}</strong> sera définitivement supprimé.
      </p>
      <div className={styles.actions}>
        <button className={styles.cancel}  onClick={onCancel}>Annuler</button>
        <button className={styles.confirm} onClick={handleConfirm}>Supprimer</button>
      </div>
    </div>
  )
}
