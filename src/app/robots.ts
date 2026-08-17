import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/play/", "/api/"],
      },
    ],
    sitemap: "https://valoguess.fun/sitemap.xml",
    host: "https://valoguess.fun",
  };
}
