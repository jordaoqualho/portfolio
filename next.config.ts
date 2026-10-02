import type { NextConfig } from "next";
const config: NextConfig = {
  // output: "export" is removed to enable dynamic API Route Handlers (/api/mcp) on Vercel.
  // Static pages remain 100% pre-rendered at build time.
  trailingSlash: true,
  // src/proxy.ts adds the trailing slash to pages only, so /api/mcp answers
  // POSTs directly instead of 308-redirecting MCP clients.
  skipTrailingSlashRedirect: true,
  images: { unoptimized: true },
  devIndicators: false,
  agentRules: false,
  // The root layout sits under app/[lang], so unmatched URLs need a 404 that
  // does not depend on it (app/global-not-found.tsx).
  experimental: { globalNotFound: true },
  // Conventional docs URLs lead to the developer portal.
  async redirects() {
    const docs = ["/docs", "/docs/", "/developer", "/developer/"].map((source) => ({
      source,
      destination: "/developers/",
      permanent: true,
    }));
    // Case slugs renamed after the rewrite; keep old shared links working.
    const renamed = [
      ["ecommerce-scalability", "live-commerce-traffic-spike"],
      ["frontend-infrastructure", "healthcare-react-component-system"],
    ].flatMap(([from, to]) => [
      { source: `/work/${from}`, destination: `/work/${to}/`, permanent: true },
      { source: `/work/${from}/`, destination: `/work/${to}/`, permanent: true },
      { source: `/work/${from}.md`, destination: `/work/${to}.md`, permanent: true },
    ]);
    return [...docs, ...renamed];
  },
  // Pages answer in HTML or Markdown depending on Accept (see src/proxy.ts).
  async headers() {
    return [
      {
        source: "/((?!api(?:/|$)|_next/|\\.well-known/).*)",
        headers: [{ key: "Vary", value: "Accept" }],
      },
    ];
  },
};
export default config;
