import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Join ValoGuess to play real-time 1v1 guess-the-agent matches, customize your agent profile, and track your match history.",
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    title: "Sign Up | ValoGuess",
    description:
      "Create your ValoGuess account to play 1v1 Valorant guess-the-agent matches online.",
    url: "/signup",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
