import { describe, expect, it } from "vitest";
import { GET as llmsRoute } from "@/app/llms.txt/route";
import { GET as mdRoute } from "@/app/md/[[...path]]/route";
import { cases } from "@/data/profile";
import { llmsTxt, markdownFor } from "@/lib/markdown";
import { siteUrl } from "@/lib/site";
import { params, request } from "./helpers";

describe("llms.txt", () => {
  const text = llmsTxt();

  it("follows the llms.txt layout: H1, summary blockquote, H2 sections", () => {
    const lines = text.split("\n");
    expect(lines[0]).toMatch(/^# Jordão Qualho/);
    expect(lines[2]).toMatch(/^> /);
    expect(text).toMatch(/^## Optional$/m);
  });

  it("tells agents when to use the profile and how to call it", () => {
    expect(text).toMatch(/^## When to use this profile$/m);
    expect(text).toMatch(/^## How to call$/m);
    expect(text).toContain(`${siteUrl}/api/job-fit`);
    expect(text).toContain(`${siteUrl}/openapi.json`);
    expect(text).toContain(`${siteUrl}/api/mcp`);
  });

  it("links only to the canonical domain", () => {
    expect(text).not.toContain("vercel.app");
    const links = [...text.matchAll(/\]\((https?:[^)]+)\)/g)].map((m) => m[1]);
    expect(links.length).toBeGreaterThan(5);
    for (const link of links) expect(link.startsWith(siteUrl)).toBe(true);
  });

  it("is served as plain text", () => {
    expect(llmsRoute().headers.get("content-type")).toBe("text/plain; charset=utf-8");
  });
});

describe("Markdown pages", () => {
  it.each(["/", "/agents", "/privacy", "/developers", ...cases.map((c) => `/work/${c.slug}`)])(
    "renders %s",
    (path) => {
      expect(markdownFor(path)).toMatch(/^# /);
    },
  );

  it("documents every API endpoint on the developers page", () => {
    const md = markdownFor("/developers")!;
    for (const path of ["/api/profile", "/api/cases/{slug}", "/api/job-fit"])
      expect(md).toContain(path);
  });

  it("includes what Jordão is looking for and side projects on the homepage", () => {
    const md = markdownFor("/")!;
    expect(md).toContain("What I'm looking for:");
    expect(md).toMatch(/^## Open source & experiments$/m);
    expect(md).toContain("iMemory");
  });

  it("returns null for unknown pages", () => {
    expect(markdownFor("/nope")).toBeNull();
  });

  it("serves Markdown with a canonical link, and a Markdown 404", async () => {
    const found = await mdRoute(request("/md/developers"), params({ path: ["developers"] }));
    expect(found.status).toBe(200);
    expect(found.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(found.headers.get("link")).toBe(`<${siteUrl}/developers/>; rel="canonical"`);
    const missing = await mdRoute(request("/md/nope"), params({ path: ["nope"] }));
    expect(missing.status).toBe(404);
    expect(await missing.text()).toMatch(/^# 404/);
  });
});
