import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tactical Match",
  description: "Live 1v1 tactical Valorant agent deduction duel on ValoGuess.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
