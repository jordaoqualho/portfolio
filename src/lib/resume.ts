import { experience, profile, resume, skills } from "@/data/profile";
import { siteUrl } from "./site";

// The CV as plain data, built from the same content the site renders. The PDF
// layout (resume-pdf.tsx) only draws what this returns.
export type ResumeRole = {
  heading: string;
  dates: string;
  points: string[];
  technologies: string;
};
export type Resume = {
  name: string;
  role: string;
  contact: { label: string; href?: string }[];
  summary: string;
  roles: ResumeRole[];
  skills: { group: string; items: string }[];
  languages: string[];
};

// Project-only tags are side projects, not professional experience.
const CV_SKILL_GROUPS_EXCLUDED = new Set(["Project Experience"]);

// "554499700617" → "+55 44 9970 0617"
const formatPhone = (digits: string) =>
  `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;

export function buildResume(): Resume {
  return {
    name: resume.fullName,
    role: profile.role,
    contact: [
      { label: resume.location },
      { label: formatPhone(profile.whatsapp), href: `tel:+${profile.whatsapp}` },
      { label: profile.email, href: `mailto:${profile.email}` },
      { label: siteUrl.replace(/^https?:\/\//, ""), href: siteUrl },
    ],
    summary: resume.summary,
    roles: experience.map((role) => ({
      heading: [
        role.title,
        role.employment ? ` (${role.employment.split(" · ").join(" / ")})` : "",
        ` | ${role.company}`,
      ].join(""),
      dates: role.dates,
      points: role.highlights ?? [role.summary],
      technologies: role.technologies.join(", "),
    })),
    skills: skills
      .filter((group) => !CV_SKILL_GROUPS_EXCLUDED.has(group.group))
      .map((group) => ({ group: group.group, items: group.items.join(", ") })),
    languages: resume.languages,
  };
}
