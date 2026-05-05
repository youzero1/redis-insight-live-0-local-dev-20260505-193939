'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Dashboard.module.css';
import StatCard from './StatCard';
import TrafficTable from './TrafficTable';
import CommandChart from './CommandChart';
import LatencyGraph from './LatencyGraph';
import ConnectionMap from './ConnectionMap';
import Header from './Header';

export interface TrafficEntry {
  id: string;
  timestamp: string;
  command: string;
  key: string;
  clientIp: string;
  latency: number;
  size: number;
  success: boolean;
  db: number;
  duration: number;
}

export interface Stats {
  totalCommands: number;
  commandsPerSec: number;
  connectedClients: number;
  usedMemory: number;
  hitRate: number;
  missRate: number;
  totalKeys: number;
  uptime: number;
  networkIn: number;
  networkOut: number;
  rejectedConnections: number;
  expiredKeys: number;
}

export interface CommandDist {
  command: string;
  count: number;
}

export default function Dashboard() {
  const [entries, setEntries] = useState<TrafficEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [commandDist, setCommandDist] = useState<CommandDist[]>([]);
  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [filter, setFilter] = useState<string>('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/traffic');
      const data = await res.json();
      setEntries((prev) => {
        const combined = [...data.entries, ...prev].slice(0, 200);
        return combined;
      });
      setStats(data.stats);
      setCommandDist(data.commandDistribution);
      setLatencyHistory((prev) => {
        const avgLatency = data.entries.reduce(
          (acc: number, e: TrafficEntry) => acc + e.latency,
          0
        ) / (data.entries.length || 1);
        return [...prev, Math.round(avgLatency)].slice(-30);
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch traffic data', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(fetchData, 1500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, fetchData]);

  const filteredEntries = entries.filter((e) => {
    if (!filter) return true;
    const f = filter.toLowerCase();
    return (
      e.command.toLowerCase().includes(f) ||
      e.key.toLowerCase().includes(f) ||
      e.clientIp.includes(f)
    );
  });

  return (
    <div className={styles.dashboard}>
      <Header
        isRunning={isRunning}
        onToggle={() => setIsRunning((r) => !r)}
        lastUpdated={lastUpdated}
      />
      <main className={styles.main}>
        {stats && (
          <div className={styles.statsGrid}>
            <StatCard
              label="Commands/sec"
              value={stats.commandsPerSec.toLocaleString()}
              icon="⚡"
              color="blue"
              sub={`Total: ${stats.totalCommands.toLocaleString()}`}
            />
            <StatCard
              label="Connected Clients"
              value={stats.connectedClients.toString()}
              icon="🔗"
              color="green"
              sub={`Rejected: ${stats.rejectedConnections}`}
            />
            <StatCard
              label="Memory Used"
              value={`${stats.usedMemory} MB`}
              icon="💾"
              color="yellow"
              sub={`Keys: ${stats.totalKeys.toLocaleString()}`}
            />
            <StatCard
              label="Hit Rate"
              value={`${stats.hitRate}%`}
              icon="🎯"
              color="purple"
              sub={`Miss: ${stats.missRate}%`}
            />
            <StatCard
              label="Network In"
              value={`${stats.networkIn} KB/s`}
              icon="📥"
              color="orange"
              sub={`Out: ${stats.networkOut} KB/s`}
            />
            <StatCard
              label="Expired Keys"
              value={stats.expiredKeys.toLocaleString()}
              icon="⏰"
              color="red"
              sub={`Uptime: ${Math.floor(stats.uptime / 3600)}h`}
            />
          </div>
        )}

        <div className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <h3 className={styles.cardTitle}>Command Distribution</h3>
            <CommandChart data={commandDist} />
          </div>
          <div className={styles.chartCard}>
            <h3 className={styles.cardTitle}>Latency (ms) — Last 30 polls</h3>
            <LatencyGraph data={latencyHistory} />
          </div>
          <div className={styles.chartCard}>
            <h3 className={styles.cardTitle}>Client Connections</h3>
            <ConnectionMap entries={entries.slice(0, 50)} />
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.cardTitle}>Live Command Stream</h3>
            <div className={styles.filterRow}>
              <input
                className={styles.filterInput}
                type="text"
                placeholder="Filter by command, key, or IP..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <span className={styles.count}>{filteredEntries.length} entries</span>
            </div>
          </div>
          <TrafficTable entries={filteredEntries} />
        </div>
      </main>
    </div>
  );
}
