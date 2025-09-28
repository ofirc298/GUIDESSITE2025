"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, loading, login, logout } = useAuth();

  return (
    <header style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
      <strong>Guides</strong>
      <div style={{ marginInlineStart: "auto" }}>
        {loading ? (
          <span>טוען…</span>
        ) : user ? (
          <>
            <span style={{ marginInlineEnd: 8 }}>{user.email}</span>
            <button onClick={logout}>התנתק</button>
          </>
        ) : (
          <button onClick={() => login("demo@example.com", "password")}>התחבר</button>
        )}
      </div>
    </header>
  );
}