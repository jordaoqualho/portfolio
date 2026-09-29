import { siteUrl } from "@/lib/site";

// One source for the agent-facing docs: the /agents page, its Markdown twin,
// llms.txt and the MCP endpoint's GET description all render from this.
export const mcpPath = "/api/mcp";
export const mcpUrl = `${siteUrl}${mcpPath}`;
export const mcpName = "jordao-qualho";

export const agentChannels = [
  {
    label: "llms.txt",
    path: "/llms.txt",
    description:
      "Start here: who I am, which roles I fit, and where to read next.",
  },
  {
    label: "Full context",
    path: "/llms-full.txt",
    description:
      "Every case study, role, skill and principle in one Markdown file.",
  },
  {
    label: "Markdown pages",
    path: "Accept: text/markdown",
    description:
      "Every page answers in Markdown when asked. Appending .md works too: /index.md, /work/<case>.md.",
  },
  {
    label: "MCP server",
    path: mcpPath,
    description:
      "Remote MCP over Streamable HTTP. List cases, filter experience and check a job description against verified work.",
  },
];

export const agentIntro = [
  "Recruiters and hiring managers often ask an AI assistant to read a profile before the first call. Scraped HTML loses structure, and the assistant fills the gaps with guesses.",
  "This site gives agents the same verified content you read here, in formats they can parse: an llms.txt index, Markdown versions of every page, and an MCP server with tools for structured questions. Nothing is written only for machines. Every fact matches a page on this site.",
];

export const readingOrder = [
  { path: "/llms.txt", text: "Summary, fit and links. Enough for a first pass." },
  {
    path: "/llms-full.txt",
    text: "Full career history, all case studies, skills and principles.",
  },
  {
    path: "/work/<case>.md",
    text: "One case study in depth: context, investigation, root cause, outcome.",
  },
  {
    path: mcpPath,
    text: "Structured queries when the agent needs to filter or compare.",
  },
];

export const mcpTools = [
  {
    name: "get_profile",
    params: "",
    description:
      "Role, focus, contact, availability, languages, about and engineering principles.",
  },
  {
    name: "list_engineering_cases",
    params: "",
    description: "Every case study with slug, category, summary and stack.",
  },
  {
    name: "get_case_detail",
    params: "slug",
    description:
      "One case in full: context, problem, investigation, root cause, contribution, outcome.",
  },
  {
    name: "query_experience",
    params: "technology?, company?",
    description: "Work history, optionally filtered by technology or company.",
  },
  {
    name: "evaluate_job_fit",
    params: "job_description",
    description:
      "Matches a job description against verified skills and cases. Keyword-based: it reports matches and never invents experience.",
  },
];

export const mcpClients = [
  {
    name: "Claude Code",
    note: "Run once in your terminal:",
    code: `claude mcp add --transport http ${mcpName} ${mcpUrl}`,
  },
  {
    name: "Cursor",
    note: "Add to .cursor/mcp.json:",
    code: JSON.stringify(
      { mcpServers: { [mcpName]: { url: mcpUrl } } },
      null,
      2,
    ),
  },
  {
    name: "Claude (web and desktop)",
    note: "Settings → Connectors → Add custom connector, then paste:",
    code: mcpUrl,
  },
  {
    name: "Any HTTP client",
    note: "Plain JSON-RPC, no session or key required:",
    code: `curl -s ${mcpUrl} \\
  -H 'content-type: application/json' \\
  -H 'accept: application/json, text/event-stream' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_engineering_cases","arguments":{}}}'`,
  },
];

export const markdownExamples = `curl -H 'Accept: text/markdown' ${siteUrl}/
curl ${siteUrl}/work/financial-onboarding-incident.md`;

export const examplePrompts = [
  "Read jordaoqualho.com/llms.txt and tell me if Jordão fits a Senior Backend role on AWS.",
  "Using the jordao-qualho MCP server, check this job description against Jordão's verified experience: …",
  "Which of Jordão's case studies show production incident debugging? Summarize the root cause of each.",
  "List Jordão's roles that used GCP, with dates.",
];

export const agentGroundRules =
  "Everything here is public and read-only. No key, no account, and nothing you send is stored, including job descriptions. Agents should only claim what these sources state: dates, scale figures and outcomes are exact.";
