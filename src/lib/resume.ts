import { resume, resumeFiles, skills } from "@/data/profile";
import { ptProfile } from "@/data/profile.pt";
import { formatDates, getContent } from "@/data/content";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { siteUrl } from "./site";

// The CV as plain data, built from the same content the site renders. The PDF
// layout (resume-pdf.tsx) only draws what this returns.
export type ResumeRole = {
  heading: string;
  // "Contracted through Afinz." when the company is the client.
  note?: string;
  dates: string;
  points: string[];
  technologies: string;
};
export type Resume = {
  locale: Locale;
  fileName: string;
  name: string;
  role: string;
  contact: { label: string; href?: string }[];
  summary: string;
  roles: ResumeRole[];
  skills: { group: string; items: string }[];
  languages: string[];
  labels: ReturnType<typeof ui>["cv"];
};

// Project-only tags are side projects, not professional experience.
const CV_SKILL_GROUPS_EXCLUDED = new Set(["Project Experience"]);

// "554499700617" → "+55 44 9970 0617"
const formatPhone = (digits: string) =>
  `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;

// Words that change with the language; facts always come from profile.ts.
const resumeText = {
  en: resume,
  pt: { ...resume, ...ptProfile.resume },
};

export function buildResume(locale: Locale = "en"): Resume {
  const { profile, experience, skills: groups } = getContent(locale);
  const text = resumeText[locale];
  const t = ui(locale);
  return {
    locale,
    fileName: resumeFiles[locale],
    name: text.fullName,
    role: profile.role,
    contact: [
      { label: text.location },
      { label: formatPhone(profile.whatsapp), href: `tel:+${profile.whatsapp}` },
      { label: profile.email, href: `mailto:${profile.email}` },
      { label: siteUrl.replace(/^https?:\/\//, ""), href: siteUrl },
    ],
    summary: text.summary,
    roles: experience.map((role) => ({
      heading: [
        role.title,
        role.employment ? ` (${role.employment.split(" · ").join(" / ")})` : "",
        ` | ${role.company}`,
      ].join(""),
      note: role.contractedThrough
        ? t.experience.contractedThrough(role.contractedThrough)
        : undefined,
      dates: formatDates(role.dates, locale),
      points: role.highlights ?? [role.summary],
      technologies: role.technologies.join(", "),
    })),
    // Group names are translated, so match the English group at the same index.
    skills: groups
      .filter((_, i) => !CV_SKILL_GROUPS_EXCLUDED.has(skills[i].group))
      .map((group) => ({ group: group.group, items: group.items.join(", ") })),
    languages: [...text.languages],
    labels: t.cv,
  };
}
