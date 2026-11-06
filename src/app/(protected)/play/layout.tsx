import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play",
  description: "Guess the agent 1v1 match on ValoGuess.",
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
