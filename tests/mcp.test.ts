import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import * as mcp from "@/app/api/mcp/route";
import { getCase } from "@/lib/profile-api";

async function rpc(method: string, params: object = {}) {
  const response = await mcp.POST(
    new NextRequest("https://example.test/api/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    }),
  );
  expect(response.status).toBe(200);
  return (await response.json()).result;
}

describe("MCP endpoint", () => {
  it("lists the five tools", async () => {
    const { tools } = await rpc("tools/list");
    expect(tools.map((t: { name: string }) => t.name)).toEqual([
      "get_profile",
      "list_engineering_cases",
      "get_case_detail",
      "query_experience",
      "evaluate_job_fit",
    ]);
  });

  it("returns the same case data as the REST API", async () => {
    const result = await rpc("tools/call", {
      name: "get_case_detail",
      arguments: { slug: "live-commerce-traffic-spike" },
    });
    expect(JSON.parse(result.content[0].text)).toEqual(getCase("live-commerce-traffic-spike"));
  });

  it("reports unknown slugs as a tool error", async () => {
    const result = await rpc("tools/call", {
      name: "get_case_detail",
      arguments: { slug: "nope" },
    });
    expect(result.isError).toBe(true);
  });

  it("answers unsupported methods with a JSON 405", async () => {
    const response = mcp.DELETE(new Request("https://example.test/api/mcp", { method: "DELETE" }));
    expect(response.status).toBe(405);
    expect(response.headers.get("content-type")).toBe("application/problem+json");
  });
});
