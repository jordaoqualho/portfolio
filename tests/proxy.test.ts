import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { config, proxy } from "@/proxy";
import { isBot, negotiateLocale, prefersMarkdown } from "@/lib/negotiation";
import { localePath, switchLocale } from "@/i18n/paths";

const run = (path: string, accept = "text/html", headers: Record<string, string> = {}) =>
  proxy(new NextRequest(`https://example.test${path}`, { headers: { accept, ...headers } }));
const rewrite = (response: Response) =>
  new URL(response.headers.get("x-middleware-rewrite")!).pathname;

describe("prefersMarkdown", () => {
  it.each([
    ["text/markdown", true],
    ["text/markdown, text/html;q=0.9, */*;q=0.8", true],
    ["text/html, text/markdown", true],
    ["text/html,application/xhtml+xml,*/*;q=0.8", false],
    ["text/html, text/markdown;q=0.5", false],
    ["text/markdown;q=0", false],
    ["*/*", false],
    ["", false],
  ])("%j → %s", (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });
});

describe("proxy", () => {
  it("adds the trailing slash to pages, keeping the query", () => {
    const response = run("/privacy?ref=x");
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://example.test/privacy/?ref=x");
  });

  it("rewrites .md URLs to their Markdown twin", () => {
    expect(rewrite(run("/work/live-commerce-traffic-spike.md"))).toBe(
      "/md/work/live-commerce-traffic-spike",
    );
    expect(rewrite(run("/index.md"))).toBe("/md");
  });

  it("serves Markdown to agents that ask for it", () => {
    expect(rewrite(run("/developers/", "text/markdown"))).toBe("/md/developers");
  });

  it("serves English HTML from the [lang] tree without changing the URL", () => {
    expect(rewrite(run("/developers/"))).toBe("/en/developers/");
    expect(rewrite(run("/"))).toBe("/en/");
  });

  it("never runs on API, well-known or asset paths", () => {
    const matcher = new RegExp(`^${config.matcher[0]}$`);
    for (const path of ["/api", "/api/mcp", "/api/cases/x", "/.well-known/api-catalog", "/openapi.json", "/llms.txt", "/portrait.webp"])
      expect(matcher.test(path), path).toBe(false);
    for (const path of ["/", "/developers", "/work/a/", "/index.md", "/apidocs"])
      expect(matcher.test(path), path).toBe(true);
  });
});

describe("negotiateLocale", () => {
  it.each([
    ["pt-BR,pt;q=0.9,en;q=0.8", null, "pt"],
    ["en-US,en;q=0.9,pt;q=0.5", "BR", "en"],
    ["es-ES,es;q=0.9", "BR", "pt"],
    ["es-ES,es;q=0.9", "AR", "en"],
    ["", "PT", "pt"],
    ["", null, "en"],
  ])("%j from %s → %s", (accept, country, expected) => {
    expect(negotiateLocale(accept, country)).toBe(expected);
  });
});

describe("locale routing", () => {
  const browser = "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/140 Safari/537.36";

  it("sends Portuguese browsers to /pt", () => {
    const response = run("/work/x/", "text/html", { "accept-language": "pt-BR", "user-agent": browser });
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.test/pt/work/x/");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("uses the country when the browser lists neither language", () => {
    const response = run("/", "text/html", { "accept-language": "es", "x-vercel-ip-country": "BR", "user-agent": browser });
    expect(response.headers.get("location")).toBe("https://example.test/pt/");
  });

  it("lets a saved choice win over the browser language", () => {
    const response = run("/", "text/html", { "accept-language": "pt-BR", cookie: "locale=en", "user-agent": browser });
    expect(rewrite(response)).toBe("/en/");
  });

  it("never redirects bots and agents", () => {
    expect(isBot("Googlebot/2.1")).toBe(true);
    const response = run("/", "text/html", { "accept-language": "pt-BR", "user-agent": "Googlebot/2.1" });
    expect(rewrite(response)).toBe("/en/");
  });

  it("keeps /en out of public URLs and English-only docs out of /pt", () => {
    expect(run("/en/work/x/").headers.get("location")).toBe("https://example.test/work/x/");
    expect(run("/pt/agents/").headers.get("location")).toBe("https://example.test/agents/");
  });

  it("serves /pt pages directly and English Markdown under /pt", () => {
    expect(run("/pt/work/x/").headers.get("x-middleware-next")).toBe("1");
    expect(rewrite(run("/pt/work/x.md"))).toBe("/md/work/x");
  });
});

describe("locale paths", () => {
  it("prefixes internal paths for Portuguese only", () => {
    expect(localePath("pt", "/")).toBe("/pt/");
    expect(localePath("pt", "/#work")).toBe("/pt/#work");
    expect(localePath("pt", "/work/x/")).toBe("/pt/work/x/");
    expect(localePath("pt", "/agents/")).toBe("/agents/");
    expect(localePath("pt", "https://example.com")).toBe("https://example.com");
    expect(localePath("en", "/work/x/")).toBe("/work/x/");
  });

  it("switches the current page between languages", () => {
    expect(switchLocale("/pt/projects/roundkeep/", "en")).toBe("/projects/roundkeep/");
    expect(switchLocale("/projects/roundkeep/", "pt")).toBe("/pt/projects/roundkeep/");
    expect(switchLocale("/pt/", "en")).toBe("/");
  });
});
