import { NextResponse, type NextRequest } from "next/server";

// Agents get the Markdown twin of a page, either by asking for text/markdown
// or by appending `.md`. Browsers keep getting HTML.
function prefersMarkdown(accept: string) {
  let markdown = 0;
  let html = 0;
  for (const part of accept.toLowerCase().split(",")) {
    const [type, ...params] = part.split(";").map((s) => s.trim());
    const q = params.find((p) => p.startsWith("q="));
    const weight = q ? Number(q.slice(2)) || 0 : 1;
    if (type === "text/markdown") markdown = weight;
    else if (type === "text/html") html = weight;
  }
  return markdown > 0 && markdown >= html;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (!pathname.endsWith("/") && !pathname.endsWith(".md")) {
    // A plain URL: NextURL would serialize the slash away again.
    return NextResponse.redirect(
      new URL(`${pathname}/${search}`, request.url),
      308,
    );
  }
  if (pathname.endsWith(".md")) {
    const page = pathname.slice(0, -3).replace(/\/index$/, "");
    return NextResponse.rewrite(new URL(`/md${page}`, request.url));
  }
  if (prefersMarkdown(request.headers.get("accept") ?? "")) {
    const page = pathname.replace(/\/$/, "");
    return NextResponse.rewrite(new URL(`/md${page}`, request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Pages and `.md` URLs only: no API, build assets or other files.
  matcher: [
    "/((?!api/|_next/|md/|opengraph-image|twitter-image|.*\\.(?!md$)[a-z0-9]+$).*)",
  ],
};
