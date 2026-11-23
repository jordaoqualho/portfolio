import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { experience, profile, skills } from "@/data/profile";
import { buildResume } from "@/lib/resume";
import { renderResumePdf } from "@/lib/resume-pdf";

describe("CV generated from the site content", () => {
  const cv = buildResume();

  it("lists every role in site order, current role first", () => {
    expect(cv.roles.map((r) => r.dates)).toEqual(experience.map((r) => r.dates));
    expect(cv.roles[0].heading).toBe("Senior Backend Engineer (Full-time) | Sicredi Dexis");
    expect(cv.roles[0].dates).toBe("Oct 2026 – Present");
    expect(cv.roles[1].heading).toBe(
      "Senior Backend Engineer (Contract / B2B) | Afinz / client Sem Parar",
    );
  });

  it("uses CV bullets when a role has them and the summary otherwise", () => {
    for (const [i, role] of experience.entries())
      expect(cv.roles[i].points).toEqual(role.highlights ?? [role.summary]);
    expect(cv.roles[0].points.join(" ")).toContain("Zallpy Digital");
  });

  it("keeps project-only tags out of the professional skills", () => {
    expect(cv.skills.map((s) => s.group)).toEqual(
      skills.map((g) => g.group).filter((g) => g !== "Project Experience"),
    );
  });

  it("formats contact details from the profile", () => {
    expect(cv.contact.map((c) => c.label)).toContain("+55 44 9970 0617");
    expect(cv.contact.map((c) => c.label)).toContain(profile.email);
  });

  it("serves the PDF at the URL the site links to", () => {
    const route = join(process.cwd(), "src/app", profile.resumePath, "route.ts");
    expect(existsSync(route), route).toBe(true);
  });

  it("renders a valid PDF", async () => {
    const pdf = await renderResumePdf(cv);
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(10_000);
  }, 30_000);
});

