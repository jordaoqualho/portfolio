// English is the canonical site at the root; Portuguese lives under /pt.
export const locales = ["en", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (locales as readonly string[]).includes(value);

// <html lang>, hreflang and Open Graph values per locale.
export const localeMeta = {
  en: { lang: "en", hreflang: "en", og: "en_US", label: "English", short: "EN" },
  pt: { lang: "pt-BR", hreflang: "pt-BR", og: "pt_BR", label: "Português", short: "PT" },
} as const satisfies Record<Locale, unknown>;

// Pages that exist only in English (agent and developer docs).
export const englishOnly = ["/agents", "/developers"];

export const LOCALE_COOKIE = "locale";
