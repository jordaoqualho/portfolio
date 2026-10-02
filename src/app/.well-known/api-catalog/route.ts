import { corsHeaders } from "@/lib/api";
import { mcpUrl } from "@/data/agents";
import { siteUrl } from "@/lib/site";
export const dynamic = "force-static";
// RFC 9727 API catalog: a linkset (RFC 9264) pointing at each API's
// description and documentation.
export function GET() {
  const linkset = {
    linkset: [
      {
        anchor: `${siteUrl}/api`,
        "service-desc": [
          {
            href: `${siteUrl}/openapi.json`,
            type: "application/vnd.oai.openapi+json",
          },
        ],
        "service-doc": [{ href: `${siteUrl}/developers/`, type: "text/html" }],
      },
      {
        anchor: mcpUrl,
        "service-doc": [{ href: `${siteUrl}/agents/`, type: "text/html" }],
      },
    ],
  };
  return new Response(JSON.stringify(linkset), {
    headers: {
      ...corsHeaders,
      "Content-Type":
        'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      Link: `<${siteUrl}/.well-known/api-catalog>; rel="api-catalog"`,
    },
  });
}
