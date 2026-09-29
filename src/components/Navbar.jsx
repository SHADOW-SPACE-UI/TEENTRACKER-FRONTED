import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Flame, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ currentStreak = 0, streakDisabled = false }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>TeenTrack</h1>
        <span
          style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-700)',
            fontWeight: 600
          }}
        >
          {user?.currency || 'INR'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Productivity Streak badge */}
        {!streakDisabled && (
          <div
            title="Daily task completion streak"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: currentStreak > 0 ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-card-hover)',
              color: currentStreak > 0 ? '#D97706' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            <Flame size={16} color={currentStreak > 0 ? '#F59E0B' : 'var(--text-muted)'} fill={currentStreak > 0 ? '#F59E0B' : 'none'} />
            <span>{currentStreak} day streak</span>
          </div>
        )}

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="btn-icon"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
        >
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <Link to="/profile" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'Teen'}`}
            alt="User avatar"
            style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1.5px solid var(--border-color)' }}
          />
        </Link>
      </div>
    </header>
  );
}
