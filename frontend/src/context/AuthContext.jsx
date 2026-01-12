import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const TOKEN_KEY = 'kontainer_token';
const USER_KEY = 'kontainer_user';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

async function authRequest(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      (Array.isArray(data?.error?.details?.errors) && data.error.details.errors[0]?.message) ||
      `Auth request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse stored auth data', err);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const persistSession = (jwt, userData) => {
    setToken(jwt);
    setUser(userData);
    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authRequest('/api/auth/local', {
        identifier: email,
        password,
      });
      persistSession(data.jwt, data.user);
      // eslint-disable-next-line no-console
      console.log('Auth user:', data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authRequest('/api/auth/local/register', {
        username: name,
        email,
        password,
      });
      persistSession(data.jwt, data.user);
      // eslint-disable-next-line no-console
      console.log('Auth user:', data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
