import React from 'react';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';
import { Edit2, Trash2, CreditCard, Tag } from 'lucide-react';

export default function ExpenseCard({ expense, currency = 'INR', onEdit, onDelete }) {
  const categoryColor = getCategoryColor(expense.category);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        transition: 'all var(--transition-fast)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: `${categoryColor}18`,
            color: categoryColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.1rem'
          }}
        >
          <Tag size={20} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              {expense.merchant || expense.description || expense.category}
            </h4>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: `${categoryColor}15`,
                color: categoryColor,
                fontWeight: 600
              }}
            >
              {expense.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            <span>{formatDate(expense.date)}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <CreditCard size={12} />
              {expense.payment_method}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
            -{formatCurrency(expense.amount, currency)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {onEdit && (
            <button
              onClick={() => onEdit(expense)}
              aria-label="Edit expense"
              className="btn-icon"
              style={{ color: 'var(--text-muted)', padding: '6px' }}
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(expense)}
              aria-label="Delete expense"
              className="btn-icon"
              style={{ color: 'var(--accent-rose)', padding: '6px' }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
