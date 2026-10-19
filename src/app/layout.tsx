import type { Metadata, Viewport } from "next";
import { Rajdhani, Inter } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
import { AuthInitializer } from "@/components/AuthInitializer";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const viewport: Viewport = {
  themeColor: "#FF4655",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const SITE_URL = "https://valoguess.fun";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ValoGuess — The Tactical 1v1 Valorant Guess Who Game",
    template: "%s | ValoGuess",
  },
  description:
    "Play ValoGuess: A real-time 1v1 multiplayer deduction game based on Valorant. Pick your secret agent, ask strategic questions, eliminate suspects, and outsmart your opponent!",
  applicationName: "ValoGuess",
  authors: [{ name: "ValoGuess", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "ValoGuess",
    "valoguess.fun",
    "Valorant Guess Who",
    "Valorant guessing game",
    "Valorant trivia",
    "Valorant 1v1 duel",
    "Valorant agent guesser",
    "Valorant mini game",
    "tactical guessing game",
    "online deduction game",
    "guess the secret agent",
    "Valorant agents game",
  ],
  referrer: "origin-when-cross-origin",
  creator: "ValoGuess",
  publisher: "ValoGuess",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ValoGuess — The Tactical 1v1 Valorant Guess Who Game",
    description:
      "Challenge friends in real-time 1v1 tactical deduction! Ask strategic questions, narrow down agent abilities, and guess the secret agent before your opponent does.",
    url: SITE_URL,
    siteName: "ValoGuess",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "ValoGuess - Tactical 1v1 Valorant Guess Who Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ValoGuess — The Tactical 1v1 Valorant Guess Who Game",
    description:
      "Play 1v1 tactical agent deduction online on valoguess.fun! Ask questions, eliminate suspects, and guess your opponent's secret agent.",
    images: ["/logo.webp"],
    creator: "@valoguess",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.webp", sizes: "32x32", type: "image/webp" },
      { url: "/logo.webp", sizes: "192x192", type: "image/webp" },
    ],
    apple: [{ url: "/logo.webp", sizes: "180x180", type: "image/webp" }],
  },
  manifest: "/manifest.webmanifest",
  category: "game",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "ValoGuess",
      description:
        "The ultimate multiplayer 1v1 tactical deduction game inspired by Valorant.",
      publisher: {
        "@type": "Organization",
        name: "ValoGuess",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.webp`,
        },
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      url: SITE_URL,
      name: "ValoGuess",
      applicationCategory: "GameApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Online multiplayer 1v1 deduction game where players ask strategic yes/no questions to uncover their opponent's secret Valorant agent.",
    },
    {
      "@type": "VideoGame",
      "@id": `${SITE_URL}/#game`,
      name: "ValoGuess",
      url: SITE_URL,
      genre: ["Multiplayer", "Trivia", "Strategy", "Guess Who", "Deduction"],
      gamePlatform: ["Web Browser", "PC", "Mobile"],
      numberOfPlayers: {
        "@type": "QuantitativeValue",
        minValue: 2,
        maxValue: 2,
      },
      playMode: "MultiPlayer",
    },
    {
      "@type": "HowTo",
      "name": "How to Play ValoGuess",
      "description":
        "Learn how to play the 1v1 tactical deduction game inspired by Valorant.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Create or Join a Match",
          "text": "Join a party with a friend or opponent and launch a tactical 1v1 duel.",
        },
        {
          "@type": "HowToStep",
          "name": "Receive Your Secret Agent",
          "text": "Each player receives a hidden Valorant agent that the other player must deduce.",
        },
        {
          "@type": "HowToStep",
          "name": "Ask Strategic Questions",
          "text": "Take turns asking yes/no questions about roles, abilities, and characteristics to eliminate suspects on your grid.",
        },
        {
          "@type": "HowToStep",
          "name": "Lock In Your Final Guess",
          "text": "Identify your opponent's secret agent and submit your final guess to win the match.",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(rajdhani.variable, inter.variable, "font-sans", "dark")}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preload" href="/valorant.ttf" as="font" type="font/truetype" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased bg-[#050811] text-white">
        <AuthInitializer>
          {children}
          <Toaster />
        </AuthInitializer>
      </body>
    </html>
  );
}
