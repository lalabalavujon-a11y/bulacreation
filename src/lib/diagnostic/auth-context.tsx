import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { getSession, logoutSession } from "./auth.functions";
import { selectLocalAccount } from "./local-storage";
import type { Account } from "../security/types";
interface AuthState {
  account: Account | null;
  contactId: string | null;
  email: string | null;
  name: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  hydrated: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthState | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    try {
      const next = await getSession();
      selectLocalAccount(next?.id ?? null);
      setAccount(next);
      setError(null);
    } catch {
      selectLocalAccount(null);
      setAccount(null);
      setError("Could not check your session. Please try again.");
    } finally {
      setHydrated(true);
    }
  }, []);
  useEffect(() => {
    void refresh();
    const focus = () => {
      void refresh();
    };
    window.addEventListener("focus", focus);
    const timer = window.setInterval(focus, 60000);
    return () => {
      window.removeEventListener("focus", focus);
      window.clearInterval(timer);
    };
  }, [refresh]);
  const logout = useCallback(async () => {
    await logoutSession();
    selectLocalAccount(null);
    setAccount(null);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        account,
        contactId: account?.id ?? null,
        email: account?.email ?? null,
        name: account?.name ?? null,
        isAdmin: account?.role === "admin",
        isAuthenticated: !!account,
        hydrated,
        error,
        refresh,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
