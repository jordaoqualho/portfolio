import { formatDates, getContent, roleMonths } from "@/data/content";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { TechTags } from "./TechTags";
import { Timeline } from "./Timeline";

export function Experience({ locale }: { locale: Locale }) {
  const t = ui(locale).experience;
  return (
    <section id="experience" className="container section experience-section">
      <div className="section-heading">
        <div>
          <h2>
            {t.title}
            <span className="accent">.</span>
          </h2>
        </div>
      </div>
      <Timeline>
        {getContent(locale).experience.map((role) => {
          const months = roleMonths(role.dates);
          const meta = [role.employment, role.location].filter(Boolean).join(" · ");
          const extra = Math.max(role.technologies.length - 6, 0);
          return (
            <article className="experience-row" key={role.company}>
              <div className="experience-date">
                <p>{formatDates(role.dates, locale)}</p>
                {months ? (
                  <p className="experience-duration">{t.duration(months)}</p>
                ) : (
                  <p className="role-current">
                    <span className="role-current-dot" aria-hidden="true" />
                    {t.current}
                  </p>
                )}
              </div>
              <div className="experience-content">
                <span className="timeline-node" aria-hidden="true" />
                <h3>{role.company}</h3>
                <p className="role-title">{role.title}</p>
                {meta && <p className="role-meta">{meta}</p>}
                <p className="role-summary">{role.summary}</p>
                {role.note && <p className="role-note">{role.note}</p>}
                <TechTags
                  items={role.technologies}
                  label={t.technologies}
                  moreLabel={t.showMore(extra)}
                  lessLabel={t.showLess}
                  lessText={t.less}
                />
              </div>
            </article>
          );
        })}
      </Timeline>
    </section>
  );
}
