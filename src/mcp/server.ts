import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  profile,
  cases,
  experience,
  skills,
  principles,
  about,
  contact,
} from "../data/profile";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "jordao-qualho-portfolio",
    version: "1.0.0",
  });

  // 1. Tool: get_profile
  server.tool(
    "get_profile",
    "Returns Jordão Qualho's high-level engineering profile, core strengths, contact details, availability, and languages.",
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ...profile,
                about,
                contact,
                engineeringPrinciples: principles,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // 2. Tool: list_engineering_cases
  server.tool(
    "list_engineering_cases",
    "Lists all verified production engineering case studies with summaries, categories, and technologies.",
    {},
    async () => {
      const summaryList = cases.map((c) => ({
        number: c.number,
        slug: c.slug,
        title: c.title,
        category: c.category,
        summary: c.summary,
        technologies: c.technologies,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(summaryList, null, 2),
          },
        ],
      };
    }
  );

  // 3. Tool: get_case_detail
  server.tool(
    "get_case_detail",
    "Returns full details for a specific engineering case study (problem, investigation, root cause, contributions, outcome, and takeaways).",
    {
      slug: z
        .string()
        .describe(
          "Slug of the case study: 'financial-onboarding-incident', 'ecommerce-scalability', or 'frontend-infrastructure'"
        ),
    },
    async ({ slug }) => {
      const found = cases.find((c) => c.slug === slug);
      if (!found) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Case study with slug '${slug}' not found. Available slugs: ${cases
                .map((c) => `'${c.slug}'`)
                .join(", ")}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(found, null, 2),
          },
        ],
      };
    }
  );

  // 4. Tool: query_experience
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
    async ({ technology, company }) => {
      let filtered = experience;

      if (company) {
        const query = company.toLowerCase();
        filtered = filtered.filter((exp) =>
          exp.company.toLowerCase().includes(query)
        );
      }

      if (technology) {
        const query = technology.toLowerCase();
        filtered = filtered.filter((exp) =>
          exp.technologies.some((tech) => tech.toLowerCase().includes(query))
        );
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                count: filtered.length,
                experiences: filtered,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // 5. Tool: evaluate_job_fit
  server.tool(
    "evaluate_job_fit",
    "Evaluates a given Job Description (JD) or role requirements against Jordão's verified production skills, cases, and experience. Strictly avoids hallucination.",
    {
      job_description: z
        .string()
        .describe("The full text or bullet points of the Job Description / requirements."),
    },
    async ({ job_description }) => {
      const jdLower = job_description.toLowerCase();

      // Collect all verified technologies across skills and experiences
      const allVerifiedSkills = Array.from(
        new Set([
          ...skills.flatMap((s) => s.items),
          ...experience.flatMap((e) => e.technologies),
          ...cases.flatMap((c) => c.technologies),
        ])
      );

      const matchingSkills = allVerifiedSkills.filter((skill) =>
        jdLower.includes(skill.toLowerCase())
      );

      // Check case relevance
      const relevantCases = cases
        .filter((c) => {
          const techMatch = c.technologies.some((t) =>
            jdLower.includes(t.toLowerCase())
          );
          const textMatch =
            jdLower.includes(c.category.toLowerCase()) ||
            (c.problem && jdLower.includes("incident")) ||
            (c.slug.includes("ecommerce") && jdLower.includes("commerce")) ||
            (c.slug.includes("financial") && (jdLower.includes("fintech") || jdLower.includes("financial")));
          return techMatch || textMatch;
        })
        .map((c) => ({
          slug: c.slug,
          title: c.title,
          summary: c.summary,
        }));

      // High-level role matching
      const isSeniorOrStaff =
        jdLower.includes("senior") ||
        jdLower.includes("tech lead") ||
        jdLower.includes("lead");
      const isFullStackOrBackend =
        jdLower.includes("backend") ||
        jdLower.includes("full stack") ||
        jdLower.includes("fullstack");

      const analysis = {
        candidate: profile.name,
        roleMatch: {
          isSeniorLevelMatch: isSeniorOrStaff,
          isBackendOrFullStackMatch: isFullStackOrBackend,
          yearsOfExperience: "6+ years in production systems",
          scaleHandled: "7M+ active users (fintech), 12k+ concurrent users (live commerce)",
          languageMatch: "English C1 Advanced (comfortable with international/US/LATAM remote teams)",
        },
        matchingTechnologiesFound: matchingSkills,
        relevantProductionCases: relevantCases,
        recommendation:
          matchingSkills.length > 0 && isFullStackOrBackend
            ? "Strong match on core backend/full stack stack. Review verified production cases for investigation & reliability depth."
            : "Review specific requirements. Jordão's core depth is Node.js, TypeScript, AWS, GCP, React, and production reliability.",
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(analysis, null, 2),
          },
        ],
      };
    }
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
- High-traffic performance optimization under GCP Cloud Run and database pooling/caching.
- English C1 Advanced.

Formulate 3-5 in-depth technical questions focusing on:
1. How he approaches debugging when logs/retries hide the real failure cause.
2. How he isolates database connection pooling, cold starts, and autoscaling bottlenecks.
3. His philosophy on observability and pragmatic software design.`,
          },
        },
      ],
    })
  );

  return server;
}
