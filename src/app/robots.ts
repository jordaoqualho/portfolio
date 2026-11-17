import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/interno/", "/pt/interno/"],
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "PerplexityBot",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: ["/interno/", "/pt/interno/"],
      },
      {
        userAgent: ["Bytespider", "CCBot", "PetalBot"],
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
