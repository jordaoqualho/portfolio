import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import {
  about,
  cases,
  contact,
  currentlyBuilding,
  defineCase,
  experience,
  facets,
  principles,
  profile,
  projects,
  skills,
  stats,
  type EngineeringCase,
  type Experience,
  type Project,
} from "./profile";
import { privacy } from "./privacy";
import { ptProfile } from "./profile.pt";

const en = {
  profile,
  stats,
  facets: facets.map((f) => ({ id: f.id as string, label: f.label as string })),
  skills: skills.map((g) => ({ group: g.group, items: [...g.items] })),
  currentlyBuilding,
  about,
  principles,
  contact,
  experience,
  cases,
  projects,
  privacy,
};
export type Content = typeof en;

function portuguese(): Content {
  const t = ptProfile;
  return {
    profile: {
      ...profile,
      role: t.role,
      availability: t.availability,
      location: t.location,
      languages: t.languages,
    },
    stats: stats.map((stat, i) => ({ ...stat, ...t.stats[i] })),
    facets: en.facets.map((f) => ({ ...f, label: t.facets[f.id] ?? f.label })),
    skills: en.skills.map((g) => ({ ...g, group: t.skillGroups[g.group] ?? g.group })),
    currentlyBuilding: t.currentlyBuilding,
    about: t.about,
    principles: t.principles,
    contact: t.contact,
    experience: experience.map(
      (role): Experience => ({ ...role, ...t.roles[role.company] }),
    ),
    cases: cases.map((item): EngineeringCase => {
      const text = t.cases[item.slug];
      if (!text) return item;
      return defineCase({
        ...item,
        category: text.category,
        title: text.title,
        summary: text.summary,
        sections: item.sections.map((section) => ({
          ...section,
          ...text.sections[section.id],
        })),
      });
    }),
    projects: projects.map((project): Project => {
      const text = t.projects[project.name];
      if (!text) return project;
      const { detail, ...rest } = text;
      return {
        ...project,
        ...rest,
        detail:
          project.detail && detail
            ? {
                ...project.detail,
                ...detail,
                image: project.detail.image && {
                  ...project.detail.image,
                  alt: detail.imageAlt ?? project.detail.image.alt,
                },
              }
            : project.detail,
      };
    }),
    privacy: {
      ...privacy,
      updated: t.privacy.updated,
      intro: t.privacy.intro,
      sections: privacy.sections.map((section) => ({
        ...section,
        ...t.privacy.sections[section.id],
      })),
    },
  };
}

const byLocale: Record<Locale, Content> = { en, pt: portuguese() };
export const getContent = (locale: Locale) => byLocale[locale];

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "Dec 2023 – Aug 2026" in the reader's language: "dez. 2023 – ago. 2026".
export function formatDates(dates: string, locale: Locale) {
  if (locale === "en") return dates;
  const format = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric", timeZone: "UTC" });
  return dates
    .split("–")
    .map((part) => {
      const [month, year] = part.trim().split(" ");
      const index = monthNames.indexOf(month);
      if (index < 0) return part.trim();
      return format.format(new Date(Date.UTC(Number(year), index, 1))).replace(" de ", " ");
    })
    .join(" – ");
}

// Header menu entries for a locale (serializable, passed to the client).
export function workMenuItems(locale: Locale) {
  const { cases, projects } = getContent(locale);
  const prefix = (path: string) => localePath(locale, path);
  return {
    cases: cases.map((item) => ({
      href: prefix(`/work/${item.slug}/`),
      category: item.category,
      title: item.title,
    })),
    projects: projects
      .filter((project) => project.slug || project.href)
      .map((project) => ({
        href: project.slug ? prefix(`/projects/${project.slug}/`) : prefix(project.href!),
        name: project.name,
        line: project.detail?.tagline ?? project.description,
      })),
  };
}
