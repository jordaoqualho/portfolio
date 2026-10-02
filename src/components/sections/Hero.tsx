import Image from "next/image";
import { ArrowDown, Mail, MapPin } from "lucide-react";
import { profile, stats } from "@/data/profile";
import { HeroFacets } from "./HeroFacets";
import styles from "./Hero.module.css";
export function Hero() {
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
                  <span>Senior Software</span>
                </span>{" "}
                <span className="hero-line">
                  <span>
                    Engineer<span className="accent">.</span>
                  </span>
                </span>
              </h1>
              <HeroFacets />
              <p className="hero-description">
                6+ years building backend services, APIs and production
                systems for fintech, e-commerce and SaaS. Remote, from Brazil.
              </p>
              <div className="hero-ctas">
                <a className="button primary" href={`mailto:${profile.email}`}>
                  <Mail size={16} aria-hidden="true" />
                  Let’s talk
                </a>
                <a className="button secondary" href="#work">
                  View cases
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
      <section
        className="container snapshot"
        aria-label="Professional snapshot"
      >
        {stats.map((stat) => (
          <div key={stat.value}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>
    </>
  );
}
