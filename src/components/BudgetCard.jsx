import React from 'react';
import ProgressBar from './ProgressBar';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { Wallet, AlertCircle, Edit3 } from 'lucide-react';

export default function BudgetCard({ budgetData, currency = 'INR', onEditBudget }) {
  if (!budgetData || !budgetData.hasBudget) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-card)',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem'
          }}
        >
          <Wallet size={24} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          No Budget Set for {budgetData?.month || 'This Month'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Create a monthly budget to plan spending, keep track of limits, and boost your savings.
        </p>
        <button onClick={onEditBudget} className="btn btn-primary btn-sm">
          Set Monthly Budget
        </button>
      </div>
    );
  }

  const { totalBudget, totalSpent, categories } = budgetData;
  const remaining = Math.max(0, totalBudget - totalSpent);
  const totalPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const isOverBudget = totalSpent > totalBudget;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Monthly Budget Overview ({budgetData.month})
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              {formatCurrency(totalSpent, currency)}
            </span>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              of {formatCurrency(totalBudget, currency)}
            </span>
          </div>
        </div>

        <button onClick={onEditBudget} className="btn btn-secondary btn-sm" title="Edit Budget">
          <Edit3 size={15} />
          Edit Budget
        </button>
      </div>

      {/* Main Budget Progress */}
      <div>
        <ProgressBar
          value={totalSpent}
          max={totalBudget}
          color={isOverBudget ? '#F43F5E' : totalPercentage >= 80 ? '#F59E0B' : 'var(--primary-600)'}
          height="10px"
          showLabel
          labelPrefix={`${totalPercentage}% used • ${formatCurrency(remaining, currency)} remaining`}
        />

        {/* Gentle Notice */}
        {isOverBudget ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '0.5rem',
              color: '#F43F5E',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <AlertCircle size={14} />
            <span>Your overall spending is {formatCurrency(totalSpent - totalBudget, currency)} above the monthly budget.</span>
          </div>
        ) : totalPercentage >= 80 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '0.5rem',
              color: '#D97706',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <AlertCircle size={14} />
            <span>You're approaching your monthly budget limit. Pace yourself for the remaining days!</span>
          </div>
        ) : null}
      </div>

      {/* Category Budgets */}
      {categories && categories.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Category Allocations
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {categories.map((cat) => {
              const catColor = getCategoryColor(cat.category);
              const isCatOver = cat.spent > cat.budget;

              return (
                <div
                  key={cat.category}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.825rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.category}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {formatCurrency(cat.spent, currency)} / {formatCurrency(cat.budget, currency)}
                    </span>
                  </div>

                  <ProgressBar
                    value={cat.spent}
                    max={cat.budget}
                    color={isCatOver ? '#F43F5E' : cat.percentage >= 80 ? '#F59E0B' : catColor}
                    height="6px"
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.725rem' }}>
                    <span style={{ color: isCatOver ? '#F43F5E' : 'var(--text-muted)' }}>
                      {isCatOver
                        ? `${formatCurrency(cat.spent - cat.budget, currency)} over`
                        : `${formatCurrency(cat.remaining, currency)} left`}
                    </span>
                    <span style={{ fontWeight: 600, color: isCatOver ? '#F43F5E' : 'var(--text-muted)' }}>
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
