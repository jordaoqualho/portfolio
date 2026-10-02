import { formatDates, getContent } from "@/data/content";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
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
        {getContent(locale).experience.map((role) => (
          <article className="experience-row" key={role.company}>
            <p className="experience-date">{formatDates(role.dates, locale)}</p>
            <div className="experience-content">
              <span className="timeline-node" aria-hidden="true" />
              <h3>{role.company}</h3>
              <p className="role-title">{role.title}</p>
              <p className="role-summary">{role.summary}</p>
              {role.note && <p className="role-note">{role.note}</p>}
              <ul className="tech-list" aria-label={t.technologies}>
                {role.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </Timeline>
    </section>
  );
}
