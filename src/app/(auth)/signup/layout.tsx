import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Join ValoGuess to compete in real-time 1v1 tactical deduction matches, customize your agent profile, and track your match history.",
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    title: "Sign Up | ValoGuess",
    description:
      "Create your ValoGuess account to play tactical 1v1 Valorant agent deduction duels online.",
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
