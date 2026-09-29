import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Target, Plus, Edit2, Trash2, Calendar, CheckCircle2 } from 'lucide-react';

export default function SavingsGoalCard({ goal, currency = 'INR', onAddSavings, onEdit, onDelete }) {
  const [showAddInput, setShowAddInput] = useState(false);
  const [contribution, setContribution] = useState('');

  const target = Number(goal.target_amount);
  const current = Number(goal.current_amount || 0);
  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const isCompleted = current >= target;

  const handleContribute = (e) => {
    e.preventDefault();
    const amount = Number(contribution);
    if (amount > 0) {
      onAddSavings(goal.id, amount);
      setContribution('');
      setShowAddInput(false);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        border: isCompleted ? '1.5px solid #10B981' : '1px solid var(--border-color)',
        transition: 'all var(--transition-fast)'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.12)',
              color: isCompleted ? '#10B981' : '#6366F1'
            }}
          >
            {isCompleted ? <CheckCircle2 size={20} /> : <Target size={20} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {goal.title}
            </h3>
            {goal.target_date && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Calendar size={12} /> Target: {formatDate(goal.target_date)}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {onEdit && (
            <button
              onClick={() => onEdit(goal)}
              aria-label="Edit goal"
              className="btn-icon"
              style={{ color: 'var(--text-muted)', padding: '5px' }}
            >
              <Edit2 size={15} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal)}
              aria-label="Delete goal"
              className="btn-icon"
              style={{ color: 'var(--accent-rose)', padding: '5px' }}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Progress & Numbers */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: isCompleted ? '#10B981' : 'var(--text-main)' }}>
            {formatCurrency(current, currency)}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Target: {formatCurrency(target, currency)}
          </span>
        </div>

        <ProgressBar
          value={current}
          max={target}
          color={isCompleted ? '#10B981' : '#6366F1'}
          height="8px"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isCompleted ? 'Goal achieved! 🎉' : `${formatCurrency(Math.max(0, target - current), currency)} remaining`}
          </span>
          <span style={{ fontWeight: 700, color: isCompleted ? '#10B981' : 'var(--primary-600)' }}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Estimation Breakdown */}
      {goal.estimates && !isCompleted && goal.estimates.estimatedWeekly && (
        <div
          style={{
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Est. required weekly:</span>
            <span style={{ fontWeight: 700 }}>{formatCurrency(goal.estimates.estimatedWeekly, currency)}/wk</span>
          </div>
          <span style={{ fontSize: '0.675rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
            *Planning estimation benchmark
          </span>
        </div>
      )}

      {/* Related Tasks Tag */}
      {goal.related_tasks && goal.related_tasks.length > 0 && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          📌 <strong>{goal.related_tasks.length}</strong> related task{goal.related_tasks.length > 1 ? 's' : ''} linked
        </div>
      )}

      {/* Inline Add Contribution */}
      {!isCompleted && (
        <div>
          {showAddInput ? (
            <form onSubmit={handleContribute} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                placeholder="Amount (e.g. 200)"
                step="any"
                className="form-input"
                style={{ padding: '0.4rem 0.65rem', fontSize: '0.85rem', flex: 1 }}
                autoFocus
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddInput(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowAddInput(true)}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Plus size={15} />
              Add Savings Contribution
            </button>
          )}
        </div>
      )}
    </div>
  );
}
