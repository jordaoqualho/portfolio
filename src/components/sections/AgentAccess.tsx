import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mcpClients, mcpTools } from "@/data/agents";
import { CopyCommand } from "@/components/agents/CopyCommand";
import { FORWARD } from "@/lib/motion";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
export function AgentAccess({ locale }: { locale: Locale }) {
  const t = ui(locale).agents;
  const claudeCode = mcpClients[0];
  return (
    <section id="agents" className="agents-section section">
      <div className="container editorial-grid">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t.eyebrow}</span>
            <h2>
              {t.title}
              <span className="accent">.</span>
            </h2>
            <p>{t.intro}</p>
          </div>
        </div>
        <div className="agents-body">
          <div className="agent-audience">
            <h3>{t.recruitersTitle}</h3>
            <p>{t.recruitersBody}</p>
            <blockquote className="agent-example">{t.example}</blockquote>
          </div>
          <div className="agent-audience">
            <h3>{t.engineersTitle}</h3>
            <p>{t.engineersBody(mcpTools.length)}</p>
            <ul className="tech-list" aria-label={t.tools}>
              {mcpTools.map((tool) => (
                <li key={tool.name}>{tool.name}</li>
              ))}
            </ul>
            <CopyCommand code={claudeCode.code} label={t.command} />
            <p className="agent-links">
              {t.rest}{" "}
              <Link href="/developers/" transitionTypes={[FORWARD]}>
                {t.apiDocs}
              </Link>{" "}
              · <a href="/openapi.json">{t.spec}</a>
            </p>
          </div>
          <Link
            href="/agents/"
            className="button primary agent-cta"
            transitionTypes={[FORWARD]}
          >
            {t.cta}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
