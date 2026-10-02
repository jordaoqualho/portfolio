import { preflight, problem } from "@/lib/api";
import { siteUrl } from "@/lib/site";
// Any unknown /api path answers in JSON, never with the HTML 404 page.
function notFound(request: Request) {
  return problem(
    "not_found",
    `No endpoint at ${new URL(request.url).pathname}.`,
    `GET ${siteUrl}/api lists every endpoint; the full contract is at ${siteUrl}/openapi.json.`,
  );
}
export {
  notFound as GET,
  notFound as POST,
  notFound as PUT,
  notFound as PATCH,
  notFound as DELETE,
  preflight as OPTIONS,
};
