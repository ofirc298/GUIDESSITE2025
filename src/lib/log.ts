type Level = "debug" | "info" | "warn" | "error";
const enabled = process.env.NODE_ENV !== "production" || process.env.LOG_LEVEL === "debug";

function stamp(level: Level, scope: string, msg: string, extra?: any) {
  const ts = new Date().toISOString();
  const base = `[${ts}] ${level.toUpperCase()} [${scope}] ${msg}`;
  if (!enabled) return;
  if (extra !== undefined) console[level === "debug" ? "log" : level](base, extra);
  else console[level === "debug" ? "log" : level](base);
}

export const log = {
  debug: (s: string, m: string, e?: any) => stamp("debug", s, m, e),
  info:  (s: string, m: string, e?: any) => stamp("info",  s, m, e),
  warn:  (s: string, m: string, e?: any) => stamp("warn",  s, m, e),
  error: (s: string, m: string, e?: any) => stamp("error", s, m, e),
};