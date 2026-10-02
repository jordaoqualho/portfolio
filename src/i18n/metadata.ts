import type { Metadata } from "next";
import { localeMeta, type Locale } from "./config";
import { localePath } from "./paths";

// Canonical and hreflang links for a page that exists in both languages.
// `path` is the English path ("/", "/work/x/").
export function localeAlternates(
  locale: Locale,
  path: string,
  markdown?: string,
): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: {
      en: path,
      "pt-BR": localePath("pt", path),
      "x-default": path,
    },
    ...(markdown ? { types: { "text/markdown": markdown } } : {}),
  };
}

export const ogLocale = (locale: Locale) => ({
  locale: localeMeta[locale].og,
  alternateLocale: locale === "en" ? localeMeta.pt.og : localeMeta.en.og,
});
