import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

export default function CategoryPieChart({ data = [], currency = 'INR' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        No category expense data available
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
          <div style={{ color: 'var(--text-main)' }}>
            {formatCurrency(item.value, currency)} ({item.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={4}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#6366F1'} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
