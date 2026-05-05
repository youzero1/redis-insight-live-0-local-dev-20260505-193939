import styles from './Header.module.css';

interface HeaderProps {
  isRunning: boolean;
  onToggle: () => void;
  lastUpdated: string;
}

export default function Header({ isRunning, onToggle, lastUpdated }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🔴</span>
          <span className={styles.logoText}>Redis Insight</span>
          <span className={styles.logoSub}>Live Traffic</span>
        </div>
      </div>
      <div className={styles.right}>
        {lastUpdated && (
          <span className={styles.updated}>Last updated: {lastUpdated}</span>
        )}
        <button
          className={`${styles.toggleBtn} ${isRunning ? styles.running : styles.paused}`}
          onClick={onToggle}
        >
          {isRunning ? (
            <><span className={styles.dot}></span>Live</>
          ) : (
            <><span className={styles.dotPaused}></span>Paused</>
          )}
        </button>
      </div>
    </header>
  );
}
