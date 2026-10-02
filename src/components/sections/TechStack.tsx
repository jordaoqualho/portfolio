import { getContent } from "@/data/content";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { stackEvidence } from "@/lib/stack";
import { StackExplorer } from "./StackExplorer";
export function TechStack({ locale }: { locale: Locale }) {
  const t = ui(locale).stack;
  return (
    <section id="stack" className="stack-section section">
      <div className="container stack-layout">
        <div className="section-heading">
          <div>
            <h2>
              {t.title}
              <span className="accent">.</span>
            </h2>
            <p>{t.intro}</p>
          </div>
        </div>
        <StackExplorer groups={stackEvidence(getContent(locale))} />
      </div>
    </section>
  );
}
