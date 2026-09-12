export const siteUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://jordao-qualho.vercel.app"
).replace(/\/$/, "");
export const siteTitle =
  "Jordão Qualho — Senior Software Engineer | Node.js, TypeScript & React";
export const siteDescription =
  "Senior Software Engineer with 6+ years of experience building production systems with Node.js, TypeScript, React, AWS and GCP. Full Stack engineer with strong backend expertise.";
