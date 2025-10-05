// src/hooks/useAuth.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = { id: string; name?: string; email?: string; role?: string } | null;
type AuthCtx = {
  user: User;
  loading: boolean;
  signIn: (data?: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let aborted = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const { user } = await res.json();
        if (!aborted) setUser(user ?? null);
      } catch {
        if (!aborted) setUser(null);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  const signIn = async (body?: any) => {
    await fetch("/api/auth/signin", { method: "POST", body: JSON.stringify(body) });
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    const { user } = await res.json();
    setUser(user ?? null);
  };

  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
  };

  const value = useMemo<AuthCtx>(() => ({ user, loading, signIn, signOut }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}