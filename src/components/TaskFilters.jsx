import React from 'react';
import { TASK_CATEGORIES } from '../constants';

export default function TaskFilters({ activeFilter, onFilterChange, selectedCategory, onCategoryChange, sortBy, onSortChange }) {
  const filterPills = [
    { key: 'All', label: 'All' },
    { key: 'Today', label: 'Due Today' },
    { key: 'Upcoming', label: 'Upcoming' },
    { key: 'Overdue', label: 'Overdue' },
    { key: 'High Priority', label: 'High Priority' },
    { key: 'Completed', label: 'Completed' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
      {/* Quick Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
        {filterPills.map((pill) => {
          const isActive = activeFilter === pill.key;
          return (
            <button
              key={pill.key}
              onClick={() => onFilterChange(pill.key)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                backgroundColor: isActive ? 'var(--primary-600)' : 'var(--bg-card)',
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                border: `1px solid ${isActive ? 'var(--primary-600)' : 'var(--border-color)'}`,
                transition: 'all var(--transition-fast)'
              }}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Category and Sort Row */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={selectedCategory || 'All'}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="form-select"
            style={{ height: '36px', fontSize: '0.825rem', padding: '0 0.75rem' }}
          >
            <option value="All">All Categories</option>
            {TASK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="form-select"
            style={{ height: '36px', fontSize: '0.825rem', padding: '0 0.75rem' }}
          >
            <option value="due_date">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>
        </div>
      </div>
    </div>
  );
}
