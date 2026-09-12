import Image from "next/image";
import { ArrowDown, ArrowUpRight, Github, MapPin } from "lucide-react";
import { profile, stats } from "@/data/profile";
import styles from "./Hero.module.css";
export function Hero() {
  return (
    <>
      <div className={styles.stage}>
        <div className={styles.ambientLight} aria-hidden="true" />
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-topline">
            <span className="eyebrow">JORDÃO QUALHO / ENGINEERING PROFILE</span>
            <span className="availability">
              <span aria-hidden="true" />
              {profile.availability}
            </span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 id="hero-title">
                Senior Software
                <br />
                Engineer<span className="accent">.</span>
              </h1>
              <p className="hero-focus">
                Full Stack with strong <strong>Backend depth.</strong>
              </p>
              <p className="hero-description">{profile.intro}</p>
              <p className="core-stack">{profile.core.join(" · ")}</p>
              <div className="hero-ctas">
                <a className="button primary" href="#work">
                  View engineering cases <ArrowDown size={17} aria-hidden="true" />
                </a>
                <a
                  className="button secondary"
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn (opens in a new tab)"
                >
                  LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <a
                  className="github-link"
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub (opens in a new tab)"
                >
                  <Github size={20} aria-hidden="true" />
                </a>
              </div>
            </div>
            <aside className="profile-aside">
              <div className={styles.portraitAtmosphere}>
                <div className={styles.portraitBlend}>
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
