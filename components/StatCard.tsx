import styles from './StatCard.module.css';

type ColorType = 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'red';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  color: ColorType;
  sub?: string;
}

export default function StatCard({ label, value, icon, color, sub }: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.top}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.value}>{value}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}
