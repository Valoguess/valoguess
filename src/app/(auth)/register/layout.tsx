import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Register for ValoGuess to start guessing secret Valorant agents, challenge your friends in real-time parties, and climb the leaderboard.",
  alternates: {
    canonical: "/register",
  },
  openGraph: {
    title: "Register | ValoGuess",
    description:
      "Register for ValoGuess to challenge friends in real-time 1v1 tactical deduction.",
    url: "/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
