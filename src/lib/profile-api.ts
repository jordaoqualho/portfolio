import {
  about,
  cases,
  contact,
  experience,
  principleStrings,
  profile,
  skills,
} from "@/data/profile";

// The queries behind both the REST API and the MCP tools, so the two
// interfaces can never disagree.

export function getProfile() {
  return { ...profile, about, contact, engineeringPrinciples: principleStrings };
}

export function listCases() {
  return cases.map((c) => ({
    number: c.number,
    slug: c.slug,
    title: c.title,
    category: c.category,
    summary: c.summary,
    technologies: c.technologies,
  }));
}

export const caseSlugs = cases.map((c) => c.slug);

export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug) ?? null;
}

export function queryExperience({
  technology,
  company,
}: {
  technology?: string;
  company?: string;
}) {
  let filtered = experience;
  if (company) {
    const query = company.toLowerCase();
    filtered = filtered.filter((exp) =>
      exp.company.toLowerCase().includes(query),
    );
  }
  if (technology) {
    const query = technology.toLowerCase();
    filtered = filtered.filter((exp) =>
      exp.technologies.some((tech) => tech.toLowerCase().includes(query)),
    );
  }
  return { count: filtered.length, experiences: filtered };
}

export function evaluateJobFit(jobDescription: string) {
  const jdLower = jobDescription.toLowerCase();

  // Collect all verified technologies across skills and experiences
  const allVerifiedSkills = Array.from(
    new Set([
      ...skills.flatMap((s) => s.items),
      ...experience.flatMap((e) => e.technologies),
      ...cases.flatMap((c) => c.technologies),
    ]),
  );

  const matchingSkills = allVerifiedSkills.filter((skill) =>
    jdLower.includes(skill.toLowerCase()),
  );

  // Check case relevance
  const relevantCases = cases
    .filter((c) => {
      const techMatch = c.technologies.some((t) =>
        jdLower.includes(t.toLowerCase()),
      );
      const textMatch =
        jdLower.includes(c.category.toLowerCase()) ||
        (c.problem && jdLower.includes("incident")) ||
        (c.slug.includes("ecommerce") && jdLower.includes("commerce")) ||
        (c.slug.includes("financial") &&
          (jdLower.includes("fintech") || jdLower.includes("financial")));
      return techMatch || textMatch;
    })
    .map((c) => ({ slug: c.slug, title: c.title, summary: c.summary }));

  // High-level role matching
  const isSeniorOrStaff =
    jdLower.includes("senior") ||
    jdLower.includes("tech lead") ||
    jdLower.includes("lead");
  const isFullStackOrBackend =
    jdLower.includes("backend") ||
    jdLower.includes("full stack") ||
    jdLower.includes("fullstack");

  return {
    candidate: profile.name,
    roleMatch: {
      isSeniorLevelMatch: isSeniorOrStaff,
      isBackendOrFullStackMatch: isFullStackOrBackend,
      yearsOfExperience: "6+ years in production systems",
      scaleHandled:
        "7M+ active users (fintech), 12k+ concurrent users (live commerce)",
      languageMatch:
        "English C1 Advanced (comfortable with international/US/LATAM remote teams)",
    },
    matchingTechnologiesFound: matchingSkills,
    relevantProductionCases: relevantCases,
    recommendation:
      matchingSkills.length > 0 && isFullStackOrBackend
        ? "Strong match on core backend/full stack stack. Review verified production cases for investigation & reliability depth."
        : "Review specific requirements. Jordão's core depth is Node.js, TypeScript, AWS, Google Cloud Platform, React, and production reliability.",
  };
}
