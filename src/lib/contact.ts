import { z } from "zod";
import { profile } from "@/data/profile";
import { defaultLocale, type Locale } from "@/i18n/config";
import { ownerNotificationEmail, visitorConfirmationEmail } from "./contact-email";

// The contact form's payload. `website` is a honeypot: hidden from people,
// filled in by bots. `startedAt` is when the form was rendered; submissions
// faster than a person can type are treated as bots too.
export const ContactInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().trim().max(200),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).optional().default(""),
  startedAt: z.number().int().optional(),
});
export type ContactInput = z.infer<typeof ContactInput>;

export const MIN_FILL_MS = 2500;

export function looksLikeBot(input: ContactInput, now = Date.now()) {
  if (input.website) return true;
  return input.startedAt !== undefined && now - input.startedAt < MIN_FILL_MS;
}

// Best-effort fixed window per client key. In-memory, so on serverless it is
// per instance: enough to stop a single script hammering the endpoint, not a
// global quota.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, now = Date.now()) {
  const entry = hits.get(key);
  if (!entry || entry.reset <= now) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
    }
    return { ok: true as const };
  }
  if (entry.count >= MAX_PER_WINDOW)
    return { ok: false as const, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  entry.count += 1;
  return { ok: true as const };
}

export const resetRateLimit = () => hits.clear();

async function sendViaResend(key: string, payload: Record<string, unknown>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((error) => {
    console.error("[contact] Resend request failed", error);
    return null;
  });
  if (!response?.ok) {
    if (response) console.error("[contact] Resend rejected", response.status, await response.text());
    return false;
  }
  return true;
}

// Sends the owner's notification (reply-to is the visitor, so answering from
// Gmail goes straight to them) and, best-effort, a branded confirmation back
// to the visitor. The confirmation's failure does not fail the request: the
// message already reached the owner, which is the part that matters. Note:
// without a verified sending domain, Resend's onboarding@resend.dev address
// can only deliver to the account owner, so the visitor confirmation only
// actually lands once a custom domain is verified.
export async function sendContactEmail(input: ContactInput, locale: Locale = defaultLocale) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set");
    return false;
  }
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO_EMAIL || profile.email;

  const owner = ownerNotificationEmail(input);
  const ownerSent = await sendViaResend(key, {
    from,
    to: [to],
    reply_to: input.email,
    subject: owner.subject,
    text: owner.text,
    html: owner.html,
  });
  if (!ownerSent) return false;

  const confirmation = visitorConfirmationEmail(input, locale);
  await sendViaResend(key, {
    from,
    to: [input.email],
    reply_to: to,
    subject: confirmation.subject,
    text: confirmation.text,
    html: confirmation.html,
  });

  return true;
}
