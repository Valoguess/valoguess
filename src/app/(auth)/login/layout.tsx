import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your ValoGuess account to challenge friends, climb the ranks, and compete in real-time 1v1 tactical Valorant agent deduction matches.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Sign In | ValoGuess",
    description:
      "Sign in to your ValoGuess account to challenge friends and play 1v1 tactical Valorant agent deduction.",
    url: "/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
