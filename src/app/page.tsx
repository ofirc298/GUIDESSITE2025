import Header from "@/components/ui/Header";

export default function HomePage() {
  // Server page rendering a client Header is OK
  return (
    <main style={{ padding: 16 }}>
      <Header />
      <h1 style={{ marginTop: 16 }}>ברוך הבא</h1>
      <p>זוהי דוגמת אפליקציה עם קונטקסט התחברות.</p>
    </main>
  );
}