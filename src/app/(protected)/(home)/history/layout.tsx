import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match History",
  description:
    "Review your recent ValoGuess match timeline, questions asked, opponent clues, and win/loss records.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
