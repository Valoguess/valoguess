import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/lobby", "/leaderboard", "/login", "/signup", "/register"],
        disallow: [
          "/play/",
          "/play",
          "/game/",
          "/game",
          "/api/",
          "/settings",
          "/history",
          "/welcome",
        ],
      },
    ],
    sitemap: "https://valoguess.fun/sitemap.xml",
    host: "https://valoguess.fun",
  };
}
