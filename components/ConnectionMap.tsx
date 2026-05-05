'use client';

import styles from './ConnectionMap.module.css';
import type { TrafficEntry } from './Dashboard';

interface ConnectionMapProps {
  entries: TrafficEntry[];
}

export default function ConnectionMap({ entries }: ConnectionMapProps) {
  const ipStats: Record<string, { count: number; errors: number; avgLatency: number; totalLatency: number }> = {};

  for (const entry of entries) {
    if (!ipStats[entry.clientIp]) {
      ipStats[entry.clientIp] = { count: 0, errors: 0, avgLatency: 0, totalLatency: 0 };
    }
    ipStats[entry.clientIp].count++;
    if (!entry.success) ipStats[entry.clientIp].errors++;
    ipStats[entry.clientIp].totalLatency += entry.latency;
  }

  const clients = Object.entries(ipStats)
    .map(([ip, s]) => ({
      ip,
      count: s.count,
      errors: s.errors,
      avgLatency: s.count > 0 ? Math.round(s.totalLatency / s.count) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const maxCount = clients[0]?.count || 1;

  if (clients.length === 0) {
    return <div className={styles.empty}>No connections yet...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.legend}>
        <span>IP Address</span>
        <span>Requests</span>
        <span>Errors</span>
        <span>Avg Lat.</span>
      </div>
      {clients.map((c) => (
        <div key={c.ip} className={styles.row}>
          <span className={styles.ip}>{c.ip}</span>
          <div className={styles.barWrap}>
            <div
              className={styles.bar}
              style={{ width: `${(c.count / maxCount) * 100}%` }}
            />
            <span className={styles.countLabel}>{c.count}</span>
          </div>
          <span className={c.errors > 0 ? styles.errBad : styles.errOk}>
            {c.errors}
          </span>
          <span className={styles.lat}>{c.avgLatency}ms</span>
        </div>
      ))}
    </div>
  );
}
