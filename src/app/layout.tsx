import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guides Platform",
  description: "App shell",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Server component – do NOT import client hooks here
  return (
    <html lang="he" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}