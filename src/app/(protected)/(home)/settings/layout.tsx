import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings & Profile",
  description:
    "Customize your ValoGuess agent banner, tactical tagline, display name, and account preferences.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
