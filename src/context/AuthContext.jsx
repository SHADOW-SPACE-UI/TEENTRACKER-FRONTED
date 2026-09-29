import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('teentrack_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('teentrack_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication
  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('teentrack_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('teentrack_token', res.data.token);
      localStorage.setItem('teentrack_user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const register = async ({ name, email, password, currency = 'INR' }) => {
    const res = await authService.register({ name, email, password, currency });
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('teentrack_token', res.data.token);
      localStorage.setItem('teentrack_user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const updateProfile = async (updates) => {
    const res = await authService.updateProfile(updates);
    if (res.success && res.data) {
      setUser(res.data);
      localStorage.setItem('teentrack_user', JSON.stringify(res.data));
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        register,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
