import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatShortDate } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

export default function SpendingTimelineChart({ data = [], currency = 'INR' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        No spending activity in this period
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
          <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>
            {formatShortDate(label)}
          </div>
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color, fontWeight: 600 }}>
              {entry.name === 'expense' ? 'Expenses: ' : 'Income: '}
              {formatCurrency(entry.value, currency)}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#23314E' : '#E2E8F0'} vertical={false} />
        <XAxis
          dataKey="key"
          stroke="var(--text-subtle)"
          fontSize={11}
          tickLine={false}
          tickFormatter={(val) => formatShortDate(val)}
        />
        <YAxis
          stroke="var(--text-subtle)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="expense"
          name="expense"
          stroke="#F43F5E"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#expenseGradient)"
        />
        <Area
          type="monotone"
          dataKey="income"
          name="income"
          stroke="#10B981"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#incomeGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
