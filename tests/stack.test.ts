import { describe, expect, it } from "vitest";
import { experience, skills } from "@/data/profile";
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

  it("resolves aliases such as GCP", () => {
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

  it("returns no evidence for skills absent from roles and cases", () => {
    const adonis = find("AdonisJS");
    expect(adonis.roles).toEqual([]);
    expect(adonis.years).toBeUndefined();
  });
});
