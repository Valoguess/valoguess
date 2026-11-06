import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ValoGuess — 1v1 Valorant Guess the Agent Game",
    short_name: "ValoGuess",
    description:
      "Play ValoGuess: A real-time 1v1 multiplayer guess-the-agent game based on Valorant. Pick your secret agent, ask questions, eliminate agents, and guess who your opponent picked!",
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
