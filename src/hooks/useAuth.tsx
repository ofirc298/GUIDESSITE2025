"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = { id: string; email: string } | null;

export type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = typeof window !== "undefined" ? localStorage.getItem("demo-user") : null;
        if (!cancelled) setUser(saved ? JSON.parse(saved) : null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, _password: string) => {
    const next = { id: "1", email };
    localStorage.setItem("demo-user", JSON.stringify(next));
    setUser(next);
  };

  const logout = async () => {
    localStorage.removeItem("demo-user");
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // This error is intentional to surface mis-wiring
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}