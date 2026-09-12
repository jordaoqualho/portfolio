export const siteUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://jordao-qualho.vercel.app"
).replace(/\/$/, "");
export const siteTitle =
  "Jordão Qualho, Senior Software Engineer | Node.js, TypeScript & React";
export const siteDescription =
  "Senior Software Engineer · Full Stack with backend depth. 6+ years in Node.js, TypeScript, React, AWS and GCP, including a financial platform with 7M+ active users. Brazil-based, open to remote roles.";
