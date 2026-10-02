import { profile } from "@/data/profile";
import { mcpUrl } from "@/data/agents";
import { errorCodes } from "./api";
import { caseSlugs } from "./profile-api";
import { siteDescription, siteUrl } from "./site";

// OpenAPI 3.1 contract for the REST API. Every operation has a unique
// operationId, a description and typed schemas, so it doubles as a set of
// LLM function definitions (e.g. ChatGPT GPT Actions).

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const strings = { type: "array", items: { type: "string" } };
const ok = (description: string, schema: object) => ({
  description,
  content: { "application/json": { schema } },
});
const problemResponse = (name: string) => ({
  $ref: `#/components/responses/${name}`,
});

const schemas = {
  Profile: {
    type: "object",
    description: "Headline profile, contact details and working principles.",
    required: ["name", "role", "focus", "email", "availability", "core"],
    properties: {
      name: { type: "string", examples: [profile.name] },
      role: { type: "string", examples: [profile.role] },
      focus: { type: "string" },
      email: { type: "string", format: "email" },
      linkedin: { type: "string", format: "uri" },
      github: { type: "string", format: "uri" },
      location: { type: "string" },
      languages: { type: "string" },
      availability: { type: "string" },
      core: { ...strings, description: "Core stack." },
      intro: { type: "string" },
      resumePath: {
        type: "string",
        description: "Path of the PDF resume, relative to the site origin.",
      },
      about: strings,
      contact: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
        },
      },
      engineeringPrinciples: strings,
    },
  },
  CaseSummary: {
    type: "object",
    required: ["number", "slug", "title", "category", "summary", "technologies"],
    properties: {
      number: { type: "string", examples: ["01"] },
      slug: { type: "string", enum: caseSlugs },
      title: { type: "string" },
      category: { type: "string" },
      summary: { type: "string" },
      technologies: strings,
    },
  },
  EngineeringCase: {
    type: "object",
    description:
      "A verified production case study. Optional sections are omitted when they don't apply.",
    required: [
      "number",
      "slug",
      "title",
      "category",
      "summary",
      "context",
      "contribution",
      "takeaway",
      "technologies",
    ],
    properties: {
      number: { type: "string" },
      slug: { type: "string", enum: caseSlugs },
      category: { type: "string" },
      title: { type: "string" },
      summary: { type: "string" },
      context: { type: "string" },
      problem: { type: "string" },
      investigation: strings,
      rootCause: { type: "string" },
      contribution: strings,
      outcome: { type: "string" },
      takeaway: { type: "string" },
      technologies: strings,
      sections: {
        type: "array",
        description: "The case page in reading order.",
        items: {
          type: "object",
          required: ["id", "heading"],
          properties: {
            id: { type: "string" },
            heading: { type: "string" },
            body: { type: "string" },
            points: strings,
            ordered: { type: "boolean" },
          },
        },
      },
    },
  },
  Experience: {
    type: "object",
    required: ["company", "title", "dates", "summary", "technologies"],
    properties: {
      company: { type: "string" },
      title: { type: "string" },
      dates: { type: "string", examples: ["Dec 2023 – Aug 2026"] },
      summary: { type: "string" },
      note: { type: "string" },
      technologies: strings,
    },
  },
  ExperienceResult: {
    type: "object",
    required: ["count", "experiences"],
    properties: {
      count: { type: "integer", minimum: 0 },
      experiences: { type: "array", items: ref("Experience") },
    },
  },
  JobFitRequest: {
    type: "object",
    required: ["job_description"],
    additionalProperties: false,
    properties: {
      job_description: {
        type: "string",
        minLength: 1,
        maxLength: 20000,
        description: "Full text or bullet points of the job description.",
      },
    },
  },
  JobFitResult: {
    type: "object",
    description:
      "Keyword match between the job description and verified experience. It reports matches; it never invents experience.",
    required: [
      "candidate",
      "roleMatch",
      "matchingTechnologiesFound",
      "relevantProductionCases",
      "recommendation",
    ],
    properties: {
      candidate: { type: "string" },
      roleMatch: {
        type: "object",
        required: ["isSeniorLevelMatch", "isBackendOrFullStackMatch"],
        properties: {
          isSeniorLevelMatch: { type: "boolean" },
          isBackendOrFullStackMatch: { type: "boolean" },
          yearsOfExperience: { type: "string" },
          scaleHandled: { type: "string" },
          languageMatch: { type: "string" },
        },
      },
      matchingTechnologiesFound: strings,
      relevantProductionCases: {
        type: "array",
        items: {
          type: "object",
          required: ["slug", "title", "summary"],
          properties: {
            slug: { type: "string", enum: caseSlugs },
            title: { type: "string" },
            summary: { type: "string" },
          },
        },
      },
      recommendation: { type: "string" },
    },
  },
  ApiIndex: {
    type: "object",
    required: ["name", "openapi", "endpoints"],
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      openapi: { type: "string", format: "uri" },
      docs: { type: "string", format: "uri" },
      mcp: { type: "string", format: "uri" },
      endpoints: {
        type: "array",
        items: {
          type: "object",
          required: ["method", "path", "operationId", "summary"],
          properties: {
            method: { type: "string" },
            path: { type: "string" },
            operationId: { type: "string" },
            summary: { type: "string" },
          },
        },
      },
    },
  },
  Problem: {
    type: "object",
    description:
      "RFC 9457 problem details. `code` is stable and machine-readable; `hint` says how to fix the request.",
    required: ["type", "title", "status", "detail", "code", "hint"],
    properties: {
      type: { type: "string", format: "uri" },
      title: { type: "string" },
      status: { type: "integer" },
      detail: { type: "string" },
      code: { type: "string", enum: Object.keys(errorCodes) },
      hint: { type: "string" },
      docs: { type: "string", format: "uri" },
    },
  },
};

const problemContent = {
  "application/problem+json": { schema: ref("Problem") },
};

export function openApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: `${profile.name} Profile API`,
      version: "1.0.0",
      summary: "Read-only API over a verified engineering profile.",
      description: `${siteDescription}\n\nPublic, read-only and keyless. The same data is available over MCP at ${mcpUrl}. Errors use RFC 9457 problem details (application/problem+json).`,
      contact: { name: profile.name, email: profile.email, url: siteUrl },
    },
    servers: [{ url: siteUrl }],
    externalDocs: {
      description: "Developer guide",
      url: `${siteUrl}/developers/`,
    },
    security: [],
    tags: [
      { name: "profile", description: "Who Jordão is and how to get in touch." },
      { name: "cases", description: "Verified production case studies." },
      { name: "experience", description: "Work history." },
      { name: "fit", description: "Job description matching." },
      { name: "meta", description: "API discovery." },
    ],
    paths: {
      "/api": {
        get: {
          operationId: "getApiIndex",
          tags: ["meta"],
          summary: "List every endpoint",
          description:
            "Returns the API's endpoints with their operationIds, plus links to this spec, the docs and the MCP server.",
          responses: { "200": ok("API index.", ref("ApiIndex")) },
        },
      },
      "/api/profile": {
        get: {
          operationId: "getProfile",
          tags: ["profile"],
          summary: "Get the profile",
          description:
            "Returns role, focus, core stack, contact details, availability, languages, about text and engineering principles. Call this first for a summary.",
          responses: { "200": ok("The profile.", ref("Profile")) },
        },
      },
      "/api/cases": {
        get: {
          operationId: "listEngineeringCases",
          tags: ["cases"],
          summary: "List case studies",
          description:
            "Lists every verified production case study with slug, category, summary and technologies. Use a slug with getCaseDetail for the full story.",
          responses: {
            "200": ok("All case studies.", {
              type: "array",
              items: ref("CaseSummary"),
            }),
          },
        },
      },
      "/api/cases/{slug}": {
        get: {
          operationId: "getCaseDetail",
          tags: ["cases"],
          summary: "Get one case study",
          description:
            "Returns a case study in full: context, problem, investigation, root cause, contribution, outcome and takeaway.",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              description: "Case study slug, as returned by listEngineeringCases.",
              schema: { type: "string", enum: caseSlugs },
            },
          ],
          responses: {
            "200": ok("The case study.", ref("EngineeringCase")),
            "404": problemResponse("NotFound"),
          },
        },
      },
      "/api/experience": {
        get: {
          operationId: "queryExperience",
          tags: ["experience"],
          summary: "Query work history",
          description:
            "Returns roles in reverse chronological order. Both filters are optional, case-insensitive substring matches, and combine with AND.",
          parameters: [
            {
              name: "technology",
              in: "query",
              required: false,
              description: "Technology to filter by, e.g. AWS, Node.js, React, GCP.",
              schema: { type: "string" },
            },
            {
              name: "company",
              in: "query",
              required: false,
              description: "Company name to filter by, e.g. Sem Parar, Grupo Soma.",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": ok("Matching roles.", ref("ExperienceResult")),
            "400": problemResponse("BadRequest"),
          },
        },
      },
      "/api/job-fit": {
        post: {
          operationId: "evaluateJobFit",
          tags: ["fit"],
          summary: "Match a job description",
          description:
            "Checks a job description against verified skills and case studies. Keyword-based: it reports which technologies and cases match and never invents experience. Nothing sent is stored.",
          requestBody: {
            required: true,
            content: { "application/json": { schema: ref("JobFitRequest") } },
          },
          responses: {
            "200": ok("Match result.", ref("JobFitResult")),
            "400": problemResponse("BadRequest"),
          },
        },
      },
    },
    components: {
      schemas,
      responses: {
        BadRequest: {
          description: "The request is malformed. `hint` explains the fix.",
          content: problemContent,
        },
        NotFound: {
          description: "Nothing exists at this path or slug.",
          content: problemContent,
        },
      },
    },
  };
}

export function apiIndex() {
  const spec = openApiSpec();
  return {
    name: spec.info.title,
    description: spec.info.summary,
    openapi: `${siteUrl}/openapi.json`,
    docs: `${siteUrl}/developers/`,
    mcp: mcpUrl,
    endpoints: Object.entries(spec.paths).flatMap(([path, operations]) =>
      Object.entries(operations).map(([method, operation]) => ({
        method: method.toUpperCase(),
        path,
        operationId: operation.operationId,
        summary: operation.summary,
      })),
    ),
  };
}
