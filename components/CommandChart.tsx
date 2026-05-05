'use client';

import styles from './CommandChart.module.css';
import type { CommandDist } from './Dashboard';

interface CommandChartProps {
  data: CommandDist[];
}

const COLORS = [
  '#2979ff', '#00c853', '#ffd600', '#aa00ff',
  '#ff6d00', '#dc143c', '#00bcd4', '#9e9e9e',
];

export default function CommandChart({ data }: CommandChartProps) {
  if (!data || data.length === 0) {
    return <div className={styles.empty}>Loading...</div>;
  }

  const total = data.reduce((acc, d) => acc + d.count, 0);
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className={styles.container}>
      {sorted.map((item, i) => {
        const pct = total > 0 ? (item.count / total) * 100 : 0;
        return (
          <div key={item.command} className={styles.row}>
            <span className={styles.label}>{item.command}</span>
            <div className={styles.barTrack}>
              <div
                className={styles.bar}
                style={{
                  width: `${pct}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
            </div>
            <span className={styles.pct}>{pct.toFixed(1)}%</span>
            <span className={styles.count}>{item.count}</span>
          </div>
        );
      })}
    </div>
  );
}
