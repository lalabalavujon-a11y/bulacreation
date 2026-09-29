// Client-side auth context. Identity is established at login by upserting a
// CRM contact (email + name) via the `loginContact` server function, which
// returns a stable contactId. The session is persisted to localStorage so the
// user stays signed in across reloads. No password — email-identity only.
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export interface AuthUser {
  contactId: string;
  email: string;
  name: string;
  source: "crm" | "local";
}

interface AuthState {
  contactId: string | null;
  email: string | null;
  name: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const LS_KEY = "creation-auth-v1";
const AuthContext = createContext<AuthState | null>(null);

function load(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(load());
    setHydrated(true);
  }, []);

  const login = useCallback((u: AuthUser) => {
    setUser(u);
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(u));
    } catch {
      /* ignore quota */
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(LS_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value: AuthState = {
    contactId: user?.contactId ?? null,
    email: user?.email ?? null,
    name: user?.name ?? null,
    isAuthenticated: !!user,
    hydrated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
