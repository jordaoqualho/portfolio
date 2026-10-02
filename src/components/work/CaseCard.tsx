import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { EngineeringCase } from "@/data/profile";
import { FORWARD } from "@/lib/motion";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { ui } from "@/i18n/ui";
export function CaseCard({ item, locale }: { item: EngineeringCase; locale: Locale }) {
  const t = ui(locale).work;
  return (
    <article className="case-row">
      <div className="case-number">{item.number}</div>
      <div className="case-body">
        <p className="eyebrow case-category">{item.category}</p>
        {/* Shares its name with the case page heading, so the title morphs across the navigation. */}
        <ViewTransition
          name={`case-${item.slug}`}
          share="case-morph"
          default="none"
        >
          <h3>
            {/* The link stretches over the whole row, so the full card is the click target. */}
            <Link
              className="case-link"
              href={localePath(locale, `/work/${item.slug}/`)}
              transitionTypes={[FORWARD]}
            >
              {item.title}
              <ArrowUpRight className="case-arrow" size={24} />
            </Link>
          </h3>
        </ViewTransition>
        <p className="case-summary">{item.summary}</p>
        <div className="case-evidence">
          <span>{item.outcome ? t.outcome : t.contribution}</span>
          <p>{item.outcome || item.contribution[0]}</p>
        </div>
        <ul className="tech-list" aria-label={ui(locale).casePage.technologies}>
          {item.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
      <span className="case-read" aria-hidden="true">
        {t.readCase} <ArrowUpRight size={16} />
      </span>
    </article>
  );
}
