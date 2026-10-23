import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stem Separator 6 - Demucs",
  description: "Pisah lagu jadi 6 stem: drums, bass, vocals, other, guitar, piano + BPM & Key"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased bg-[#0a0a0a] text-white">{children}</body>
    </html>
  );
}
