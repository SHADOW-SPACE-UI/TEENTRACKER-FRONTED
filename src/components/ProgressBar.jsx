import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'var(--primary-500)',
  height = '8px',
  showLabel = false,
  labelPrefix = ''
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100))) || 0;

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            marginBottom: '0.35rem',
            fontWeight: 600
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>{labelPrefix}</span>
          <span style={{ color: 'var(--text-main)' }}>{percentage}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          backgroundColor: 'var(--border-color)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s ease-out'
          }}
        />
      </div>
    </div>
  );
}
