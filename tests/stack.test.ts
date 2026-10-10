import { describe, expect, it } from "vitest";
import { experience, skills } from "@/data/profile";
import { ui } from "@/i18n/ui";
import { stackEvidence } from "@/lib/stack";

const find = (name: string) =>
  stackEvidence()
    .flatMap((g) => g.items)
    .find((item) => item.name === name)!;

describe("stack evidence", () => {
  it("keeps every listed skill, in order", () => {
    expect(stackEvidence().map((g) => g.items.map((i) => i.name))).toEqual(
      skills.map((g) => g.items),
    );
  });

  it("links a skill to every role that lists it", () => {
    const expected = experience
      .filter((role) => role.technologies.includes("Node.js"))
      .map((role) => role.company);
    expect(find("Node.js").roles.map((r) => r.company)).toEqual(expected);
    expect(find("Node.js").since).toBe(2020);
  });

  it("resolves aliases such as Google Cloud Platform", () => {
    expect(find("Google Cloud Platform").roles.length).toBeGreaterThan(0);
    expect(find("Google Cloud Platform").cases.map((c) => c.slug)).toContain(
      "live-commerce-traffic-spike",
    );
  });

  it("does not double count overlapping roles", () => {
    // React: Sully (Mar–Apr 2026) overlaps nothing else listing React, so the
    // total stays below the sum of calendar spans from 2020 to 2026.
    const react = find("React");
    expect(react.years).toBeLessThanOrEqual(2026 - 2020);
  });

  it("uses duration or qualitative evidence instead of role counts", () => {
    expect(find("Node.js").evidenceLabel).toBe("years");
    expect(find("AWS").evidenceLabel).toBe("exposure");
    expect(find("AWS").years).toBe(5);
    expect(find("Storybook").roles.map((r) => r.company)).toEqual(
      expect.arrayContaining(["Sully", "Grupo Soma"]),
    );
    expect(find("AWS").roles.map((r) => r.company)).not.toContain("Sully");
    expect(find("AWS").roles.map((r) => r.company)).not.toContain("ROIT GROUP");
    expect(find("Google Cloud Platform").roles.map((r) => r.company)).toContain("Sully");
    expect(find("Google Cloud Platform").roles.map((r) => r.company)).toContain("ROIT GROUP");
    expect(find("PostgreSQL").roles.map((r) => r.company)).not.toContain("ROIT GROUP");
    expect(find("Firestore").roles.map((r) => r.company)).toContain("ROIT GROUP");
    expect(find("AdonisJS").roles.map((r) => r.company)).toContain("Voyager Portal");
    expect(find("GitHub Actions").evidenceLabel).toBe("years");
    expect(find("Micro Frontends").evidenceLabel).toBe("years");
    expect(find("Automated Testing").evidenceLabel).toBe("years");
    expect(find("Next.js").evidenceLabel).toBe("years");
    expect(find("Next.js").roles.map((r) => r.company)).toContain("Lorena Felicio");
  });

  it("maps the confirmed engineering practices to the right roles", () => {
    const companies = (name: string) => find(name).roles.map((role) => role.company);
    const allCompanies = experience.map((role) => role.company);

    expect(companies("Jest")).toEqual(allCompanies);
    expect(companies("Automated Testing")).toEqual(allCompanies);
    expect(companies("Technical Leadership")).toEqual(
      expect.arrayContaining(["Afinz / client Sem Parar", "Grupo Soma"]),
    );
    expect(companies("Caching Strategies")).toContain("Grupo Soma");
    expect(companies("Event-Driven Architecture")).toContain("Afinz / client Sem Parar");
    expect(companies("Monolithic Architecture")).toEqual(
      expect.arrayContaining(["Grupo Soma", "Cria Studio", "Lorena Felicio"]),
    );
    expect(companies("Distributed Systems")).not.toContain("Grupo Soma");
    expect(skills.flatMap((group) => group.items)).not.toEqual(
      expect.arrayContaining(["Serverless", "Cloud Functions"]),
    );
  });

  it("keeps language and backend framework assignments per role", () => {
    expect(find("TypeScript").roles.map((r) => r.company)).toEqual(
      expect.arrayContaining(["Afinz / client Sem Parar", "Sully", "ROIT GROUP", "Voyager Portal"]),
    );
    expect(find("JavaScript").roles.map((r) => r.company)).toEqual(
      expect.arrayContaining(["Grupo Soma", "Cria Studio", "Lorena Felicio"]),
    );
    expect(find("NestJS").roles.map((r) => r.company)).toEqual(
      expect.arrayContaining(["Afinz / client Sem Parar", "Sully", "ROIT GROUP"]),
    );
    expect(find("Express.js").roles.map((r) => r.company)).toEqual(
      expect.arrayContaining([
        "Grupo Soma",
        "Cria Studio",
        "Lorena Felicio",
      ]),
    );
    expect(find("TypeScript").durationMonths).toBe(44);
    expect(find("JavaScript").durationMonths).toBe(34);
    expect(find("NestJS").durationMonths).toBe(37);
    expect(find("Express.js").durationMonths).toBe(34);
    expect(find("AdonisJS").roles.map((r) => r.company)).toEqual(["Voyager Portal"]);
  });

  it("uses exact durations in the detail card and a clean compact label", () => {
    expect(find("WebSockets").durationMonths).toBe(19);
    expect(ui("pt").stack.exactProfessional(19)).toBe(
      "1 ano e 7 meses de experiência profissional",
    );
    expect(ui("pt").stack.compactExposure(5)).toBe("5+ anos");
    expect(ui("en").stack.compactExposure(5)).toBe("5+ yrs");
  });

  it("does not expose technologies outside the confirmed allowlist", () => {
    expect(stackEvidence().flatMap((group) => group.items).map((item) => item.name)).not.toContain(
      "OpenAPI",
    );
  });

  it("links project experience tags to the projects that declare them", () => {
    expect(find("Next.js").projects.map((p) => p.slug)).toEqual(
      expect.arrayContaining(["ana-caroline-hipolito", "bombinhas", "deadfolio"]),
    );
    expect(find("MCP").projects.map((p) => p.slug)).toEqual(
      expect.arrayContaining(["imemory"]),
    );
  });

  it("keeps project-only tags separate from professional role evidence", () => {
    const roleTechnologies = new Set(experience.flatMap((role) => role.technologies));
    const projectOnly = skills.find((group) => group.group === "Project Experience")!;

    expect(projectOnly.items.filter((item) => roleTechnologies.has(item))).toEqual([]);
    expect(projectOnly.items).not.toEqual(expect.arrayContaining(["Next.js", "Vite", "Playwright"]));
  });
});
