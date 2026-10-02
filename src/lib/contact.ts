import { z } from "zod";
import { profile } from "@/data/profile";

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

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function contactEmail(input: ContactInput) {
  const from = input.company ? `${input.name} (${input.company})` : input.name;
  const subject = `Portfolio message from ${from}`.slice(0, 180);
  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.company && `Company: ${input.company}`,
    "",
    input.message,
  ]
    .filter((line) => line !== "")
    .join("\n");
  const html = `<p><strong>Name:</strong> ${escapeHtml(input.name)}<br><strong>Email:</strong> ${escapeHtml(input.email)}${
    input.company ? `<br><strong>Company:</strong> ${escapeHtml(input.company)}` : ""
  }</p><p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>`;
  return { subject, text, html };
}

// Sends through Resend's REST API. replyTo is the visitor, so answering from
// Gmail goes straight to them. Returns false when the key is missing or the
// provider rejects the message; details go to the server log only.
export async function sendContactEmail(input: ContactInput) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set");
    return false;
  }
  const { subject, text, html } = contactEmail(input);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || profile.email],
      reply_to: input.email,
      subject,
      text,
      html,
    }),
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
