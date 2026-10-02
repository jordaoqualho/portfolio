import { cases as allCases, experience as allRoles, skills as allSkills } from "@/data/profile";

type Source = {
  cases: typeof allCases;
  experience: typeof allRoles;
  skills: { group: string; items: string[] }[];
};

// Skill labels that appear under a different name in roles and cases.
const aliases: Record<string, string[]> = {
  "Google Cloud Platform": ["GCP", "Cloud Run", "Google Cloud Run"],
  "REST APIs": ["External APIs"],
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
export type StackItem = {
  name: string;
  roles: StackRole[];
  cases: StackCase[];
  since?: number;
  years?: number;
};
export type StackGroup = { group: string; items: StackItem[] };

const yearSpan = (dates: string) => {
  const [start, end] = dates.split("–").map((d) => d.trim().split(" ")[1]);
  return start === end ? start : `${start}–${end}`;
};

// Links every listed skill to the roles and cases that mention it. Only what
// the profile data states is used, so the evidence matches the CV.
// Pass a locale's content for translated titles; matching always runs on the
// English technology names, which both languages share.
export function stackEvidence(
  { cases, experience, skills }: Source = {
    cases: allCases,
    experience: allRoles,
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
      return {
        name,
        roles: roles.map((role) => ({
          company: role.company,
          years: yearSpan(role.dates),
        })),
        cases: cases
          .filter((item) => uses(item.technologies))
          .map(({ slug, title }) => ({ slug, title })),
        since: ranges.length
          ? Math.floor(Math.min(...ranges.map((r) => r.start)) / 12)
          : undefined,
        years: ranges.length
          ? Math.floor(coveredMonths(ranges) / 12)
          : undefined,
      };
    }),
  }));
}
