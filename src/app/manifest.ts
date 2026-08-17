import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ValoGuess - The Tactical Valorant Guess Who Game",
    short_name: "ValoGuess",
    description:
      "Play ValoGuess: A real-time 1v1 multiplayer deduction game inspired by Valorant. Ask strategic questions, narrow down agent abilities, and guess the secret agent.",
    start_url: "/",
    display: "standalone",
    background_color: "#050811",
    theme_color: "#FF4655",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192 512x512",
        type: "image/png",
      },
    ],
  };
}
