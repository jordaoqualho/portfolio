import { siteUrl } from "./site";

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

// RFC 8631: every response points agents at the machine-readable description.
const discoveryHeaders = {
  ...corsHeaders,
  Link: `<${siteUrl}/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json", <${siteUrl}/developers/>; rel="service-doc"`,
};

export function json(body: unknown, init: ResponseInit = {}) {
  return Response.json(body, {
    ...init,
    headers: {
      ...discoveryHeaders,
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      ...init.headers,
    },
  });
}

export const errorCodes = {
  not_found: { status: 404, title: "Endpoint not found" },
  case_not_found: { status: 404, title: "Case study not found" },
  invalid_request: { status: 400, title: "Invalid request" },
  method_not_allowed: { status: 405, title: "Method not allowed" },
} as const;
export type ErrorCode = keyof typeof errorCodes;

// RFC 9457 problem details, plus `code` and `hint` members an agent can act on.
export function problem(
  code: ErrorCode,
  detail: string,
  hint: string,
  headers: Record<string, string> = {},
) {
  const { status, title } = errorCodes[code];
  return new Response(
    JSON.stringify({
      type: `${siteUrl}/developers/#error-${code}`,
      title,
      status,
      detail,
      code,
      hint,
      docs: `${siteUrl}/openapi.json`,
    }),
    {
      status,
      headers: {
        ...discoveryHeaders,
        "Content-Type": "application/problem+json",
        "Cache-Control": "no-store",
        ...headers,
      },
    },
  );
}

export function preflight() {
  return new Response(null, {
    status: 204,
    headers: { ...corsHeaders, "Access-Control-Max-Age": "86400" },
  });
}

// Route files export these for the methods they don't support, so a wrong
// method gets a JSON 405 instead of Next's empty one.
export function onlyAllow(...methods: string[]) {
  const allow = [...methods, "OPTIONS"].join(", ");
  const handler = (request: Request) =>
    problem(
      "method_not_allowed",
      `${request.method} is not supported on ${new URL(request.url).pathname}.`,
      `Use ${methods.join(" or ")}. See ${siteUrl}/openapi.json for every operation.`,
      { Allow: allow },
    );
  return {
    GET: handler,
    POST: handler,
    PUT: handler,
    PATCH: handler,
    DELETE: handler,
    OPTIONS: preflight,
  };
}
