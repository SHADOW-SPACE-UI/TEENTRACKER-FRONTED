import React, { useState, useEffect } from 'react';
import { EXPENSE_CATEGORIES } from '../constants';
import { Search, Filter, RotateCcw } from 'lucide-react';

export default function ExpenseFilters({ filters, onFilterChange, onReset }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFilterChange('search', searchTerm);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem'
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', flex: '1 1 220px', minWidth: '200px' }}>
        <Search
          size={16}
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search merchant, description, notes..."
          className="form-input"
          style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
        />
      </div>

      {/* Category Filter */}
      <div style={{ flex: '0 1 160px', minWidth: '140px' }}>
        <select
          value={filters.category || 'All'}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="form-select"
          style={{ height: '38px', fontSize: '0.85rem' }}
        >
          <option value="All">All Categories</option>
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div style={{ flex: '0 1 150px', minWidth: '130px' }}>
        <select
          value={`${filters.sortBy || 'date'}-${filters.sortOrder || 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onFilterChange('sortBy', sortBy);
            onFilterChange('sortOrder', sortOrder);
          }}
          className="form-select"
          style={{ height: '38px', fontSize: '0.85rem' }}
        >
          <option value="date-desc">Newest Date</option>
          <option value="date-asc">Oldest Date</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* Reset button */}
      <button
        type="button"
        onClick={() => {
          setSearchTerm('');
          onReset();
        }}
        className="btn btn-secondary btn-sm"
        style={{ height: '38px' }}
        title="Reset all filters"
      >
        <RotateCcw size={14} />
        Reset
      </button>
    </div>
  );
}
