import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { User, Sun, Moon, Laptop, ShieldCheck, Flame, Save, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [monthlyAllowance, setMonthlyAllowance] = useState(user?.monthly_allowance || '');
  const [savingsTarget, setSavingsTarget] = useState(user?.savings_target || '');
  const [streakDisabled, setStreakDisabled] = useState(user?.streak_disabled || false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        currency,
        monthly_allowance: Number(monthlyAllowance || 0),
        savings_target: Number(savingsTarget || 0),
        streak_disabled: Boolean(streakDisabled)
      });
      toast.success('Profile and preferences updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Profile & Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Manage your personal preferences, primary currency, and productivity displays.
        </p>
      </div>

      <div
        className="glass-panel"
        style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-card)'
        }}
      >
        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'Teen'}`}
            alt="User avatar"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '2px solid var(--primary-500)',
              boxShadow: 'var(--shadow-md)'
            }}
          />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{user?.name || 'Explorer'}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</p>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: '#10B981',
                fontWeight: 600,
                marginTop: '4px'
              }}
            >
              <ShieldCheck size={14} /> Verified TeenTrack Account
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="form-select"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Allowance (₹)</label>
              <input
                type="number"
                value={monthlyAllowance}
                onChange={(e) => setMonthlyAllowance(e.target.value)}
                placeholder="4500"
                step="any"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Overall Savings Target</label>
            <input
              type="number"
              value={savingsTarget}
              onChange={(e) => setSavingsTarget(e.target.value)}
              placeholder="10000"
              step="any"
              className="form-input"
            />
          </div>

          {/* Theme Preference */}
          <div className="form-group">
            <label className="form-label">Display Appearance</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setTheme('light')}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${theme === 'light' ? 'var(--primary-600)' : 'var(--border-color)'}`,
                  backgroundColor: theme === 'light' ? 'var(--primary-50)' : 'var(--bg-main)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  color: theme === 'light' ? 'var(--primary-600)' : 'var(--text-muted)'
                }}
              >
                <Sun size={20} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${theme === 'dark' ? 'var(--primary-600)' : 'var(--border-color)'}`,
                  backgroundColor: theme === 'dark' ? 'var(--primary-50)' : 'var(--bg-main)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  color: theme === 'dark' ? 'var(--primary-600)' : 'var(--text-muted)'
                }}
              >
                <Moon size={20} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${theme === 'system' ? 'var(--primary-600)' : 'var(--border-color)'}`,
                  backgroundColor: theme === 'system' ? 'var(--primary-50)' : 'var(--bg-main)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  color: theme === 'system' ? 'var(--primary-600)' : 'var(--text-muted)'
                }}
              >
                <Laptop size={20} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>System</span>
              </button>
            </div>
          </div>

          {/* Productivity Streak Toggle (Non-manipulative teen wellness option) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Flame size={20} color="#F59E0B" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Daily Streak Display</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Disable if daily streaks cause unnecessary pressure
                </div>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={streakDisabled}
                onChange={(e) => setStreakDisabled(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
              />
              <span style={{ fontSize: '0.8rem', marginLeft: '6px', color: 'var(--text-muted)' }}>
                Hide Streaks
              </span>
            </label>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={logout}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--accent-rose)' }}
            >
              <LogOut size={16} />
              Sign Out
            </button>

            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={16} />
              {saving ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
