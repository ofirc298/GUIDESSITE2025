// src/components/util/ClientErrorBoundary.tsx
'use client'
import React from 'react'

export class ClientErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error?: Error }
> {
  constructor(props: any) { 
    super(props); 
    this.state = {} 
  }
  
  static getDerivedStateFromError(error: Error) { 
    return { error } 
  }
  
  componentDidCatch(error: Error, info: any) {
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        level: 'error',
        source: 'client',
        message: error.message,
        extra: { stack: error.stack, info },
      }),
      keepalive: true,
    })
  }
  
  render() {
    if (this.state.error) {
      return (
        <div style={{ 
          padding: 16, 
          textAlign: 'center',
          background: 'var(--error-500)',
          color: 'white',
          borderRadius: 'var(--radius-md)',
          margin: 'var(--spacing-4)'
        }}>
          אופס... משהו נשבר. נסו לרענן את הדף.
        </div>
      )
    }
    return this.props.children
  }
}