import { Hero } from "@/components/sections/Hero";
import { EngineeringCases } from "@/components/sections/EngineeringCases";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { About } from "@/components/sections/About";
import { AgentAccess } from "@/components/sections/AgentAccess";
import { Contact } from "@/components/sections/Contact";
import { PageTransition } from "@/components/motion/PageTransition";
export default function Home() {
  return (
    <PageTransition>
      <main id="main-content">
        <Hero />
        <EngineeringCases />
        <Experience />
        <Projects />
        <TechStack />
        <About />
        <AgentAccess />
        <Contact />
      </main>
    </PageTransition>
  );
}
