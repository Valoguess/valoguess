import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lobby",
  description:
    "ValoGuess match lobby. Join parties, invite online friends, configure game modes, and challenge opponents in 1v1 Valorant agent guessing matches.",
  alternates: {
    canonical: "/lobby",
  },
  openGraph: {
    title: "Lobby | ValoGuess",
    description:
      "Join match lobbies and challenge friends to real-time 1v1 Valorant guess-the-agent matches.",
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
