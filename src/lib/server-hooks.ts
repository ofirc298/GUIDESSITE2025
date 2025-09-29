// src/lib/server-hooks.ts
import { log } from '@/lib/log'

declare global {
  // כדי לא להתקין פעמיים ב-HMR
  // eslint-disable-next-line no-var
  var __server_hooks_installed: boolean | undefined
}

if (!global.__server_hooks_installed) {
  process.on('unhandledRejection', (reason: any) => {
    log.error('server', 'UNHANDLED_REJECTION', reason)
  })
  process.on('uncaughtException', (err: any) => {
    log.error('server', 'UNCAUGHT_EXCEPTION', err?.stack || err)
  })
  global.__server_hooks_installed = true
}