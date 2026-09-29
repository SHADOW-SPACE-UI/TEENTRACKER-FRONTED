import React from 'react';
import { formatDate } from '../utils/formatters';
import { Check, Edit2, Trash2, Calendar, Target, AlertCircle } from 'lucide-react';

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const isCompleted = task.status === 'Completed';

  const priorityClasses = {
    Low: 'badge-low',
    Medium: 'badge-medium',
    High: 'badge-high',
    Urgent: 'badge-urgent'
  };

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
        opacity: isCompleted ? 0.65 : 1,
        transition: 'all var(--transition-fast)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1, minWidth: 0 }}>
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id, !isCompleted)}
          aria-label={isCompleted ? 'Mark uncompleted' : 'Mark completed'}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            border: `2px solid ${isCompleted ? '#10B981' : 'var(--border-color)'}`,
            backgroundColor: isCompleted ? '#10B981' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            marginTop: '2px',
            flexShrink: 0,
            cursor: 'pointer'
          }}
        >
          {isCompleted && <Check size={16} strokeWidth={3} />}
        </button>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                wordBreak: 'break-word'
              }}
            >
              {task.title}
            </h4>

            {/* Priority Badge */}
            <span className={`badge ${priorityClasses[task.priority] || 'badge-medium'}`}>
              {task.priority}
            </span>

            {/* Category Tag */}
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--border-color)',
                color: 'var(--text-muted)',
                fontWeight: 500
              }}
            >
              {task.category}
            </span>
          </div>

          {task.description && (
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem', wordBreak: 'break-word' }}>
              {task.description}
            </p>
          )}

          {/* Badges row: Due date / Overdue / Related Goal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
            {task.due_date && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: task.dueStatus?.isOverdue
                    ? '#F43F5E'
                    : task.dueStatus?.isDueToday
                    ? '#F59E0B'
                    : 'var(--text-muted)',
                  fontWeight: task.dueStatus?.isOverdue || task.dueStatus?.isDueToday ? 700 : 500
                }}
              >
                <Calendar size={13} />
                {task.dueStatus ? task.dueStatus.label : formatDate(task.due_date)}
              </span>
            )}

            {task.related_goal_id && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--primary-600)',
                  fontWeight: 600
                }}
              >
                <Target size={12} />
                Linked Goal
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            className="btn-icon"
            style={{ color: 'var(--text-muted)', padding: '6px' }}
          >
            <Edit2 size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task)}
            aria-label="Delete task"
            className="btn-icon"
            style={{ color: 'var(--accent-rose)', padding: '6px' }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
