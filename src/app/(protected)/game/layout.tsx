import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match Results",
  description: "View your ValoGuess match result and game stats.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
