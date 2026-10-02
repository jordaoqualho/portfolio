import { getContent } from "@/data/content";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
export function About({ locale }: { locale: Locale }) {
  const { about, principles, profile } = getContent(locale);
  const t = ui(locale).about;
  return (
    <section id="about" className="container section about-section">
      <div className="editorial-grid">
        <div className="section-heading">
          <div>
            <h2>
              {t.title[0]}
              <br />
              {t.title[1]}
              <span className="accent">.</span>
            </h2>
          </div>
        </div>
        <div className="about-copy">
          {about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="profile-languages">{profile.languages}</p>
        </div>
      </div>
      <div className="principles editorial-grid">
        <h3>{t.howIWork}</h3>
        <ol>
          {principles.map((principle, i) => (
            <li key={principle.title}>
              <span>0{i + 1}</span>
              <div>
                <p>{principle.title}</p>
                <p className="principle-detail">{principle.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
