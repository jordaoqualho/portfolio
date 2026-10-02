import { getContent } from "@/data/content";
import { CaseCard } from "@/components/work/CaseCard";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
export function EngineeringCases({ locale }: { locale: Locale }) {
  const t = ui(locale).work;
  return (
    <section className="section work-section" id="work">
      <div className="container">
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
        <div>
          {getContent(locale).cases.map((item) => (
            <CaseCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
