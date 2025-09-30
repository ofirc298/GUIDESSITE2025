```tsx
'use client'
import React from 'react'

export default class ErrorBoundary extends React.Component<
  { fallback?: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: any, info: any) {
    // אל תזרוק; דיווח ישלח ע"י ClientErrorReporter
    console.error('Boundary caught:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div style={{padding:16}}>אירעה שגיאה. טוען מחדש…</div>
    }
    return this.props.children
  }
}
```