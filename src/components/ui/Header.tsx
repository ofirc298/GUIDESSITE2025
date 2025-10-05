// src/components/ui/Header.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header style={{ padding: 12 }} suppressHydrationWarning>
      {isClient ? (
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
      ) : (
        <div style={{ height: '24px' }}></div>
      )}
    </header>
  );
}