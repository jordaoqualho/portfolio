import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { EngineeringCase } from "@/data/profile";
import { FORWARD } from "@/lib/motion";
export function CaseCard({ item }: { item: EngineeringCase }) {
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
            <Link href={`/work/${item.slug}/`} transitionTypes={[FORWARD]}>
              {item.title}
              <ArrowUpRight className="case-arrow" size={24} />
            </Link>
          </h3>
        </ViewTransition>
        <p className="case-summary">{item.summary}</p>
        <div className="case-evidence">
          <span>{item.outcome ? "OUTCOME" : "CONTRIBUTION"}</span>
          <p>{item.outcome || item.contribution[0]}</p>
        </div>
        <ul className="tech-list" aria-label="Technologies">
          {item.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
      <Link
        className="case-read"
        href={`/work/${item.slug}/`}
        transitionTypes={[FORWARD]}
        aria-label={`Read case: ${item.title}`}
      >
        Read case <ArrowUpRight size={16} />
      </Link>
    </article>
  );
}
