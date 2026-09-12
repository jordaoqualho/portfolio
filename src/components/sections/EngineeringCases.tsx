import { cases } from "@/data/profile";
import { CaseCard } from "@/components/work/CaseCard";
export function EngineeringCases() {
  return (
    <section className="section work-section" id="work">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / SELECTED WORK</span>
            <h2>
              Selected Engineering Cases<span className="accent">.</span>
            </h2>
            <p>
              Production problems: what broke, how I investigated, and what changed.
            </p>
          </div>
          <span className="section-note">03 CASE STUDIES</span>
        </div>
        <div>
          {cases.map((item) => (
            <CaseCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
