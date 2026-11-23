import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { experience, profile, resumeFiles, skills } from "@/data/profile";
import { ptProfile } from "@/data/profile.pt";
import { getContent } from "@/data/content";
import { buildResume } from "@/lib/resume";
import { renderResumePdf } from "@/lib/resume-pdf";

describe("CV generated from the site content", () => {
  const cv = buildResume();
  const pt = buildResume("pt");

  it("lists every role in site order, current role first", () => {
    expect(cv.roles.map((r) => r.dates)).toEqual(experience.map((r) => r.dates));
    expect(cv.roles[0].heading).toBe("Senior Backend Engineer (Full-time) | Sicredi Dexis");
    expect(cv.roles[0].dates).toBe("Oct 2026 – Present");
    expect(cv.roles[1].heading).toBe("Senior Backend Engineer (Contract / B2B) | Sem Parar");
  });

  it("shows the contracting agency under the client", () => {
    expect(cv.roles[0].note).toBe("Contracted through Zallpy Digital.");
    expect(cv.roles[1].note).toBe("Contracted through Afinz.");
    expect(pt.roles[1].note).toBe("Contratado via Afinz.");
    expect(cv.roles[2].note).toBeUndefined();
  });

  it("uses CV bullets when a role has them and the summary otherwise", () => {
    for (const [i, role] of experience.entries())
      expect(cv.roles[i].points).toEqual(role.highlights ?? [role.summary]);
    expect(cv.roles[0].points[0]).toContain("300,000+ members");
  });

  it("keeps project-only tags out of the professional skills", () => {
    expect(cv.skills.map((s) => s.group)).toEqual(
      skills.map((g) => g.group).filter((g) => g !== "Project Experience"),
    );
    expect(pt.skills.map((s) => s.group)).not.toContain("Experiência em projetos");
    expect(pt.skills).toHaveLength(cv.skills.length);
  });

  it("formats contact details from the profile", () => {
    expect(cv.contact.map((c) => c.label)).toContain("+55 44 9970 0617");
    expect(cv.contact.map((c) => c.label)).toContain(profile.email);
  });

  it("writes the Portuguese CV in Portuguese", () => {
    expect(pt.role).toBe(ptProfile.role);
    expect(pt.summary).toBe(ptProfile.resume.summary);
    expect(pt.labels.experience).toBe("EXPERIÊNCIA PROFISSIONAL");
    expect(pt.roles[0].heading).toBe("Engenheiro de Backend Sênior (Tempo integral) | Sicredi Dexis");
    expect(pt.roles[0].dates).toMatch(/2026 – o momento$/);
    expect(pt.roles[0].points[0]).toContain("300 mil associados");
    for (const [i, role] of pt.roles.entries())
      expect(role.points, experience[i].company).toHaveLength(cv.roles[i].points.length);
  });

  it("serves each CV at the URL the site links to", () => {
    expect(profile.resumePath).toBe(`/resume/${resumeFiles.en}`);
    expect(getContent("pt").profile.resumePath).toBe(`/resume/${resumeFiles.pt}`);
    for (const file of Object.values(resumeFiles)) {
      const route = join(process.cwd(), "src/app/resume", file, "route.ts");
      expect(existsSync(route), route).toBe(true);
    }
  });

  it("renders a valid PDF in each language", async () => {
    for (const data of [cv, pt]) {
      const pdf = await renderResumePdf(data);
      expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
      expect(pdf.length).toBeGreaterThan(10_000);
    }
  }, 30_000);
});
