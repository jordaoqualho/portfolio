import { NextRequest } from "next/server";
import { createMcpServer } from "@/mcp/server";
import { mcpClients, mcpTools, mcpUrl } from "@/data/agents";
import { siteUrl } from "@/lib/site";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

export const dynamic = "force-dynamic";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function GET(req: NextRequest) {
  const accept = req.headers.get("accept") ?? "";

  // If a client or agent requests an SSE stream, handle it through MCP transport
  if (accept.includes("text/event-stream")) {
    const server = createMcpServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport);
    const response = await transport.handleRequest(req);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Otherwise, describe the server so a person or agent can find how to connect.
  return Response.json(
    {
      name: "jordao-qualho-portfolio-mcp",
      status: "active",
      version: "1.0.0",
      description:
        "Model Context Protocol (MCP) server for Jordão Qualho's engineering portfolio. AI assistants can query verified cases and career history, and check a job description against verified skills.",
      protocol: "Streamable HTTP (stateless, JSON responses)",
      endpoints: {
        mcp: mcpUrl,
        llmsTxt: `${siteUrl}/llms.txt`,
        llmsFullTxt: `${siteUrl}/llms-full.txt`,
        docs: `${siteUrl}/agents/`,
      },
      availableTools: mcpTools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.params ? tool.params.split(", ") : [],
      })),
      quickstart: Object.fromEntries(
        mcpClients.map((client) => [
          client.name,
          { instructions: client.note, value: client.code },
        ])
      ),
    },
    {
      headers: corsHeaders,
    }
  );
}

export async function POST(req: NextRequest) {
  // Normalize Accept header to ensure both application/json and text/event-stream are accepted
  const originalAccept = req.headers.get("accept") ?? "";
  let requestToHandle: Request = req;

  if (
    !originalAccept.includes("text/event-stream") ||
    !originalAccept.includes("application/json")
  ) {
    const headers = new Headers(req.headers);
    headers.set("accept", "application/json, text/event-stream");
    requestToHandle = new Request(req.url, {
      method: req.method,
      headers,
      body: req.body,
      // @ts-expect-error duplex required for streaming in Node/Fetch
      duplex: "half",
    });
  }

  const server = createMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  const response = await transport.handleRequest(requestToHandle);

  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
