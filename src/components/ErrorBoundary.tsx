// src/components/ErrorBoundary.tsx
"use client";
import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>אירעה תקלה. נסה לרענן את הדף.</div>;
    }
    return this.props.children;
  }
}