// Client-side rules for the contact form. They mirror the server schema in
// src/lib/contact.ts, so the browser catches mistakes before a request.

export type ContactField = "name" | "email" | "company" | "message";
export type ContactValues = Record<ContactField, string>;
export type FieldIssue = "required" | "short" | "format" | "long";

export const limits = {
  name: { min: 2, max: 100 },
  email: { max: 200 },
  company: { max: 120 },
  message: { min: 10, max: 5000 },
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function fieldIssue(field: ContactField, raw: string): FieldIssue | null {
  const value = raw.trim();
  switch (field) {
    case "name":
      if (!value) return "required";
      return value.length < limits.name.min ? "short" : null;
    case "email":
      if (!value) return "required";
      return emailPattern.test(value) && value.length <= limits.email.max ? null : "format";
    case "company":
      return value.length > limits.company.max ? "long" : null;
    case "message":
      if (!value) return "required";
      return value.length < limits.message.min ? "short" : null;
  }
}

export function validateAll(values: ContactValues) {
  const issues: Partial<Record<ContactField, FieldIssue>> = {};
  for (const field of Object.keys(limits) as ContactField[]) {
    const issue = fieldIssue(field, values[field]);
    if (issue) issues[field] = issue;
  }
  return issues;
}

// Common domain typos -> the domain people almost certainly meant.
const domains = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "live.com",
  "proton.me",
  "protonmail.com",
];

function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}

// "ana@gmial.con" -> "ana@gmail.com". Only suggests when one or two edits
// away from a well-known domain, never for company domains.
export function suggestEmail(raw: string): string | null {
  const value = raw.trim().toLowerCase();
  const at = value.lastIndexOf("@");
  if (at < 1) return null;
  const domain = value.slice(at + 1);
  if (!domain || domains.includes(domain)) return null;
  let best: string | null = null;
  let bestScore = 3;
  for (const candidate of domains) {
    const score = distance(domain, candidate);
    if (score > 0 && score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return best ? `${value.slice(0, at)}@${best}` : null;
}
