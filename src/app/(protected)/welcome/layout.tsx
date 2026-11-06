import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Set up your player profile and choose your username on ValoGuess.",
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
