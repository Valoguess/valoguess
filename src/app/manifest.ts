import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ValoGuess — Tactical 1v1 Valorant Guess Who Game",
    short_name: "ValoGuess",
    description:
      "Play ValoGuess: A real-time 1v1 multiplayer deduction game based on Valorant. Pick your secret agent, ask strategic questions, eliminate suspects, and outsmart your opponent!",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#050811",
    theme_color: "#FF4655",
    categories: ["games", "entertainment", "strategy"],
    icons: [
      {
        src: "/logo.webp",
        sizes: "192x192 512x512",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo.webp",
        sizes: "192x192 512x512",
        type: "image/webp",
        purpose: "maskable",
      },
    ],
  };
}
