// src/components/ui/Header.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header style={{ padding: 12 }}>
        <div style={{ opacity: 0 }}>טוען...</div>
      </header>
    );
  }

  return (
    <header style={{ padding: 12 }}>
      <div>
        {loading ? (
          <span>טוען...</span>
        ) : user ? (
          <>
            <span>שלום {user.name ?? user.email ?? "משתמש"}</span>{" "}
            <button onClick={signOut}>התנתק</button>
          </>
        ) : (
          <Link href="/signin">התחבר</Link>
        )}
      </div>
    </header>
  );
}