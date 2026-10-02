import type { MetadataRoute } from "next";
import { cases, projects } from "@/data/profile";
import { localePath } from "@/i18n/paths";
import { siteUrl } from "@/lib/site";
export const dynamic = "force-static";

type Entry = MetadataRoute.Sitemap[number];

// Pages that exist in English and Portuguese: one entry per language, each
// listing both versions so search engines pair them.
function bilingual(path: string, priority: number, changeFrequency: Entry["changeFrequency"]) {
  const languages = {
    en: siteUrl + path,
    "pt-BR": siteUrl + localePath("pt", path),
  };
  return [path, localePath("pt", path)].map((url) => ({
    url: siteUrl + url,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...bilingual("/", 1, "monthly"),
    ...cases.flatMap((item) => bilingual(`/work/${item.slug}/`, 0.8, "monthly")),
    ...projects
      .filter((p) => p.detail)
      .flatMap((p) => bilingual(`/projects/${p.slug}/`, 0.6, "monthly")),
    { url: siteUrl + "/agents/", changeFrequency: "monthly", priority: 0.5 },
    { url: siteUrl + "/developers/", changeFrequency: "monthly", priority: 0.5 },
    ...bilingual("/privacy/", 0.2, "yearly"),
  ];
}
