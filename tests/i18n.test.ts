import { describe, expect, it } from "vitest";
import { cases, experience, projects, stats } from "@/data/profile";
import { privacy } from "@/data/privacy";
import { ptProfile } from "@/data/profile.pt";
import { formatDates, getContent } from "@/data/content";

// Portuguese must cover every piece of English content, point for point,
// so a new case, section or bullet cannot ship half-translated.
describe("Portuguese content parity", () => {
  it("translates every case section with the same number of points", () => {
    for (const item of cases) {
      const text = ptProfile.cases[item.slug];
      expect(text, item.slug).toBeDefined();
      for (const section of item.sections) {
        const pt = text.sections[section.id];
        expect(pt, `${item.slug}#${section.id}`).toBeDefined();
        expect(Boolean(pt.body), `${item.slug}#${section.id} body`).toBe(Boolean(section.body));
        expect(pt.points?.length, `${item.slug}#${section.id} points`).toBe(section.points?.length);
      }
    }
  });

  it("translates every role, project and stat", () => {
    for (const role of experience) {
      const pt = ptProfile.roles[role.company];
      expect(pt, role.company).toBeDefined();
      expect(Boolean(pt.note), `${role.company} note`).toBe(Boolean(role.note));
    }
    for (const project of projects) {
      const pt = ptProfile.projects[project.name];
      expect(pt, project.name).toBeDefined();
      if (!project.detail) continue;
      const d = pt.detail!;
      expect(d, `${project.name} detail`).toBeDefined();
      for (const key of ["features", "engineering", "motivation", "decision", "limits"] as const)
        expect(d[key]?.length, `${project.name}.${key}`).toBe(project.detail[key]?.length);
      for (const key of ["engineeringIntro", "engineeringNote", "credit", "callout"] as const)
        expect(Boolean(d[key]), `${project.name}.${key}`).toBe(Boolean(project.detail[key]));
    }
    expect(ptProfile.stats).toHaveLength(stats.length);
    for (const section of privacy.sections)
      expect(ptProfile.privacy.sections[section.id], section.id).toBeDefined();
  });

  it("keeps facts from the English source", () => {
    const pt = getContent("pt");
    expect(pt.cases.map((c) => c.technologies)).toEqual(cases.map((c) => c.technologies));
    expect(pt.experience.map((r) => r.dates)).toEqual(experience.map((r) => r.dates));
    expect(pt.stats.map((s) => s.value)).toEqual(stats.map((s) => s.value));
    expect(pt.cases[0].outcome).toContain("100 clientes");
  });

  it("formats dates for Portuguese readers", () => {
    expect(formatDates("Dec 2023 – Aug 2026", "en")).toBe("Dec 2023 – Aug 2026");
    expect(formatDates("Dec 2023 – Aug 2026", "pt")).toMatch(/^dez\.? 2023 – ago\.? 2026$/);
  });
});
