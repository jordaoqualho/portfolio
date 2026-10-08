import { describe, expect, it } from "vitest";
import * as index from "@/app/api/route";
import * as profileRoute from "@/app/api/profile/route";
import * as casesRoute from "@/app/api/cases/route";
import * as caseRoute from "@/app/api/cases/[slug]/route";
import * as experienceRoute from "@/app/api/experience/route";
import * as jobFitRoute from "@/app/api/job-fit/route";
import * as catchAll from "@/app/api/[...path]/route";
import { cases, experience } from "@/data/profile";
import { openApiSpec } from "@/lib/openapi";
import { matchesSchema, matchesSchemaObject, params, request } from "./helpers";

async function expectProblem(response: Response, status: number, code: string) {
  expect(response.status).toBe(status);
  expect(response.headers.get("content-type")).toBe("application/problem+json");
  const body = await response.json();
  expect(body).toMatchObject({ status, code });
  expect(body.hint).toBeTruthy();
  expect(matchesSchema("Problem", body)).toBe(true);
  return body;
}

describe("REST API", () => {
  it("serves an index of every OpenAPI operation", async () => {
    const response = index.GET();
    const body = await response.json();
    expect(matchesSchema("ApiIndex", body)).toBe(true);
    const operations = Object.values(openApiSpec().paths).flatMap((ops) =>
      Object.values(ops).map((op) => op.operationId),
    );
    expect(body.endpoints.map((e: { operationId: string }) => e.operationId)).toEqual(
      operations,
    );
  });

  it("returns the profile with discovery and CORS headers", async () => {
    const response = profileRoute.GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("link")).toContain('rel="service-desc"');
    const body = await response.json();
    expect(body.name).toBe("Jordão Qualho");
    expect(matchesSchema("Profile", body)).toBe(true);
  });

  it("lists case studies", async () => {
    const body = await casesRoute.GET().json();
    expect(body).toHaveLength(cases.length);
    const schema = openApiSpec().paths["/api/cases"].get.responses["200"].content[
      "application/json"
    ].schema;
    expect(matchesSchemaObject(schema, body)).toBe(true);
  });

  it("returns one case by slug", async () => {
    const slug = cases[0].slug;
    const response = await caseRoute.GET(request(`/api/cases/${slug}`), params({ slug }));
    const body = await response.json();
    expect(body.slug).toBe(slug);
    expect(matchesSchema("EngineeringCase", body)).toBe(true);
  });

  it("answers an unknown slug with a JSON problem that lists valid slugs", async () => {
    const response = await caseRoute.GET(
      request("/api/cases/payments"),
      params({ slug: "payments" }),
    );
    const body = await expectProblem(response, 404, "case_not_found");
    expect(body.hint).toContain(cases[0].slug);
  });

  it("filters experience by technology and company", async () => {
    const all = await experienceRoute.GET(request("/api/experience")).json();
    expect(all.count).toBe(experience.length);
    const aws = await experienceRoute.GET(request("/api/experience?technology=aws")).json();
    expect(aws.count).toBeGreaterThan(0);
    expect(aws.count).toBeLessThan(experience.length);
    expect(matchesSchema("ExperienceResult", aws)).toBe(true);
    const soma = await experienceRoute
      .GET(request("/api/experience?company=soma&technology=google cloud platform"))
      .json();
    expect(soma.experiences.map((e: { company: string }) => e.company)).toEqual([
      "Grupo Soma",
    ]);
  });

  it("rejects unknown experience filters", async () => {
    await expectProblem(
      experienceRoute.GET(request("/api/experience?skill=aws")),
      400,
      "invalid_request",
    );
  });

  it("matches a job description", async () => {
    const response = await jobFitRoute.POST(
      request("/api/job-fit", {
        method: "POST",
        body: JSON.stringify({
          job_description: "Senior Backend Engineer with Node.js, TypeScript and AWS in fintech",
        }),
      }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    const body = await response.json();
    expect(matchesSchema("JobFitResult", body)).toBe(true);
    expect(body.matchingTechnologiesFound).toEqual(
      expect.arrayContaining(["Node.js", "TypeScript", "AWS"]),
    );
    expect(body.roleMatch.isBackendOrFullStackMatch).toBe(true);
  });

  it.each([
    ["invalid JSON", "{not json"],
    ["a missing field", JSON.stringify({ description: "x" })],
    ["an empty description", JSON.stringify({ job_description: "   " })],
  ])("rejects %s on job-fit", async (_, body) => {
    await expectProblem(
      await jobFitRoute.POST(request("/api/job-fit", { method: "POST", body })),
      400,
      "invalid_request",
    );
  });

  it("answers unsupported methods with a JSON 405 and an Allow header", async () => {
    const post = await expectProblem(
      profileRoute.POST(request("/api/profile", { method: "POST" })),
      405,
      "method_not_allowed",
    );
    expect(post.detail).toContain("POST");
    const get = jobFitRoute.GET(request("/api/job-fit"));
    expect(get.headers.get("allow")).toBe("POST, OPTIONS");
    await expectProblem(get, 405, "method_not_allowed");
  });

  it("answers unknown API paths with a JSON 404, for any method", async () => {
    for (const method of ["GET", "POST", "DELETE"] as const) {
      const handler = catchAll[method];
      const body = await expectProblem(
        handler(request("/api/nope", { method })),
        404,
        "not_found",
      );
      expect(body.detail).toContain("/api/nope");
    }
  });

  it("answers CORS preflight", () => {
    const response = profileRoute.OPTIONS();
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-methods")).toContain("GET");
  });
});
