import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

const bodyFont = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body"
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "POS + Stock + Report",
  description: "Offline-first POS for small businesses",
  manifest: "/manifest.json",
  themeColor: "#3d5a80"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="font-body">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
