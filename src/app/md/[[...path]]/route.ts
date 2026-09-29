import { markdownFor, notFoundMarkdown } from "@/lib/markdown";
import { siteUrl } from "@/lib/site";

// Reached through src/proxy.ts: `.md` URLs and requests that prefer text/markdown.
type Context = { params: Promise<{ path?: string[] }> };
export async function GET(_request: Request, { params }: Context) {
  const { path = [] } = await params;
  const page = path.length ? `/${path.join("/")}` : "/";
  const body = markdownFor(page);
  const headers: Record<string, string> = {
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept",
    // The HTML page is the one search engines should index.
    "X-Robots-Tag": "noindex",
  };
  if (body) {
    headers.Link = `<${siteUrl}${page === "/" ? "/" : `${page}/`}>; rel="canonical"`;
    headers["Cache-Control"] = "public, max-age=0, s-maxage=3600";
  }
  return new Response(body ?? notFoundMarkdown(page), {
    status: body ? 200 : 404,
    headers,
  });
}
