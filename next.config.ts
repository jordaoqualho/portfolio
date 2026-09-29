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
  // Pages answer in HTML or Markdown depending on Accept (see src/proxy.ts).
  async headers() {
    return [
      {
        source: "/((?!api/|_next/).*)",
        headers: [{ key: "Vary", value: "Accept" }],
      },
    ];
  },
};
export default config;
