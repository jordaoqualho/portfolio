import Image from "next/image";
import { ArrowDown, MapPin, Send } from "lucide-react";
import { getContent } from "@/data/content";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";
import { ProofStrip } from "./ProofStrip";
import { HeroFacets } from "./HeroFacets";
import styles from "./Hero.module.css";
export function Hero({ locale }: { locale: Locale }) {
  const { profile, facets, stats } = getContent(locale);
  const t = ui(locale).hero;
  return (
    <>
      <div className={styles.stage}>
        <div className={styles.ambientLight} aria-hidden="true" />
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-topline">
            <span className="availability">
              <span aria-hidden="true" />
              {profile.availability}
            </span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 id="hero-title" className="hero-title">
                <span className="hero-line">
                  <span>{t.titleLines[0]}</span>
                </span>{" "}
                <span className="hero-line">
                  <span>
                    {t.titleLines[1]}
                    <span className="accent">.</span>
                  </span>
                </span>
              </h1>
              <HeroFacets facets={facets} />
              <p className="hero-description">{t.description}</p>
              <a className="hero-ai-link" href="#agents">
                {t.aiProfile}
                <ArrowDown size={14} aria-hidden="true" />
              </a>
              <div className="hero-ctas">
                <a className="button primary" href="#contact-form">
                  <Send size={16} aria-hidden="true" />
                  {t.talk}
                </a>
                <a className="button secondary" href="#work">
                  {t.viewCases}
                  <ArrowDown size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
            <aside className="profile-aside">
              <div className={styles.portraitAtmosphere}>
                <div className={styles.portraitBlend} data-portrait>
                  <Image
                    className={styles.portraitImage}
                    src="/working.png"
                    alt="Jordão Qualho"
                    width={448}
                    height={500}
                    sizes="(max-width: 767px) 96px, (max-width: 1024px) 27vw, 336px"
                    priority
                  />
                </div>
              </div>
              <div className="portrait-caption">
                <span>{profile.name}</span>
                <span>
                  <MapPin size={13} aria-hidden="true" />
                  {profile.location}
                </span>
              </div>
            </aside>
          </div>
        </section>
      </div>
      <ProofStrip stats={stats} />
    </>
  );
}
