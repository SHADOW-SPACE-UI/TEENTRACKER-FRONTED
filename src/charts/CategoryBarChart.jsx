import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

export default function CategoryBarChart({ data = [], currency = 'INR' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        No category data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
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
          <div style={{ fontWeight: 700, color: item.color }}>{item.name}</div>
          <div>{formatCurrency(item.value, currency)} ({item.percentage}%)</div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#23314E' : '#E2E8F0'} horizontal={false} />
        <XAxis
          type="number"
          stroke="var(--text-subtle)"
          fontSize={11}
          tickLine={false}
          tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="var(--text-subtle)"
          fontSize={11}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`bar-${index}`} fill={entry.color || '#6366F1'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
