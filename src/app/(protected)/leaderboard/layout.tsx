import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "See top ranked ValoGuess players, highest win rates, match records, and competitive deduction leaderboards.",
  alternates: {
    canonical: "/leaderboard",
  },
  openGraph: {
    title: "Leaderboard | ValoGuess",
    description:
      "Check out top players and rankings on ValoGuess, the 1v1 tactical Valorant deduction game.",
    url: "/leaderboard",
  },
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
