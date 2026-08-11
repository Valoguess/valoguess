import type { Metadata } from "next";
import { Rajdhani, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SocketProvider from "@/components/SocketProvider";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Guess the Agent — 1v1 Duel",
  description: "A Valorant-inspired 1v1 agent-guessing duel game.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(rajdhani.variable, inter.variable, "font-sans", "dark")}>
      <body className="font-body antialiased">
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}

