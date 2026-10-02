import { existsSync } from "node:fs";
import { join } from "node:path";
import SwaggerParser from "@apidevtools/swagger-parser";
import { describe, expect, it } from "vitest";
import { GET as openApiRoute } from "@/app/openapi.json/route";
import { GET as apiCatalogRoute } from "@/app/.well-known/api-catalog/route";
import { openApiSpec } from "@/lib/openapi";
import { siteUrl } from "@/lib/site";

const spec = openApiSpec();
const operations = Object.entries(spec.paths).flatMap(([path, ops]) =>
  Object.entries(ops).map(([method, op]) => ({ path, method, ...op })),
);

describe("OpenAPI spec", () => {
  it("is a valid OpenAPI 3.1 document", async () => {
    // validate() mutates its input, so hand it a copy.
    await expect(
      SwaggerParser.validate(structuredClone(spec) as never),
    ).resolves.toBeTruthy();
    expect(spec.openapi).toBe("3.1.0");
    expect(spec.servers[0].url).toBe(siteUrl);
  });

  it("gives every operation a unique operationId, summary and description", () => {
    const ids = operations.map((op) => op.operationId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const op of operations) {
      expect(op.operationId).toMatch(/^[a-zA-Z][a-zA-Z0-9]*$/);
      expect(op.summary).toBeTruthy();
      expect(op.description.length).toBeGreaterThan(30);
    }
  });

  it("types every parameter", () => {
    type Param = { description: string; schema: { type: string } };
    for (const op of operations) {
      const list = ("parameters" in op ? op.parameters : []) as Param[];
      for (const param of list) {
        expect(param.description).toBeTruthy();
        expect(param.schema.type).toBe("string");
      }
    }
  });

  it("documents a route file for every path", () => {
    for (const { path } of operations) {
      const dir = path.replace(/\{(\w+)\}/g, "[$1]");
      expect(existsSync(join("src/app", dir, "route.ts")), path).toBe(true);
    }
  });

  it("is served as JSON with CORS", async () => {
    const response = openApiRoute();
    expect(response.headers.get("content-type")).toBe("application/json");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(await response.json()).toEqual(spec);
  });
});

describe("API catalog (RFC 9727)", () => {
  it("is a linkset pointing at the spec and the docs", async () => {
    const response = apiCatalogRoute();
    expect(response.headers.get("content-type")).toBe(
      'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
    );
    const { linkset } = await response.json();
    expect(linkset[0].anchor).toBe(`${siteUrl}/api`);
    expect(linkset[0]["service-desc"][0].href).toBe(`${siteUrl}/openapi.json`);
    expect(linkset[0]["service-doc"][0].href).toBe(`${siteUrl}/developers/`);
  });
});
