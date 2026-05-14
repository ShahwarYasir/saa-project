import { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('saa_access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('saa_user');
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch { setUser(null); }
      }
    }
    setLoading(false);
  }, [token]);

  const login = useCallback((tokenValue, userData) => {
    localStorage.setItem('saa_access_token', tokenValue);
    localStorage.setItem('saa_user', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('saa_access_token');
    localStorage.removeItem('saa_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
