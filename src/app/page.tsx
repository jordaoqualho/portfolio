import { Hero } from "@/components/sections/Hero";
import { Capabilities } from "@/components/sections/Capabilities";
import { EngineeringCases } from "@/components/sections/EngineeringCases";
import { Experience } from "@/components/sections/Experience";
import { TechStack } from "@/components/sections/TechStack";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { PageTransition } from "@/components/motion/PageTransition";
export default function Home() {
  return (
    <PageTransition>
      <main id="main-content">
        <Hero />
        <Capabilities />
        <EngineeringCases />
        <Experience />
        <TechStack />
        <About />
        <Contact />
      </main>
    </PageTransition>
  );
}
