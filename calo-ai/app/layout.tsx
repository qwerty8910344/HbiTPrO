import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import XpNotification from "@/components/XpNotification";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LifePilot Elite | Your AI Life Coach",
  description: "Improve habits, health, and life decisions with LifePilot AI—your behavioral psychology coach.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#020617] text-slate-200 antialiased selection:bg-neon selection:text-black overflow-x-hidden`}>
        <AppProvider>
          <XpNotification />
          <div className="mx-auto max-w-lg min-h-screen relative shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-[#020617]">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
