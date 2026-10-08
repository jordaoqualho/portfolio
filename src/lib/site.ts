export const siteUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://jordaoqualho.com"
).replace(/\/$/, "");
export const siteTitle =
  "Jordão Qualho, Senior Software Engineer | Node.js, TypeScript & React";
export const siteDescription =
  "Senior Software Engineer · Full Stack with backend depth. 6+ years in Node.js, TypeScript, React, AWS and Google Cloud Platform, including a financial platform with 7M+ active users. Brazil-based, open to remote roles.";
export const siteCopy = {
  en: { title: siteTitle, description: siteDescription },
  pt: {
    title: "Jordão Qualho, Engenheiro de Software Sênior | Node.js, TypeScript e React",
    description:
      "Engenheiro de Software Sênior · Full Stack com profundidade em backend. Mais de 6 anos com Node.js, TypeScript, React, AWS e Google Cloud Platform, incluindo uma plataforma financeira com mais de 7 milhões de usuários ativos. No Brasil, aberto a vagas remotas.",
  },
} as const;
