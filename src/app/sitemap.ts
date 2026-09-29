import type { MetadataRoute } from "next";
import { cases } from "@/data/profile";
import { siteUrl } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl + "/", changeFrequency: "monthly", priority: 1 },
    ...cases.map((item) => ({
      url: `${siteUrl}/work/${item.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: siteUrl + "/agents/", changeFrequency: "monthly", priority: 0.5 },
    { url: siteUrl + "/privacy/", changeFrequency: "yearly", priority: 0.2 },
  ];
}
