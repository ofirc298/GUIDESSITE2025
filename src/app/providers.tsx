// src/app/providers.tsx
"use client";

import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary"; // אם שמור במקום אחר, עדכן נתיב
import { AuthProvider } from "@/hooks/useAuth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>{children}</AuthProvider>
    </ErrorBoundary>
  );
}