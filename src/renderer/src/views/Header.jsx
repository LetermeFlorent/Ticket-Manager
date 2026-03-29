/**
 * Header.jsx
 * Barre de titre + boutons d'action
 */
import styles from './Header.module.css'

export default function Header({ onNew, onFaker }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.icon}>🎫</span>
        <h1 className={styles.title}>IssueHub</h1>
      </div>
      <div className={styles.actions}>
        <button className={styles.fakerBtn} onClick={onFaker}>🎲 Faker</button>
        <button className={styles.newBtn} onClick={onNew}>+ Nouveau ticket</button>
      </div>
    </header>
  )
}
