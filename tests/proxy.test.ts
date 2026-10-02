import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { config, proxy } from "@/proxy";
import { prefersMarkdown } from "@/lib/negotiation";

const run = (path: string, accept = "text/html") =>
  proxy(new NextRequest(`https://example.test${path}`, { headers: { accept } }));
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

  it("leaves browsers on HTML", () => {
    const response = run("/developers/");
    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("never runs on API, well-known or asset paths", () => {
    const matcher = new RegExp(`^${config.matcher[0]}$`);
    for (const path of ["/api", "/api/mcp", "/api/cases/x", "/.well-known/api-catalog", "/openapi.json", "/llms.txt", "/portrait.webp"])
      expect(matcher.test(path), path).toBe(false);
    for (const path of ["/", "/developers", "/work/a/", "/index.md", "/apidocs"])
      expect(matcher.test(path), path).toBe(true);
  });
});
