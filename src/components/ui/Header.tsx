// src/components/ui/Header.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Header() {
  const { user, loading, signOut } = useAuth();

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