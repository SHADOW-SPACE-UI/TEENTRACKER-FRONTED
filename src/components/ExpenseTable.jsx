import React from 'react';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';
import { Edit2, Trash2 } from 'lucide-react';

export default function ExpenseTable({ expenses, currency = 'INR', onEdit, onDelete }) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <th style={{ padding: '0.75rem 1rem' }}>Date</th>
            <th style={{ padding: '0.75rem 1rem' }}>Category</th>
            <th style={{ padding: '0.75rem 1rem' }}>Merchant / Description</th>
            <th style={{ padding: '0.75rem 1rem' }}>Method</th>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Amount</th>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => {
            const catColor = getCategoryColor(exp.category);
            return (
              <tr
                key={exp.id}
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                  transition: 'background-color var(--transition-fast)'
                }}
              >
                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{formatDate(exp.date)}</td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: `${catColor}15`,
                      color: catColor
                    }}
                  >
                    {exp.category}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{exp.merchant || '—'}</div>
                  {exp.description && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exp.description}</div>
                  )}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{exp.payment_method}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: 'var(--accent-rose)' }}>
                  -{formatCurrency(exp.amount, currency)}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(exp)}
                        aria-label="Edit"
                        className="btn-icon"
                        style={{ color: 'var(--text-muted)', padding: '5px' }}
                      >
                        <Edit2 size={15} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(exp)}
                        aria-label="Delete"
                        className="btn-icon"
                        style={{ color: 'var(--accent-rose)', padding: '5px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
