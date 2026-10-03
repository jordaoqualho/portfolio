import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/i18n/config";
import { ContactInput, looksLikeBot, rateLimit, sendContactEmail } from "@/lib/contact";

// The portfolio's contact form. Same-origin only: it is not part of the public
// agent API (no CORS, not in openapi.json).
const reply = (status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

// Plain Request has no .cookies (that's NextRequest-only), so the locale
// cookie set by PreferencesMenu is read off the header directly.
function localeFromRequest(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`));
  const value = match ? decodeURIComponent(match[1]) : undefined;
  return isLocale(value) ? value : defaultLocale;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply(403, { error: "forbidden" });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limit = rateLimit(ip);
  if (!limit.ok)
    return reply(429, { error: "rate_limited" }, { "Retry-After": String(limit.retryAfter) });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply(400, { error: "invalid_json" });
  }
  const parsed = ContactInput.safeParse(body);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((issue) => String(issue.path[0])))];
    return reply(400, { error: "invalid_fields", fields });
  }
  // Bots get a normal-looking success so they do not learn to adapt.
  if (looksLikeBot(parsed.data)) return reply(200, { ok: true });

  const sent = await sendContactEmail(parsed.data, localeFromRequest(request));
  return sent ? reply(200, { ok: true }) : reply(502, { error: "send_failed" });
}

export function GET() {
  return reply(405, { error: "method_not_allowed" }, { Allow: "POST" });
}
