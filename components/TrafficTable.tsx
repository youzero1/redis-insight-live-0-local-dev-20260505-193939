'use client';

import styles from './TrafficTable.module.css';
import type { TrafficEntry } from './Dashboard';

interface TrafficTableProps {
  entries: TrafficEntry[];
}

const COMMAND_COLORS: Record<string, string> = {
  GET: '#2979ff',
  SET: '#00c853',
  DEL: '#dc143c',
  HGET: '#aa00ff',
  HSET: '#7b1fa2',
  HGETALL: '#6200ea',
  LPUSH: '#ff6d00',
  RPUSH: '#e65100',
  LRANGE: '#f57c00',
  SADD: '#00bcd4',
  SMEMBERS: '#006064',
  ZADD: '#ffd600',
  ZRANGE: '#f9a825',
  EXPIRE: '#78909c',
  TTL: '#546e7a',
  EXISTS: '#4caf50',
  INCR: '#8bc34a',
  DECR: '#f44336',
  MGET: '#03a9f4',
  MSET: '#0288d1',
  KEYS: '#9e9e9e',
  SCAN: '#757575',
  PING: '#607d8b',
  INFO: '#78909c',
  CONFIG: '#90a4ae',
  SELECT: '#b0bec5',
  FLUSHDB: '#ff1744',
  PUBLISH: '#e040fb',
  SUBSCRIBE: '#d500f9',
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function TrafficTable({ entries }: TrafficTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Command</th>
            <th>Key</th>
            <th>Client IP</th>
            <th>DB</th>
            <th>Latency</th>
            <th>Size</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className={entry.success ? '' : styles.errorRow}>
              <td className={styles.time}>{formatTime(entry.timestamp)}</td>
              <td>
                <span
                  className={styles.commandBadge}
                  style={{
                    backgroundColor: `${COMMAND_COLORS[entry.command] || '#607d8b'}22`,
                    color: COMMAND_COLORS[entry.command] || '#607d8b',
                    borderColor: `${COMMAND_COLORS[entry.command] || '#607d8b'}44`,
                  }}
                >
                  {entry.command}
                </span>
              </td>
              <td className={styles.key} title={entry.key}>{entry.key}</td>
              <td className={styles.ip}>{entry.clientIp}</td>
              <td className={styles.db}>DB{entry.db}</td>
              <td className={styles.latency}>
                <span
                  className={styles.latencyBar}
                  style={{
                    color: entry.latency > 30 ? '#ff6d00' : entry.latency > 15 ? '#ffd600' : '#00c853',
                  }}
                >
                  {entry.latency}ms
                </span>
              </td>
              <td className={styles.size}>{entry.size}B</td>
              <td>
                <span className={entry.success ? styles.statusOk : styles.statusErr}>
                  {entry.success ? 'OK' : 'ERR'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {entries.length === 0 && (
        <div className={styles.empty}>No traffic data yet...</div>
      )}
    </div>
  );
}
