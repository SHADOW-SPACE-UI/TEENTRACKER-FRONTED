import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  CheckSquare,
  BarChart3,
  Plus
} from 'lucide-react';

export default function MobileNavbar({ onQuickExpense }) {
  const navItems = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/expenses', label: 'Expenses', icon: Receipt },
    { to: '/budget', label: 'Budget', icon: Wallet },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/analytics', label: 'Insights', icon: BarChart3 }
  ];

  return (
    <nav
      className="glass-panel"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'var(--bg-glass)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 900,
        borderRadius: 0,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              fontSize: '0.675rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--primary-600)' : 'var(--text-muted)'
            })}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      {/* Floating Center Plus Action on Mobile */}
      <button
        onClick={onQuickExpense}
        aria-label="Quick add expense"
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
          transform: 'translateY(-12px)'
        }}
      >
        <Plus size={22} />
      </button>
    </nav>
  );
}
