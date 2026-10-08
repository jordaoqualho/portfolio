import {
  cases as allCases,
  experience as allRoles,
  projects as allProjects,
  skills as allSkills,
} from "@/data/profile";

type Source = {
  cases: typeof allCases;
  experience: typeof allRoles;
  projects: typeof allProjects;
  skills: { group: string; items: string[] }[];
};

// Skill labels that appear under a different name in roles and cases.
const aliases: Record<string, string[]> = {
  "Google Cloud Platform": ["GCP"],
};

// A role mentioning a technology does not always mean the whole role was
// spent using it. Keep these cases qualitative (or explicitly marked as
// exposure) instead of presenting a false level of precision.
const evidenceLabels: Record<string, StackEvidenceLabel> = {
  AWS: "exposure",
  PostgreSQL: "exposure",
  SQS: "exposure",
};

// Manual confirmations override the conservative calendar calculation when
// the user has explicitly established the duration (AWS and TypeScript).
const confirmedYears: Record<string, number> = {
  AWS: 5,
  TypeScript: 3,
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "Dec 2023" -> months since year 0, so ranges can be merged arithmetically.
function toMonth(value: string) {
  const [month, year] = value.trim().split(" ");
  return Number(year) * 12 + months.indexOf(month);
}

function parseRange(dates: string) {
  const [start, end] = dates.split("–").map(toMonth);
  return { start, end };
}

// Overlapping roles (e.g. an advisory contract during a full-time one) are
// merged so time is never counted twice.
function coveredMonths(ranges: { start: number; end: number }[]) {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  let total = 0;
  let cursor = -Infinity;
  for (const { start, end } of sorted) {
    const from = Math.max(start, cursor);
    if (end > from) total += end - from;
    cursor = Math.max(cursor, end);
  }
  return total;
}

export type StackRole = { company: string; years: string };
export type StackCase = { slug: string; title: string };
export type StackProject = { slug: string; name: string };
export type StackEvidenceLabel =
  | "years"
  | "exposure"
  | "professional"
  | "project"
  | "case"
  | "none";
export type StackItem = {
  name: string;
  roles: StackRole[];
  cases: StackCase[];
  projects: StackProject[];
  evidenceLabel: StackEvidenceLabel;
  since?: number;
  years?: number;
  durationMonths?: number;
};
export type StackGroup = { group: string; items: StackItem[] };

const yearSpan = (dates: string) => {
  const [start, end] = dates.split("–").map((d) => d.trim().split(" ")[1]);
  return start === end ? start : `${start}–${end}`;
};

// Links every listed skill to roles, cases and projects that mention it. Only
// what the profile data states is used, so the evidence matches the CV and the
// portfolio instead of inferring experience from a technology name alone.
// Pass a locale's content for translated titles; matching always runs on the
// English technology names, which both languages share.
export function stackEvidence(
  { cases, experience, projects, skills }: Source = {
    cases: allCases,
    experience: allRoles,
    projects: allProjects,
    skills: allSkills.map((g) => ({ group: g.group, items: [...g.items] })),
  },
): StackGroup[] {
  return skills.map(({ group, items }) => ({
    group,
    items: items.map((name) => {
      const names = new Set([name, ...(aliases[name] ?? [])]);
      const uses = (list: string[]) => list.some((t) => names.has(t));
      const roles = experience.filter((role) => uses(role.technologies));
      const ranges = roles.map((role) => parseRange(role.dates));
      const relatedCases = casesForSkill(cases, uses);
      const relatedProjects = projectsForSkill(projects, uses);
      const durationMonths = ranges.length
        ? coveredMonths(ranges)
        : undefined;
      const evidenceLabel = roles.length
        ? evidenceLabels[name] ?? "years"
        : relatedProjects.length
          ? "project"
          : relatedCases.length
            ? "case"
            : "none";
      return {
        name,
        roles: roles.map((role) => ({
          company: role.company,
          years: yearSpan(role.dates),
        })),
        cases: relatedCases,
        projects: relatedProjects,
        evidenceLabel,
        since: ranges.length
          ? Math.floor(Math.min(...ranges.map((r) => r.start)) / 12)
          : undefined,
        durationMonths,
        years: ranges.length
          ? confirmedYears[name] ?? Math.floor(durationMonths! / 12)
          : undefined,
      };
    }),
  }));
}

function casesForSkill(
  source: Source["cases"],
  uses: (technologies: string[]) => boolean,
): StackCase[] {
  return source
    .filter((item) => uses(item.technologies))
    .map(({ slug, title }) => ({ slug, title }));
}

function projectsForSkill(
  source: Source["projects"],
  uses: (technologies: string[]) => boolean,
): StackProject[] {
  return source
    .filter((project) => {
      const technologies = [
        ...(project.stack ?? []),
        ...(project.detail?.technologies ?? []),
      ];
      return uses(technologies);
    })
    .filter((project) => Boolean(project.slug))
    .map((project) => ({ slug: project.slug!, name: project.name }));
}
