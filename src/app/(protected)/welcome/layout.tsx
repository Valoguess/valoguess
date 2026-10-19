import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome Recruit",
  description: "Set up your agent callsign and initialize your ValoGuess tactical dossier.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
