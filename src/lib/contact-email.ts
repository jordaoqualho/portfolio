import { profile } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import { siteUrl } from "@/lib/site";
import type { ContactInput } from "./contact";

// The site's light palette (src/app/globals.css). Accent stays as sparing as
// it is on the site: the wordmark dot and links only.
const c = {
  page: "#f4f5f5",
  card: "#ffffff",
  surface: "#f4f5f5",
  fg: "#20252b",
  muted: "#656b73",
  border: "#dfe2e5",
  accent: "#375eaa",
};
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
const host = siteUrl.replace(/^https?:\/\//, "");

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

const eyebrow = (text: string) =>
  `<span style="font-family:${MONO};font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:${c.muted};">${escapeHtml(text)}</span>`;

const messageBlock = (message: string) =>
  `<div style="background:${c.surface};border:1px solid ${c.border};border-radius:5px;padding:16px 18px;font-family:${SANS};font-size:14px;line-height:1.65;color:${c.fg};white-space:pre-wrap;">${escapeHtml(message)}</div>`;

const footerLink = (href: string, label: string) =>
  `<a href="${href}" style="color:${c.muted};text-decoration:none;">${label}</a>`;

// Table-based layout: the one structure that renders consistently across
// Gmail, Apple Mail and Outlook. Header mirrors the site's: wordmark left,
// mono eyebrow right, hairline rule below.
function shell(options: { lang: string; title: string; preheader: string; label: string; bodyHtml: string; footerHtml: string }) {
  const { lang, title, preheader, label, bodyHtml, footerHtml } = options;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${c.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.page};padding:40px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${c.card};border:1px solid ${c.border};border-radius:8px;">
<tr><td style="padding:20px 28px;border-bottom:1px solid ${c.border};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font-family:${SANS};font-size:22px;font-weight:700;letter-spacing:-0.07em;line-height:1;color:${c.fg};">jq<span style="color:${c.accent};">.</span></td>
<td align="right">${eyebrow(label)}</td>
</tr></table>
</td></tr>
<tr><td style="padding:28px;">
${bodyHtml}
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid ${c.border};font-family:${MONO};font-size:11px;color:${c.muted};">
${footerHtml}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// To the owner: who wrote in, what they said, one action. Always English — it
// has one reader.
export function ownerNotificationEmail(input: ContactInput) {
  const from = input.company ? `${input.name} (${input.company})` : input.name;
  const subject = `Portfolio message from ${from}`.slice(0, 180);
  const firstName = input.name.trim().split(/\s+/)[0];
  const text = [`${input.name}${input.company ? ` · ${input.company}` : ""}`, input.email, "", input.message].join("\n");

  const meta =
    `<a href="mailto:${escapeHtml(input.email)}" style="color:${c.accent};text-decoration:none;">${escapeHtml(input.email)}</a>` +
    (input.company ? `<span style="color:${c.border};">&nbsp;&nbsp;/&nbsp;&nbsp;</span>${escapeHtml(input.company)}` : "");
  const replyHref = `mailto:${escapeHtml(input.email)}?subject=${encodeURIComponent("Re: your message")}`;

  const bodyHtml = `<p style="margin:0 0 4px;font-family:${SANS};font-size:18px;font-weight:600;letter-spacing:-0.01em;color:${c.fg};">${escapeHtml(input.name)}</p>
<p style="margin:0 0 20px;font-family:${SANS};font-size:13px;color:${c.muted};">${meta}</p>
${messageBlock(input.message)}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:22px;"><tr>
<td style="background:${c.fg};border-radius:5px;"><a href="${replyHref}" style="display:inline-block;padding:11px 18px;font-family:${SANS};font-size:13px;font-weight:500;color:#ffffff;text-decoration:none;">Reply to ${escapeHtml(firstName)} &rarr;</a></td>
</tr></table>`;

  const html = shell({
    lang: "en",
    title: subject,
    preheader: input.message.slice(0, 140),
    label: "New message",
    bodyHtml,
    footerHtml: `Contact form &middot; ${footerLink(siteUrl, host)}`,
  });
  return { subject, text, html };
}

const CONFIRM_COPY: Record<
  Locale,
  { subject: string; label: string; heading: (name: string) => string; intro: string; yours: string }
> = {
  en: {
    subject: `Message received — ${profile.name}`,
    label: "Message received",
    heading: (name) => `Thanks, ${name}.`,
    intro: "Your message arrived. I usually reply within one or two business days.",
    yours: "Your message",
  },
  pt: {
    subject: `Mensagem recebida — ${profile.name}`,
    label: "Mensagem recebida",
    heading: (name) => `Obrigado, ${name}.`,
    intro: "Sua mensagem chegou. Costumo responder em um ou dois dias úteis.",
    yours: "Sua mensagem",
  },
};

// To the visitor: proof the form worked, so they are not left wondering.
// Best-effort only — see sendContactEmail for why its failure does not fail
// the request.
export function visitorConfirmationEmail(input: ContactInput, locale: Locale) {
  const copy = CONFIRM_COPY[locale] ?? CONFIRM_COPY.en;
  const firstName = input.name.trim().split(/\s+/)[0] || input.name.trim();
  const text = [copy.heading(firstName), copy.intro, "", input.message, "", profile.name, profile.role].join("\n");

  const bodyHtml = `<p style="margin:0 0 6px;font-family:${SANS};font-size:18px;font-weight:600;letter-spacing:-0.01em;color:${c.fg};">${escapeHtml(copy.heading(firstName))}</p>
<p style="margin:0 0 22px;font-family:${SANS};font-size:14px;line-height:1.6;color:${c.muted};">${escapeHtml(copy.intro)}</p>
<p style="margin:0 0 8px;">${eyebrow(copy.yours)}</p>
${messageBlock(input.message)}
<p style="margin:24px 0 0;font-family:${SANS};font-size:14px;font-weight:600;color:${c.fg};">${escapeHtml(profile.name)}</p>
<p style="margin:2px 0 0;font-family:${SANS};font-size:13px;color:${c.muted};">${escapeHtml(profile.role)}</p>`;

  const html = shell({
    lang: locale === "pt" ? "pt-BR" : "en",
    title: copy.subject,
    preheader: copy.intro,
    label: copy.label,
    bodyHtml,
    footerHtml: [footerLink(siteUrl, host), footerLink(profile.linkedin, "LinkedIn"), footerLink(profile.github, "GitHub")].join(
      " &middot; ",
    ),
  });
  return { subject: copy.subject, text, html };
}
