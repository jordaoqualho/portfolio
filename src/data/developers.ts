import { siteUrl } from "@/lib/site";
import { mcpUrl } from "./agents";

export const developerIntro =
  "A public, read-only JSON API over my verified profile: the same data behind this site and the MCP server. Use it from scripts, backends or LLM function calling.";

export const developerBasics = [
  {
    term: "Base URL",
    value: `${siteUrl}/api`,
  },
  {
    term: "Authentication",
    value:
      "None. No key or sign-up, and every call is read-only and safe to repeat, so there is no separate sandbox.",
  },
  {
    term: "Format",
    value:
      "JSON in and out. Errors are RFC 9457 problem details (application/problem+json) with a stable code and a hint.",
  },
  {
    term: "CORS and caching",
    value:
      "Open CORS, so browsers can call it directly. GET responses are cached at the edge for up to an hour.",
  },
  {
    term: "Privacy",
    value: "Nothing you send is stored, including job descriptions.",
  },
];

export const quickstart = `# Profile summary
curl ${siteUrl}/api/profile

# Roles that used AWS
curl "${siteUrl}/api/experience?technology=AWS"

# Check a job description
curl -X POST ${siteUrl}/api/job-fit \\
  -H 'content-type: application/json' \\
  -d '{"job_description":"Senior Backend Engineer: Node.js, TypeScript, AWS"}'`;

export const errorExample = `{
  "type": "${siteUrl}/developers/#error-case_not_found",
  "title": "Case study not found",
  "status": 404,
  "detail": "No case study has the slug 'payments'.",
  "code": "case_not_found",
  "hint": "Use one of: financial-onboarding-incident, … GET /api/cases lists them.",
  "docs": "${siteUrl}/openapi.json"
}`;

export const errorHints: Record<string, string> = {
  not_found: "The path doesn't exist. GET /api lists every endpoint.",
  case_not_found: "Unknown slug. GET /api/cases for valid slugs.",
  invalid_request:
    "Malformed body or unknown query parameter. The hint names the fix.",
  method_not_allowed: "Wrong HTTP method. The Allow header lists valid ones.",
};

export const machineFiles = [
  {
    path: "/openapi.json",
    description: "OpenAPI 3.1 contract: operationIds, typed parameters and response schemas.",
  },
  {
    path: "/.well-known/api-catalog",
    description: "RFC 9727 API catalog linking the spec and these docs.",
  },
  { path: "/api", description: "JSON index of every endpoint." },
  { path: "/llms.txt", description: "When to use this profile, and reading order." },
  { path: "/api/mcp", description: `MCP server (${mcpUrl}), same data as tools.` },
];

export const functionCalling = `Import ${siteUrl}/openapi.json as a ChatGPT GPT Action, or map each operation to a tool in any function-calling framework. Every operation has a unique operationId, a description and typed parameters. For Claude, Cursor and other MCP clients, connect the MCP server instead.`;
