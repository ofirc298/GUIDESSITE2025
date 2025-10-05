// src/components/ui/Header.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header style={{ padding: 12 }} suppressHydrationWarning>
      <div suppressHydrationWarning>
        {loading ? (
          "טוען..."
        ) : user ? (
          <>
            <span>שלום {user.name ?? "משתמש"}</span>{" "}
            <button onClick={signOut}>התנתק</button>
          </>
        ) : (
          <a href="/signin">התחבר</a>
        )}
      </div>
    </header>
  );
}