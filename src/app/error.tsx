"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>אירעה תקלה</h1>
        <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
        <button onClick={() => reset()} style={{ marginTop: 12 }}>נסה שוב</button>
      </body>
    </html>
  );
}