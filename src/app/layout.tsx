import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CodeMate Solved.ac Draft",
  description: "solved.ac handle lookup, bio lookup, recommendation, and solved verification tools.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${headingFont.variable} ${monoFont.variable}`}>
      <body className="font-sans text-ink antialiased">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
