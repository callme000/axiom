import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AXIOM // Strategic Wealth Intelligence",
  description: "Bespoke Liquidity Architecture & Structural Solvency Engine",
};

import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-foreground selection:bg-white selection:text-black relative">
        {/* Global Texture Overlays */}
        <div className="fixed inset-0 pointer-events-none z-50 bg-noise mix-blend-overlay opacity-[0.03]" />
        <div className="fixed inset-0 pointer-events-none z-0 bg-grid-white opacity-[0.02]" />
        
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
