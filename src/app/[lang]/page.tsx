import { Hero } from "@/components/sections/Hero";
import { EngineeringCases } from "@/components/sections/EngineeringCases";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { About } from "@/components/sections/About";
import { AgentAccess } from "@/components/sections/AgentAccess";
import { Contact } from "@/components/sections/Contact";
import { PageTransition } from "@/components/motion/PageTransition";
import { localeMeta, type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { siteCopy, siteUrl } from "@/lib/site";
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const locale = (await params).lang as Locale;
  const pageUrl = `${siteUrl}${localePath(locale, "/")}`;
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${pageUrl}#profilepage`,
    url: pageUrl,
    name: siteCopy[locale].title,
    description: siteCopy[locale].description,
    inLanguage: localeMeta[locale].lang,
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: { "@id": `${siteUrl}/#person` },
  };
  return (
    <PageTransition>
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(profilePageSchema).replace(/</g, "\\u003c"),
          }}
        />
        <Hero locale={locale} />
        <EngineeringCases locale={locale} />
        <Experience locale={locale} />
        <Projects locale={locale} />
        <TechStack locale={locale} />
        <About locale={locale} />
        <AgentAccess locale={locale} />
        <Contact locale={locale} />
      </main>
    </PageTransition>
  );
}
