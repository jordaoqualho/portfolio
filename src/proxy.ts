import { NextResponse, type NextRequest } from "next/server";
import { isBot, negotiateLocale, prefersMarkdown } from "@/lib/negotiation";
import { englishOnly, LOCALE_COOKIE } from "@/i18n/config";

// Pages live under app/[lang]. English is served at the root (rewritten to
// /en internally) and Portuguese under /pt. Agents get the Markdown twin of a
// page, either by asking for text/markdown or by appending `.md`; Markdown is
// English-only, so a /pt prefix is dropped for it.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (!pathname.endsWith("/") && !pathname.endsWith(".md")) {
    // A plain URL: NextURL would serialize the slash away again.
    return NextResponse.redirect(
      new URL(`${pathname}/${search}`, request.url),
      308,
    );
  }

  const portuguese = pathname === "/pt/" || pathname.startsWith("/pt/");
  const page = portuguese ? pathname.slice(3) || "/" : pathname;

  if (pathname.endsWith(".md")) {
    const path = page.slice(0, -3).replace(/\/index$/, "");
    return NextResponse.rewrite(new URL(`/md${path}`, request.url));
  }
  if (prefersMarkdown(request.headers.get("accept") ?? "")) {
    return NextResponse.rewrite(
      new URL(`/md${page.replace(/\/$/, "")}`, request.url),
    );
  }

  // /en/... is never a public URL: English is the unprefixed site.
  if (pathname === "/en/" || pathname.startsWith("/en/")) {
    return NextResponse.redirect(
      new URL(`${pathname.slice(3) || "/"}${search}`, request.url),
      308,
    );
  }

  if (portuguese) {
    // Agent and developer docs exist only in English.
    if (englishOnly.some((path) => page.startsWith(`${path}/`))) {
      return NextResponse.redirect(new URL(`${page}${search}`, request.url), 308);
    }
    return NextResponse.next();
  }

  const choice = request.cookies.get(LOCALE_COOKIE)?.value;
  const navigation =
    request.headers.get("sec-fetch-mode") === "navigate" ||
    (request.headers.get("accept") ?? "").includes("text/html");
  const detected =
    !choice &&
    navigation &&
    !isBot(request.headers.get("user-agent") ?? "") &&
    !englishOnly.some((path) => pathname.startsWith(`${path}/`))
      ? negotiateLocale(
          request.headers.get("accept-language") ?? "",
          request.headers.get("x-vercel-ip-country"),
        )
      : null;

  if (choice === "pt" || detected === "pt") {
    const response = NextResponse.redirect(
      new URL(`/pt${pathname}${search}`, request.url),
      307,
    );
    response.headers.set("Vary", "Accept-Language, Cookie");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  return NextResponse.rewrite(new URL(`/en${pathname}${search}`, request.url));
}

export const config = {
  // Pages and `.md` URLs only: no API, well-known files, build assets, OG
  // images (also under /en and /pt) or other files.
  matcher: [
    "/((?!api(?:/|$)|_next/|md/|\\.well-known/|(?:[a-z]{2}/)?(?:opengraph|twitter)-image|.*\\.(?!md$)[a-z0-9]+$).*)",
  ],
};
