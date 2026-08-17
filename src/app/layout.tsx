import type { Metadata, Viewport } from "next";
import { Rajdhani, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SocketProvider from "@/components/SocketProvider";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        url: "/logo.png",
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
    images: ["/logo.png"],
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
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
  category: "game",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "ValoGuess",
      "description":
        "The ultimate multiplayer 1v1 tactical deduction game inspired by Valorant.",
      "publisher": {
        "@type": "Organization",
        "name": "ValoGuess",
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/logo.png`,
        },
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      "url": SITE_URL,
      "name": "ValoGuess",
      "applicationCategory": "GameApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description":
        "Online multiplayer 1v1 deduction game where players ask strategic yes/no questions to uncover their opponent's secret Valorant agent.",
    },
    {
      "@type": "VideoGame",
      "@id": `${SITE_URL}/#game`,
      "name": "ValoGuess",
      "url": SITE_URL,
      "genre": [
        "Multiplayer",
        "Trivia",
        "Strategy",
        "Guess Who",
        "Deduction",
      ],
      "gamePlatform": ["Web Browser", "PC", "Mobile"],
      "numberOfPlayers": {
        "@type": "QuantitativeValue",
        "minValue": 2,
        "maxValue": 2,
      },
      "playMode": "MultiPlayer",
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
      </head>
      <body className="font-body antialiased bg-[#050811] text-white">
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
