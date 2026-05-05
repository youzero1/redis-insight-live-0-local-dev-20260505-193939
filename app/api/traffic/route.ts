import { NextResponse } from 'next/server';

const REDIS_COMMANDS = [
  'GET', 'SET', 'DEL', 'HGET', 'HSET', 'HGETALL', 'LPUSH', 'RPUSH',
  'LRANGE', 'SADD', 'SMEMBERS', 'ZADD', 'ZRANGE', 'EXPIRE', 'TTL',
  'EXISTS', 'INCR', 'DECR', 'MGET', 'MSET', 'KEYS', 'SCAN', 'PING',
  'INFO', 'CONFIG', 'SELECT', 'FLUSHDB', 'PUBLISH', 'SUBSCRIBE',
];

const KEY_PREFIXES = [
  'user:', 'session:', 'cache:', 'product:', 'order:', 'queue:',
  'rate_limit:', 'token:', 'config:', 'analytics:',
];

const CLIENT_IPS = [
  '192.168.1.10', '192.168.1.11', '192.168.1.12', '10.0.0.5',
  '10.0.0.6', '172.16.0.3', '172.16.0.4', '192.168.2.100',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTrafficEntry() {
  const command = randomItem(REDIS_COMMANDS);
  const prefix = randomItem(KEY_PREFIXES);
  const keyId = randomInt(1, 9999);
  const key = `${prefix}${keyId}`;
  const latency = randomInt(1, 50);
  const size = randomInt(10, 4096);
  const success = Math.random() > 0.05;
  const clientIp = randomItem(CLIENT_IPS);
  const db = randomInt(0, 3);

  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    command,
    key,
    clientIp,
    latency,
    size,
    success,
    db,
    duration: latency,
  };
}

function generateStats() {
  return {
    totalCommands: randomInt(150000, 999999),
    commandsPerSec: randomInt(100, 5000),
    connectedClients: randomInt(5, 200),
    usedMemory: randomInt(50, 4096),
    hitRate: parseFloat((Math.random() * 40 + 60).toFixed(2)),
    missRate: parseFloat((Math.random() * 40).toFixed(2)),
    totalKeys: randomInt(1000, 100000),
    uptime: randomInt(3600, 864000),
    networkIn: randomInt(100, 5000),
    networkOut: randomInt(500, 20000),
    rejectedConnections: randomInt(0, 10),
    expiredKeys: randomInt(0, 500),
  };
}

function generateCommandDistribution() {
  const commands = ['GET', 'SET', 'HGET', 'HSET', 'DEL', 'LPUSH', 'ZADD', 'OTHER'];
  const total = 1000;
  let remaining = total;
  return commands.map((cmd, i) => {
    if (i === commands.length - 1) {
      return { command: cmd, count: remaining };
    }
    const count = Math.floor(Math.random() * (remaining / (commands.length - i)));
    remaining -= count;
    return { command: cmd, count };
  });
}

export async function GET() {
  const entries = Array.from({ length: randomInt(5, 15) }, generateTrafficEntry);
  const stats = generateStats();
  const commandDistribution = generateCommandDistribution();

  return NextResponse.json({
    entries,
    stats,
    commandDistribution,
    timestamp: new Date().toISOString(),
  });
}
