// True when an Accept header ranks text/markdown at least as high as text/html.
export function prefersMarkdown(accept: string) {
  let markdown = 0;
  let html = 0;
  for (const part of accept.toLowerCase().split(",")) {
    const [type, ...params] = part.split(";").map((s) => s.trim());
    const q = params.find((p) => p.startsWith("q="));
    const weight = q ? Number(q.slice(2)) || 0 : 1;
    if (type === "text/markdown") markdown = weight;
    else if (type === "text/html") html = weight;
  }
  return markdown > 0 && markdown >= html;
}

// Countries where Portuguese is the official language.
const lusophone = new Set(["BR", "PT", "AO", "MZ", "CV", "GW", "ST", "TL"]);

// Picks the visitor's language: whichever of pt or en ranks higher in
// Accept-Language wins; when neither is listed, the IP country decides.
export function negotiateLocale(
  acceptLanguage: string,
  country?: string | null,
): "en" | "pt" {
  let pt = 0;
  let en = 0;
  for (const part of acceptLanguage.toLowerCase().split(",")) {
    const [tag, ...params] = part.split(";").map((s) => s.trim());
    const q = params.find((p) => p.startsWith("q="));
    const weight = q ? Number(q.slice(2)) || 0 : 1;
    const base = tag.split("-")[0];
    if (base === "pt") pt = Math.max(pt, weight);
    else if (base === "en") en = Math.max(en, weight);
  }
  if (pt || en) return pt > en ? "pt" : "en";
  return country && lusophone.has(country.toUpperCase()) ? "pt" : "en";
}

// Crawlers and agents always get the canonical English page, never a redirect.
export function isBot(userAgent: string) {
  return /bot|crawl|spider|slurp|preview|fetch|curl|wget|python|httpx|axios|node|go-http|claude|gpt|anthropic|perplexity|facebookexternalhit|embedly|whatsapp|telegram|discord|slack/i.test(
    userAgent,
  );
}
