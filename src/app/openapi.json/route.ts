import { corsHeaders } from "@/lib/api";
import { openApiSpec } from "@/lib/openapi";
export const dynamic = "force-static";
export function GET() {
  return Response.json(openApiSpec(), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
