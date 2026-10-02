import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { cases, profile } from "../data/profile";
import {
  caseSlugs,
  evaluateJobFit,
  getCase,
  getProfile,
  listCases,
  queryExperience,
} from "../lib/profile-api";

const json = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
});

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "jordao-qualho-portfolio",
    version: "1.0.0",
  });

  server.tool(
    "get_profile",
    "Returns Jordão Qualho's high-level engineering profile, core strengths, contact details, availability, and languages.",
    {},
    async () => json(getProfile())
  );

  server.tool(
    "list_engineering_cases",
    "Lists all verified production engineering case studies with summaries, categories, and technologies.",
    {},
    async () => json(listCases())
  );

  server.tool(
    "get_case_detail",
    "Returns full details for a specific engineering case study (problem, investigation, root cause, contributions, outcome, and takeaways).",
    {
      slug: z
        .string()
        .describe(
          `Slug of the case study: ${caseSlugs.map((slug) => `'${slug}'`).join(", ")}`
        ),
    },
    async ({ slug }) => {
      const found = getCase(slug);
      if (!found) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Case study with slug '${slug}' not found. Available slugs: ${caseSlugs
                .map((s) => `'${s}'`)
                .join(", ")}`,
            },
          ],
        };
      }
      return json(found);
    }
  );

  server.tool(
    "query_experience",
    "Queries work experience history with optional filtering by technology or company name.",
    {
      technology: z
        .string()
        .optional()
        .describe("Technology to filter by (e.g. 'AWS', 'Node.js', 'React', 'GCP', 'Redis')"),
      company: z
        .string()
        .optional()
        .describe("Company name to filter by (e.g. 'Sem Parar', 'Sully', 'ROIT', 'Grupo Soma')"),
    },
    async (filters) => json(queryExperience(filters))
  );

  server.tool(
    "evaluate_job_fit",
    "Evaluates a given Job Description (JD) or role requirements against Jordão's verified production skills, cases, and experience. Strictly avoids hallucination.",
    {
      job_description: z
        .string()
        .describe("The full text or bullet points of the Job Description / requirements."),
    },
    async ({ job_description }) => json(evaluateJobFit(job_description))
  );

  // Resources
  server.resource(
    "profile-summary",
    "profile://summary",
    {
      description: "Concise summary of Jordão Qualho's profile, contact, and core competencies",
      mimeType: "application/json",
    },
    async () => ({
      contents: [
        {
          uri: "profile://summary",
          mimeType: "application/json",
          text: JSON.stringify(profile, null, 2),
        },
      ],
    })
  );

  server.resource(
    "all-cases",
    "cases://all",
    {
      description: "Full dataset of verified production engineering cases",
      mimeType: "application/json",
    },
    async () => ({
      contents: [
        {
          uri: "cases://all",
          mimeType: "application/json",
          text: JSON.stringify(cases, null, 2),
        },
      ],
    })
  );

  // Prompts
  server.prompt(
    "screen_candidate",
    "Guide for recruiters and engineering managers to interview and screen Jordão Qualho based on his real production incident work.",
    {},
    async () => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `You are interviewing Jordão Qualho for a Senior Software Engineer (Backend / Full Stack) position.
Here is his background:
- 6+ years building and operating production systems.
- Proven incident investigation depth (e.g. debugging misleading 3rd-party API errors in a 7M+ active user fintech platform).
- Load testing and Cloud Run autoscaling after a live commerce event passed 12k concurrent users (worked with the infrastructure team).
- English C1 Advanced.

Formulate 3-5 in-depth technical questions focusing on:
1. How he approaches debugging when logs/retries hide the real failure cause.
2. How he reproduces traffic spikes in load tests and reasons about cold starts, autoscaling and cost.
3. His philosophy on observability and pragmatic software design.`,
          },
        },
      ],
    })
  );

  return server;
}
