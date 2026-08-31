import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { adminLogin, adminGetMe } from "../api/api";

const STORAGE_KEY = "admin_token";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(STORAGE_KEY) || "");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    adminGetMe(token)
      .then((me) => {
        if (!cancelled) setAdmin(me);
      })
      .catch(() => {
        if (!cancelled) {
          setToken("");
          window.localStorage.removeItem(STORAGE_KEY);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async (email, password) => {
    setError("");
    const res = await adminLogin(email, password);
    window.localStorage.setItem(STORAGE_KEY, res.token);
    setToken(res.token);
    setAdmin(res.admin);
    return res;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken("");
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({ token, admin, loading, error, setError, login, logout, isAuthenticated: Boolean(token && admin) }),
    [token, admin, loading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
