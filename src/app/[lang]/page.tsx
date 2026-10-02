import { Hero } from "@/components/sections/Hero";
import { EngineeringCases } from "@/components/sections/EngineeringCases";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { About } from "@/components/sections/About";
import { AgentAccess } from "@/components/sections/AgentAccess";
import { Contact } from "@/components/sections/Contact";
import { PageTransition } from "@/components/motion/PageTransition";
import type { Locale } from "@/i18n/config";
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const locale = (await params).lang as Locale;
  return (
    <PageTransition>
      <main id="main-content">
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
