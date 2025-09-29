// src/app/ClientErrorReporter.tsx
'use client'
import { useEffect } from 'react'

export default function ClientErrorReporter() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          level: 'error',
          source: 'client',
          message: event.message,
          extra: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack ?? null,
          },
        }),
        keepalive: true,
      })
    }

    const onRejection = (event: PromiseRejectionEvent) => {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          level: 'error',
          source: 'client',
          message: 'Unhandled promise rejection',
          extra: { reason: String(event.reason) },
        }),
        keepalive: true,
      })
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])

  return null
}