import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lobby",
  description:
    "ValoGuess match lobby. Join parties, invite online friends, configure game modes, and prepare for tactical 1v1 agent deduction duels.",
  alternates: {
    canonical: "/lobby",
  },
  openGraph: {
    title: "Lobby | ValoGuess",
    description:
      "Join match lobbies and challenge friends in real-time tactical 1v1 Valorant agent deduction.",
    url: "/lobby",
  },
};

export default function LobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
