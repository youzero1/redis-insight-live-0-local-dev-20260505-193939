'use client';

import styles from './LatencyGraph.module.css';

interface LatencyGraphProps {
  data: number[];
}

export default function LatencyGraph({ data }: LatencyGraphProps) {
  const width = 400;
  const height = 120;
  const padding = { top: 10, right: 10, bottom: 20, left: 30 };

  if (!data || data.length < 2) {
    return <div className={styles.empty}>Collecting data...</div>;
  }

  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal || 1;

  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const points = data.map((v, i) => {
    const x = padding.left + (i / (data.length - 1)) * innerW;
    const y = padding.top + innerH - ((v - minVal) / range) * innerH;
    return `${x},${y}`;
  });

  const areaPoints = [
    `${padding.left},${padding.top + innerH}`,
    ...points,
    `${padding.left + innerW},${padding.top + innerH}`,
  ].join(' ');

  const linePoints = points.join(' ');

  const yLabels = [minVal, Math.round((minVal + maxVal) / 2), maxVal];

  return (
    <div className={styles.container}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg} preserveAspectRatio="none">
        <defs>
          <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2979ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2979ff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {yLabels.map((v, i) => {
          const y = padding.top + innerH - ((v - minVal) / range) * innerH;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + innerW}
                y2={y}
                stroke="#2e3147"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text x={padding.left - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#616161">
                {v}ms
              </text>
            </g>
          );
        })}
        <polygon points={areaPoints} fill="url(#latencyGrad)" />
        <polyline
          points={linePoints}
          fill="none"
          stroke="#2979ff"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {data.length > 0 && (() => {
          const lastIdx = data.length - 1;
          const lx = padding.left + (lastIdx / (data.length - 1)) * innerW;
          const ly = padding.top + innerH - ((data[lastIdx] - minVal) / range) * innerH;
          return (
            <circle cx={lx} cy={ly} r="3" fill="#2979ff" />
          );
        })()}
      </svg>
      <div className={styles.current}>
        Current: <strong>{data[data.length - 1]}ms</strong>
      </div>
    </div>
  );
}
