import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

export default function SavingsTrendChart({ data = [], currency = 'INR' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        No savings goals data to display
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            border: '1px solid var(--border-color)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.8rem'
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '4px' }}>{label}</div>
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value, currency)}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#23314E' : '#E2E8F0'} vertical={false} />
        <XAxis
          dataKey="title"
          stroke="var(--text-subtle)"
          fontSize={11}
          tickLine={false}
        />
        <YAxis
          stroke="var(--text-subtle)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          height={32}
          formatter={(value) => <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{value}</span>}
        />
        <Bar dataKey="target" name="Target" fill="#A855F7" radius={[4, 4, 0, 0]} />
        <Bar dataKey="current" name="Saved" fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
