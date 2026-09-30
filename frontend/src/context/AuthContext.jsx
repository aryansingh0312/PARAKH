import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const STORAGE_KEY = 'parakh-auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      const activeToken = localStorage.getItem(STORAGE_KEY);

      if (!activeToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe(activeToken);
        setUser(response.user);
        setToken(activeToken);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        setToken('');
      } finally {
        setLoading(false);
      }
    };

    bootstrapSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authService.login(email, password);
    const nextToken = response.token;

    localStorage.setItem(STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(response.user);

    return response;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await authService.register(name, email, password);

    localStorage.setItem(STORAGE_KEY, response.token);
    setToken(response.token);
    setUser(response.user);

    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch {
      // Intentionally ignore logout errors and still clear the client session.
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setToken('');
    }
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token && user),
      loading,
    }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
